package ro.mit.stationmaster.layout;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import ro.mit.stationmaster.dto.IRSensorDTO;
import ro.mit.stationmaster.dto.TrackDTO;

import java.util.ArrayList;
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
    private int localStorageClearFlag;

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

        localStorageClearFlag = 0;
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
//                break;

            case 1:
            case 2:
            case 3:
            case 4:
                if(sensor.getOrientation() == 0){
                    //s-a calcat senzorul x al liniei
                    if(tracks.get(trackNumber).getSensorCounter() == 0){
                        // vine dinspre intrare
                        tracks.get(trackNumber).setSensorCounter(1);
                        irSensorDTO = new IRSensorDTO(trackNumber, tracks.get(trackNumber).getState(), sensor.getOrientation(), 0);
                    } else{
                        //vine dinspre y, deci eliberam y deoarece trenul a garat
                        tracks.get(7).setState("empty");
                        irSensorDTO = new IRSensorDTO(7, "empty", sensor.getOrientation(), 1);
                    }
                } else{
                    // s-a calcat senzorul y al liniei
                    if(tracks.get(trackNumber).getSensorCounter() == 0){
                        // vine dinspre iesire
                        tracks.get(trackNumber).setSensorCounter(1);
                        irSensorDTO = new IRSensorDTO(trackNumber, tracks.get(trackNumber).getState(), sensor.getOrientation(), 0);
                    } else{
                        //vine dinspre x, deci eliberam x deoarece trenul a garat
                        tracks.get(0).setState("empty");
                        irSensorDTO = new IRSensorDTO(0, "empty", sensor.getOrientation(), 1);
                    }
                }
                queue.add(irSensorDTO);
                return irSensorDTO;
//                break;
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
//        System.out.println("Turnout " + turnout.getNumber() + " changed to [" + turnout.getDirection() + "]");
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

    public int checkCommandValidity(Turnout turnout) {

        switch (turnout.getNumber()) {
            case 1:
                if (turnout.getDirection() == 1 && tracks.get(2).getState().equals("present") && tracks.get(0).getState().equals("present")) {
                    /* linia 2 este ocupata si intrarea, macazele nu se pot schimba */
                    return 0;
                } else {
                    /* one of the line is not occupied and the turnouts are ok to change */
                    updateLayout(turnout);
                    turnout.setNumber(5);
                    updateLayout(turnout);
                }
                break;

            case 5:
                if (turnout.getDirection() == 1 && tracks.get(2).getState().equals("present") && tracks.get(0).getState().equals("present")) {
                    /* linia 2 este ocupata si intrarea, macazele nu se pot schimba */
                    return 0;
                } else {
                    /* one of the line is not occupied and the turnouts are ok to change */
                    updateLayout(turnout);
                    turnout.setNumber(1);
                    updateLayout(turnout);
                }
                break;
        }

        return 1;
    }

    public int checkCommandValidity(Signal signal) {

        switch (signal.getNumber()) {
            case 0: //linia de intrare
                if (tracks.get(1).getState().equals("present") && tracks.get(2).getState().equals("present") && tracks.get(3).getState().equals("present")) {
                    return 0; // toate liniile din statie sunt ocupate
                }
                if (turnouts.get(0).getDirection() == 1 && tracks.get(2).getState().equals("present")) {
                    return 0; //incearca sa puna macazul 1 pe abatuta dar linia 2 este ocupata
                } else if (turnouts.get(2).getDirection() == 0 && tracks.get(3).getState().equals("present")) {
                    return 0; //macazul 1 pe direct, macazul 3 pe directa, dar linia 3 este ocupata
                } else if (turnouts.get(2).getDirection() == 1 && tracks.get(4).getState().equals("present")) {
                    return 0; //macazul 3 pe abatuta, dar linia 4 ocupata
                }
                // succes la punerea semnalului pe verde
                if (turnouts.get(0).getDirection() == 1) tracks.get(2).setState("present");
                else if (turnouts.get(2).getDirection() == 0) tracks.get(3).setState("present");
                else tracks.get(4).setState("present");
                return 1;
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
