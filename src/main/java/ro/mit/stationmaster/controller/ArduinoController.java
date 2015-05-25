package ro.mit.stationmaster.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import ro.mit.stationmaster.dto.TrackDTO;
import ro.mit.stationmaster.layout.LayoutObserver;
import ro.mit.stationmaster.utils.SerialComm;


/**
 * Created by tmatrescu on 11/5/2015.
 */

@Controller
@RequestMapping("/command")
public class ArduinoController {

    @Autowired
    SerialComm serialComm;

    @Autowired
    LayoutObserver layoutObserver;

    @RequestMapping(value = "/line", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public int sendLineCommand(@RequestBody TrackDTO trackDTO) {
        System.out.println("viteza: " + trackDTO.getSpeed());
//        return layoutObserver.checkCommandValidity(trackDTO);
        return 1;
    }
}
