package ro.mit.stationmaster.layout;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import ro.mit.stationmaster.dto.TrackDTO;
import ro.mit.stationmaster.trackElements.IRSensor;
import ro.mit.stationmaster.trackElements.Turnout;
import ro.mit.stationmaster.utils.SerialComm;

/**
 * @author Tudor Matrescu
 */

public class ArduinoMessageDispatcher {

    private final static Logger logger = LogManager.getLogger(LayoutObserver.class);

    @Autowired
    LayoutObserver layoutObserver;

    @Autowired
    SerialComm serialComm;

    public void parseMessageFromArduino(String message) {
        logger.info(message);
        parseSensorkMessage(message);
    }

    public void parseSensorkMessage(String message) {
        IRSensor irSensor = new IRSensor();
        JSONObject jsonObject = new JSONObject(message);
        irSensor.setTrack(jsonObject.getInt("track"));
        layoutObserver.updateLayoutFromArduino(irSensor);
    }

    public void sendTrackMessage(TrackDTO trackDTO){
        JSONObject message = new JSONObject();
        JSONObject track = new JSONObject();
        message.put("track", track);
        track.put("number", trackDTO.getNumber());
        track.put("speed", trackDTO.getSpeed());
        track.put("direction", trackDTO.getDirection());

        System.out.println(message.toString());
//        System.out.println("{\"type\": \"line\",\"line\":{\"number\":" + trackDTO.getNumber() + ",\"speed\":" + trackDTO.getSpeed() + ",\"direction\":\"" + trackDTO.getDirection()+"\"}}");
//        serialComm.sendData("{\"type\": \"line\",\"line\":{\"number\":" + trackDTO.getNumber() + ",\"speed\":" + trackDTO.getSpeed() + ",\"direction\":\"" + trackDTO.getDirection()+"\"}}");
        serialComm.sendData(message.toString());
    }

    public void sendTurnoutMessage(Turnout turnout){
        JSONObject message = new JSONObject();
        JSONObject turnoutJSON = new JSONObject();
        message.put("turnout", turnoutJSON);
        turnoutJSON.put("number", turnout.getNumber());
        turnoutJSON.put("direction", turnout.getDirection());
        serialComm.sendData(message.toString());
    }
}
