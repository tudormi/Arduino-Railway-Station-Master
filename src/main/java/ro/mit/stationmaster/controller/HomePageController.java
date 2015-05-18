package ro.mit.stationmaster.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import ro.mit.stationmaster.layout.LayoutObserver;

/**
 * Created by Tudormi on 16/5/2015.
 */

/* o singura pagina cu multe call-uri ajax? da */
@Controller
public class HomePageController {

    @Autowired
    LayoutObserver layoutObserver;

    @RequestMapping(value = "", method = RequestMethod.GET)
    public String layoutOverview(ModelMap modelMap){
        modelMap.addAttribute("message", "asdasd");
        modelMap.addAttribute("speed", layoutObserver.getTrack(1).getSpeed());
        modelMap.addAttribute("direction", layoutObserver.getTrack(1).getDirection());
        return "hello";
    }

}
