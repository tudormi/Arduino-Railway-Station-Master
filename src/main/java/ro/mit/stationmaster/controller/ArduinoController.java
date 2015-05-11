package ro.mit.stationmaster.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import ro.mit.stationmaster.layout.Track;

/**
 * Created by tmatrescu on 11/5/2015.
 */

@Controller
@RequestMapping("/command")
public class ArduinoController {

    @RequestMapping("/line")
    @ResponseBody
    public Track commandLine(){


//        @RequestMapping(value = {"/employees/{employeeId}/edit"}, method = RequestMethod.GET)
//        @ResponseBody
//        public String editEmployee(@PathVariable String employeeId, HttpServletRequest request, HttpServletResponse httpResponse) {
//            Map<String, String[]> requestParams = request.getParameterMap();
//            StringBuilder errors = new StringBuilder();
//            try {

    }
}
