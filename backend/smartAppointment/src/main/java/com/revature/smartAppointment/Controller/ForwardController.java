package com.revature.smartAppointment.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ForwardController {

    // forward non‑API paths to index.html
    @GetMapping(value = "/{path:[^\\.]*}")
    public String forward() {
        return "forward:/index.html";
    }
}

