package ro.mit.stationmaster.layout;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import ro.mit.stationmaster.dto.IRSensorDTO;
import ro.mit.stationmaster.dto.TrackDTO;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.concurrent.LinkedBlockingQueue;

/**
 * Created by Tudormi on 15/5/2015.
 */
public class LayoutObserver {

    private final static Logger logger = LogManager.getLogger(LayoutObserver.class);

    @Autowired
    LinkedBlockingQueue<IRSensorDTO> queue;

    @Autowired
    ArduinoMessageDispatcher arduinoMessageDispatcher;

    private ArrayList<Track> tracks;
    private ArrayList<Turnout> turnouts;
    private HashMap<String, Signal> signals;
    private int localStorageClearFlag;
    private int mutualExclusionX;
    private int mutualExclusionY;

    LayoutObserver() {
        /* initially all the lines are empty with 0 speed */
        /* 0 - linie intrare, 5 - linie iesire */
        tracks = new ArrayList<Track>();
        for (int i = 0; i < 8; i++) {
            tracks.add(new Track(i, 0, "forward", "empty", 0));
        }
        /* initially all the turnouts are on the straight way */
        turnouts = new ArrayList<Turnout>();
        for (int i = 0; i < 6; i++) {
            turnouts.add(new Turnout(i + 1, 0));
        }

        signals = new HashMap<String, Signal>();
        for (int i = 0; i < 8; i++) {
            signals.put("signal0_x", new Signal(0, 0, "red"));
            signals.put("signal2_x", new Signal(2, 0, "red"));
            signals.put("signal2_y", new Signal(2, 1, "red"));
            signals.put("signal3_x", new Signal(3, 0, "red"));
            signals.put("signal3_y", new Signal(3, 1, "red"));
            signals.put("signal4_x", new Signal(4, 0, "red"));
            signals.put("signal4_y", new Signal(4, 1, "red"));
            signals.put("signal7_y", new Signal(7, 1, "red"));
        }

        localStorageClearFlag = 0;
        mutualExclusionX = 0;
        mutualExclusionY = 0;
    }

    public int getLocalStorageClearFlag() {
        return localStorageClearFlag;
    }

    public void setLocalStorageClearFlag(int localStorageClearFlag) {
        this.localStorageClearFlag = localStorageClearFlag;
    }

    public IRSensorDTO updateLayoutFromArduino(IRSensor sensor) {
        IRSensorDTO irSensorDTO = new IRSensorDTO();
        int trackNumber = sensor.getTrack();
        switch (trackNumber) {
            case 0:
                tracks.get(0).setState("present");
                irSensorDTO = new IRSensorDTO(0, "present", sensor.getOrientation(), 0);
                queue.add(irSensorDTO);
                return irSensorDTO;

            case 7:
                tracks.get(7).setState("present");
                irSensorDTO = new IRSensorDTO(7, "present", sensor.getOrientation(), 0);
                queue.add(irSensorDTO);
                return irSensorDTO;

            case 1:
            case 2:
            case 3:
            case 4:
                if (sensor.getOrientation() == 0) {//s-a calcat senzorul x al liniei
                    if (tracks.get(trackNumber).getSensorCounter() == 0) { // vine dinspre x
                        tracks.get(trackNumber).setSensorCounter(1);
                        tracks.get(trackNumber).setState("present");
                        irSensorDTO = new IRSensorDTO(trackNumber, tracks.get(trackNumber).getState(), sensor.getOrientation(), 0);
                    } else {//vine dinspre y, deci eliberam y deoarece trenul a garat
                        tracks.get(7).setState("empty");
                        irSensorDTO = new IRSensorDTO(7, "empty", sensor.getOrientation(), 1);
                    }
                } else {// s-a calcat senzorul y al liniei
                    if (tracks.get(trackNumber).getSensorCounter() == 0) { // vine dinspre iesire
                        tracks.get(trackNumber).setSensorCounter(1);
                        tracks.get(trackNumber).setState("present");
                        irSensorDTO = new IRSensorDTO(trackNumber, tracks.get(trackNumber).getState(), sensor.getOrientation(), 0);
                    } else { //vine dinspre x, deci eliberam x deoarece trenul a garat
                        tracks.get(0).setState("empty");
                        irSensorDTO = new IRSensorDTO(0, "empty", sensor.getOrientation(), 1);
                    }
                }
                queue.add(irSensorDTO);
                return irSensorDTO;
        }
        return irSensorDTO;
    }

    public void updateLayout(TrackDTO trackDTO) {
        int lineNumber = trackDTO.getNumber();
        logger.info("Linia: " + lineNumber + " , viteza: " + trackDTO.getSpeed());
        tracks.get(lineNumber).setSpeed(trackDTO.getSpeed());
        tracks.get(lineNumber).setDirection(trackDTO.getDirection());
    }

    public void updateLayout(Turnout turnout) {
        turnouts.get(turnout.getNumber() - 1).setDirection(turnout.getDirection());
    }

    public int checkCommandValidity(TrackDTO trackDTO) {
        if (trackDTO.getSpeed() > 254) {
            return 0;
        } else {
            int lineNumber = trackDTO.getNumber();
            if (tracks.get(lineNumber).getSpeed() > trackDTO.getSpeed() && (tracks.get(lineNumber).getSpeed() - trackDTO.getSpeed()) > 10) {
                //ar trebui sa trimita mesaj mai rar cu o crestere treptata a vitezei
            }
            arduinoMessageDispatcher.sendTrackMessage(trackDTO);
        }
        updateLayout(trackDTO);

        return 1;
    }

    public int checkCommandValidity(Signal signal) {

        switch (signal.getNumber()) {
            case 0: //linia de intrare
                if (signal.getColor().equals("green") || signal.getColor().equals("yellow")) {
                    if (tracks.get(1).getState().equals("present") && tracks.get(2).getState().equals("present") && tracks.get(3).getState().equals("present")) {
                        return 0; // toate liniile din statie sunt ocupate
                    }
                    if (signals.get("signal2_y").getColor().equals("green") || signals.get("signal3_y").getColor().equals("green")
                            || signals.get("signal4_y").getColor().equals("green")) {
                        return 0; //unul din semnalele de iesire este pe verde
                    }
                    // succes la punerea semnalului pe verde
//                    if (turnouts.get(0).getDirection() == 1) tracks.get(2).setState("present");
//                    else if (turnouts.get(2).getDirection() == 0) tracks.get(3).setState("present");
//                    else tracks.get(4).setState("present");
                    StringBuilder stringKey = new StringBuilder();
                    stringKey.append("signal").append(signal.getNumber());
                    if(signal.getType() == 0) stringKey.append("x");
                    else stringKey.append("y");
                    signals.get(stringKey.toString()).setColor(signal.getColor());
                    return 1;
                } else return 0;

            case 2:
            case 3:
            case 4:
                if (signal.getColor().equals("green") || signal.getColor().equals("yellow")) {
                    if (signal.getType() == 0) {
                        if (mutualExclusionY == 1) return 0; //alt semnal x este pus pe liber
                        if (tracks.get(7).getState().equals("present")) return 0; // linia 7 este ocupata
                        if (signals.get("signal7_y").getColor().equals("green") || signals.get("signal7_y").getColor().equals("yellow"))
                            return 0; //semnalul y este pe liber
                    } else {
                        if (mutualExclusionX == 1) return 0; //alt semnal x este pus pe liber
                        if (tracks.get(0).getState().equals("present")) return 0; //linia 0 este ocupata
                        if (signals.get("signal0_x").getColor().equals("green") || signals.get("signal0_x").getColor().equals("yellow"))
                            return 0; //semnalul x este pe liber
                    }

                    // s-a reusit punerea semnalului pe liber
                    StringBuilder stringKey = new StringBuilder();
                    stringKey.append("signal").append(signal.getNumber());
                    if(signal.getType() == 0) stringKey.append("x");
                    else stringKey.append("y");
                    signals.get(stringKey.toString()).setColor(signal.getColor());
                    return 1;
                }
                break;

            case 7: //linia de iesire
                if (signal.getColor().equals("green") || signal.getColor().equals("yellow")) {
                    if (tracks.get(1).getState().equals("present") && tracks.get(2).getState().equals("present") && tracks.get(3).getState().equals("present")) {
                        return 0; // toate liniile din statie sunt ocupate
                    }
                    if (signals.get("signal2_x").getColor().equals("green") || signals.get("signal3_x").getColor().equals("green")
                            || signals.get("signal4_x").getColor().equals("green")) {
                        return 0; //unul din semnalele de iesire este pe verde
                    }

                    // s-a reusit punerea semnalului pe liber
                    StringBuilder stringKey = new StringBuilder();
                    stringKey.append("signal").append(signal.getNumber());
                    if(signal.getType() == 0) stringKey.append("_x");
                    else stringKey.append("_y");
                    signals.get(stringKey.toString()).setColor(signal.getColor());
                    return 1;

                    // succes la punerea semnalului pe verde
//                    if (turnouts.get(1).getDirection() == 1) tracks.get(4).setState("present");
//                    else if (turnouts.get(3).getDirection() == 0) tracks.get(3).setState("present");
//                    else tracks.get(2).setState("present");
//                    return 1;
                } else return 0;
        }
        return 0;
    }

    public Track getTrack(int trackNumber) {
        return tracks.get(trackNumber);
    }

    public Turnout getTurnout(int turnoutNumber) {
        return turnouts.get(turnoutNumber);
    }
}
