package ro.mit.stationmaster.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.async.DeferredResult;
import ro.mit.stationmaster.dto.IRSensorDTO;
import ro.mit.stationmaster.dto.TrackDTO;
import ro.mit.stationmaster.layout.IRSensor;
import ro.mit.stationmaster.layout.LayoutObserver;
import ro.mit.stationmaster.layout.Signal;
import ro.mit.stationmaster.layout.Turnout;
import ro.mit.stationmaster.service.SensorUpdateService;
import ro.mit.stationmaster.utils.SerialComm;


/**
 * Created by tmatrescu on 11/5/2015.
 */

@Controller
@RequestMapping("/command")
public class ArduinoController {

    @Autowired
    SensorUpdateService sensorUpdateService;

    @Autowired
    SerialComm serialComm;

    @Autowired
    LayoutObserver layoutObserver;

    @RequestMapping(value = "/line", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public int sendLineCommand(@RequestBody TrackDTO trackDTO) {
//        return layoutObserver.checkCommandValidity(trackDTO);
        return 1;
    }

    @RequestMapping(value = "/turnout", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public int sendTurnoutCommand(@RequestBody Turnout turnout) {
        layoutObserver.updateLayout(turnout);
//        if(turnout.getNumber() == 1 || turnout.getNumber()==5)return 0;
        return 1;
    }

    @RequestMapping(value = "/signal", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public int sendSignalCommand(@RequestBody Signal signal) {
        return layoutObserver.checkCommandValidity(signal);
    }

    @RequestMapping(value = "/getSensor", method = RequestMethod.GET)
    @ResponseBody
    public DeferredResult<IRSensorDTO> getSensors() {
        final DeferredResult<IRSensorDTO> deferredResult = new DeferredResult<IRSensorDTO>();
        sensorUpdateService.getUpdate(deferredResult);
        return deferredResult;
    }

    @RequestMapping(value = "/localStorage", method = RequestMethod.GET)
    @ResponseBody
    public int localStorage() {
        if (layoutObserver.getLocalStorageClearFlag() == 0) {
            layoutObserver.setLocalStorageClearFlag(1);
            return 0;
        } else return 1;
    }

    @RequestMapping(value = "/test", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public IRSensorDTO test(@RequestBody IRSensor irSensor) {
        return layoutObserver.updateLayoutFromArduino(irSensor);
//        return 1;
    }
}
