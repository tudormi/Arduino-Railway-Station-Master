package ro.mit.stationmaster.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import ro.mit.stationmaster.layout.Track;
import ro.mit.stationmaster.utils.SerialComm;


/**
 * Created by tmatrescu on 11/5/2015.
 */

@Controller
@RequestMapping("/rest")
public class ArduinoController {

    @Autowired
    SerialComm serialComm;

    @RequestMapping(value = "/line", produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET)
    @ResponseBody
    public Track commandLine() {
        System.out.println("{\"type\": \"line\",\"line\":{\"number\":1,\"speed\":234,\"direction\":\"fw\"}}");
        serialComm.sendData("{\"type\": \"line\",\"line\":{\"number\":1,\"speed\":234,\"direction\":\"fw\"}}");
        return new Track(1, 234, "fw");
    }
}
