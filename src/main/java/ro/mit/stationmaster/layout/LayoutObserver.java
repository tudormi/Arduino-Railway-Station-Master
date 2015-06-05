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

    LayoutObserver() {
        /* initially all the lines are empty with 0 speed */
        /* 0 - linie intrare, 5 - linie iesire */
        tracks = new ArrayList<Track>();
        for (int i = 0; i < 8; i++) {
            tracks.add(new Track(i, 0, "forward", "empty"));
        }
        /* initially all the turnouts are on the straight way */
        turnouts = new ArrayList<Turnout>();
        for (int i = 0; i < 6; i++) {
            turnouts.add(new Turnout(i + 1, 0));
        }
    }

    public IRSensorDTO updateLayoutFromArduino(IRSensor sensor) {
        IRSensorDTO irSensorDTO = new IRSensorDTO();
        switch (sensor.getTrack()) {
            case 0:
                if (tracks.get(0).getState().equals("empty")) {
                    tracks.get(0).setState("present");
                } else if (tracks.get(0).getState().equals("present")) {
                    /* trenul vine dinspre modulul vecin, se blocheaza parcursul*/
                    if (sensor.getOrientation() == 1) {
                        //trebuie blocat parcursul
                    }
                    tracks.get(0).setState("empty");
                }
                irSensorDTO = new IRSensorDTO(0, tracks.get(0).getState(), sensor.getOrientation());
                queue.add(irSensorDTO);
                return irSensorDTO;
//                break;

            case 1:
            case 2:
            case 3:
            case 4:
                if (tracks.get(sensor.getTrack()).getState().equals("empty")) {
                    tracks.get(sensor.getTrack()).setState("present");
                } else if (tracks.get(sensor.getTrack()).getState().equals("present")) {
                    tracks.get(sensor.getTrack()).setState("empty");
                }
                irSensorDTO = new IRSensorDTO(sensor.getTrack(), tracks.get(sensor.getTrack()).getState(), sensor.getOrientation());
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
        System.out.println("Turnout " + turnout.getNumber() + " changed to [" + turnout.getDirection() + "]");
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
                
                break;
        }

        return 1;
    }

    public Track getTrack(int trackNumber) {
        return tracks.get(trackNumber);
    }

    public Turnout getTurnout(int turnoutNumber) {
        return turnouts.get(turnoutNumber);
    }
}
