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
    /* se apasa pe un buton legat de functionalitate liniei: viteza de exemplu
    * se face un call ajax catre acest controller si se pun parametrii liniei
    * nr linie, viteza, si in functie de orientarea slider-ului se face din frontend firectia*/
//    @RequestMapping(value = "/line", produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET)
//    @ResponseBody
//    public Track commandLine() {
//        System.out.println("{\"type\": \"line\",\"line\":{\"number\":1,\"speed\":234,\"direction\":\"fw\"}}");
//        serialComm.sendData("{\"type\": \"line\",\"line\":{\"number\":1,\"speed\":234,\"direction\":\"fw\"}}");
//        return new Track(1, 234, "fw");
//    }

    @RequestMapping(value = "/line", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public int sendLineCommand(@RequestBody TrackDTO trackDTO) {
        System.out.println("viteza: " + trackDTO.getSpeed());
        return layoutObserver.checkCommandValidity(trackDTO);
    }
}
