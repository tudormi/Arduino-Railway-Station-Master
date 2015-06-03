package ro.mit.stationmaster.layout;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import ro.mit.stationmaster.dto.TrackDTO;
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
//        JSONObject jsonObject = new JSONObject(message);
//        String type = jsonObject.getString("type");
//        System.out.println(jsonObject.getString("type"));
//        jsonObject = jsonObject.getJSONObject(type);
        parseSensorkMessage(message);
    }

    public void parseSensorkMessage(String message) {
        IRSensor irSensor = new IRSensor();
        JSONObject jsonObject = new JSONObject(message);
        irSensor.setLineNumber(jsonObject.getInt("track"));
        irSensor.setState(jsonObject.getString("state"));
        layoutObserver.updateLayoutFromArduino(irSensor);
    }

    public void sendTrackMessage(TrackDTO trackDTO){
        StringBuilder command = new StringBuilder();
        command.append("{\"type\": \"line\",");
        command.append("\"line\":{\"number\":");
        command.append(trackDTO.getNumber());
        command.append(",\"speed\":");
        command.append(trackDTO.getSpeed());
        command.append(",\"direction\":\"");
        command.append(trackDTO.getDirection());
        command.append("\"}}");
        System.out.println(command.toString());
        System.out.println("{\"type\": \"line\",\"line\":{\"number\":" + trackDTO.getNumber() + ",\"speed\":" + trackDTO.getSpeed() + ",\"direction\":\"" + trackDTO.getDirection()+"\"}}");
        serialComm.sendData("{\"type\": \"line\",\"line\":{\"number\":" + trackDTO.getNumber() + ",\"speed\":" + trackDTO.getSpeed() + ",\"direction\":\"" + trackDTO.getDirection()+"\"}}");
    }

}
