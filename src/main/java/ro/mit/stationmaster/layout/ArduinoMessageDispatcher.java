package ro.mit.stationmaster.layout;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import ro.mit.stationmaster.dto.TrackDTO;
import ro.mit.stationmaster.utils.SerialComm;

/**
 * @author Tudor Matrescu
 */

public class ArduinoMessageDispatcher {

    @Autowired
    LayoutObserver layoutObserver;

    @Autowired
    SerialComm serialComm;

    public void parseMessage(String message) {
        //parse message and see what object will be
        System.out.println(message);
        JSONObject jsonObject = new JSONObject(message);
        System.out.println(jsonObject.get("track"));
        System.out.println(jsonObject.get("type"));
        parseSensorkMessage(message);
    }

    public void parseSensorkMessage(String message) {
        //parse message and populate track object then call updateLayout
        IRSensor irSensor = new IRSensor();
        JSONObject jsonObject = new JSONObject(message);
        irSensor.setLineNumber(jsonObject.getInt("track"));
        irSensor.setType(jsonObject.getString("type"));
        layoutObserver.updateLayoutFromArduino(irSensor);
    }

    public void sendTrackMessage(TrackDTO trackDTO){
        serialComm.sendData("{\"type\": \"line\",\"line\":{\"number\":"+trackDTO.getNumber() +",\"speed\":"+ trackDTO.getSpeed() +",\"direction\":\""+trackDTO.getDirection()+"\"}}");
    }

}
