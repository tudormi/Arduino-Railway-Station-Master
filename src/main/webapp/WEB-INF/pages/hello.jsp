<!DOCTYPE html>
<html>

<head>
    <link href="resources/css/metro.css " rel="stylesheet" type="text/css">
    <link href="resources/css/jquery.nouislider.min.css" rel="stylesheet">
    <link href="resources/css/metro-icons.css" rel="stylesheet">
    <link href="resources/css/mainLayout.css" rel="stylesheet">

    <script src="resources/js/jquery-1.11.3.js"></script>
    <script src="resources/js/metro.min.js"></script>
    <script src="resources/js/jquery.nouislider.all.min.js"></script>
    <script src="resources/js/wNumb.min.js"></script>
    <script src="resources/js/speedControl.js"></script>
    <script src="resources/js/sensorPolling.js"></script>
    <script src="resources/js/responsive.js"></script>
    <script src="resources/js/jquery.liblink.js"></script>
    <script src="resources/js/reloadLayout.js"></script>
    <script src="resources/js/signals.js"></script>
</head>

<body>

<div id="wrapper">
    <h1>${message}</h1>

    <div id="station_scheme">
        <div id="track_1">
            <img class="track" src="resources/images/track_empty.png">
        </div>
        <div class="spatiu">
            <img class="turnout" id="left_turnout_1" src="resources/images/left_switch_empty.png">
        </div>
        <div id="track_25">
            <ul class="breadcrumbs2 mini" id="signal2_y" type="1" number="2" state="red">
                <li><a href="#"><span class="mif-traff fg-black"></span></a></li>
                <li color="green"><a href="#"><span class="mif-contrast fg-grayLight"></span></a></li>
                <li color="yellow"><a href="#"><span class="mif-contrast fg-grayLight"></span></a></li>
                <li color="red"><a href="#"><span class="mif-contrast fg-red"></span></a></li>
            </ul>
            <img class="track" id="track_5" src="resources/images/track_empty.png">
            <img class="track" id="track_2" src="resources/images/track_empty.png">
            <ul class="breadcrumbs2 mini" id="signal2_x" type="0" number="2" state="red">
                <li><a href="#"><span class="mif-traff fg-black"></span></a></li>
                <li color="red"><a href="#"><span class="mif-contrast fg-red"></span></a></li>
                <li color="yellow"><a href="#"><span class="mif-contrast fg-grayLight"></span></a></li>
                <li color="green"><a href="#"><span class="mif-contrast fg-grayLight"></span></a></li>
            </ul>
        </div>
        <div class="spatiu">
            <div class="turnout_toggle_wrapper">
                <div id="turnout1_toggle" class="turnout_toggle" turnoutNumber="1" blocked="false"></div>
            </div>
            <div class="turnout_toggle_wrapper">
                <div id="turnout5_toggle" class="turnout_toggle" turnoutNumber="5" blocked="false"></div>
            </div>
            <img class="turnout" id="left_turnout_2" src="resources/images/left_switch_empty.png">

            <div class="turnout_toggle_wrapper">
                <div id="turnout4_toggle" class="turnout_toggle" turnoutNumber="4" blocked="false"></div>
            </div>
            <img class="turnout" id="right_turnout_2" src="resources/images/right_switch_empty.png">
        </div>
        <div id="track_3">
            <ul class="breadcrumbs2 mini signal" id="signal0_x" type="0" number="0" state="red">
                <li><a href="#"><span class="mif-traff fg-black"></span></a></li>
                <li color="red"><a href="#"><span class="mif-contrast fg-red"></span></a></li>
                <li color="yellow"><a href="#"><span class="mif-contrast fg-grayLight"></span></a></li>
                <li color="green"><a href="#"><span class="mif-contrast fg-grayLight"></span></a></li>
            </ul>
            <img class="track" id="track_3_x" src="resources/images/track_empty.png">
            <img class="track" id="track_3_x_between" src="resources/images/track_empty.png">
            <ul class="breadcrumbs2 mini" id="signal3_y" type="1" number="3" state="red">
                <li><a href="#"><span class="mif-traff fg-black"></span></a></li>
                <li color="green"><a href="#"><span class="mif-contrast fg-grayLight"></span></a></li>
                <li color="yellow"><a href="#"><span class="mif-contrast fg-grayLight"></span></a></li>
                <li color="red"><a href="#"><span class="mif-contrast fg-red"></span></a></li>
            </ul>
            <img class="track" id='track_3_centre' src="resources/images/track_empty.png">
            <ul class="breadcrumbs2 mini" id="signal3_x" type="0" number="3" state="red">
                <li><a href="#"><span class="mif-traff fg-black"></span></a></li>
                <li color="red"><a href="#"><span class="mif-contrast fg-red"></span></a></li>
                <li color="yellow"><a href="#"><span class="mif-contrast fg-grayLight"></span></a></li>
                <li color="green"><a href="#"><span class="mif-contrast fg-grayLight"></span></a></li>
            </ul>
            <img class="track" id="track_3_y_between" src="resources/images/track_empty.png">
            <img class="track" id='track_3_y' src="resources/images/track_empty.png">
            <ul class="breadcrumbs2 mini signal" id="signal7_y" type="1" number="7" state="red">
                <li><a href="#"><span class="mif-traff fg-black"></span></a></li>
                <li color="green"><a href="#"><span class="mif-contrast fg-grayLight"></span></a></li>
                <li color="yellow"><a href="#"><span class="mif-contrast fg-grayLight"></span></a></li>
                <li color="red"><a href="#"><span class="mif-contrast fg-red"></span></a></li>
            </ul>
        </div>
        <div class="spatiu">
            <div class="turnout_toggle_wrapper">
                <div id="turnout3_toggle" class="turnout_toggle" turnoutNumber="3" blocked="false"></div>
            </div>
            <ul class="breadcrumbs2 mini signal" id="signal4_y" type="1" number="4" state="red">
                <li><a href="#"><span class="mif-traff fg-black"></span></a></li>
                <li color="green"><a href="#"><span class="mif-contrast fg-grayLight"></span></a></li>
                <li color="yellow"><a href="#"><span class="mif-contrast fg-grayLight"></span></a></li>
                <li color="red"><a href="#"><span class="mif-contrast fg-red"></span></a></li>
            </ul>
            <img class="turnout" id="right_turnout_4" src="resources/images/right_switch_empty.png">
            <ul class="breadcrumbs2 mini" id="signal4_x" type="0" number="4" state="red">
                <li><a href="#"><span class="mif-traff fg-black"></span></a></li>
                <li color="red"><a href="#"><span class="mif-contrast fg-red"></span></a></li>
                <li color="yellow"><a href="#"><span class="mif-contrast fg-grayLight"></span></a></li>
                <li color="green"><a href="#"><span class="mif-contrast fg-grayLight"></span></a></li>
            </ul>
            <div class="turnout_toggle_wrapper">
                <div id="turnout6_toggle" class="turnout_toggle" turnoutNumber="6" blocked="false"></div>
            </div>
            <div class="turnout_toggle_wrapper">
                <div id="turnout2_toggle" class="turnout_toggle" turnoutNumber="2" blocked="false"></div>
            </div>
            <img class="turnout" id="left_turnout_4" src="resources/images/left_switch_empty.png">
        </div>
        <div id="track_46">
            <img class="track" id="track_4" src="resources/images/track_empty.png">
            <img class="track" id="track_6" src="resources/images/track_empty.png">
        </div>
    </div>

    <div class="track_control">
        <h3 class="track_title">Track 1</h3>

        <div class="track_direction_toggle_wrapper">
            <p> B</p>

            <div id="track1_direction_toggle" class="track_toggle" trackNumber="1"></div>
            <p>F</p>
        </div>
        <div class="track_speed_control_wrapper">
            <div id="track1_speed_control" class="speed_controller" trackNumber="1"></div>
        </div>
    </div>

    <div class="track_control">
        <h3 class="track_title">Track 2</h3>

        <div class="track_direction_toggle_wrapper">
            <p>B</p>

            <div id="track2_direction_toggle" class="track_toggle" trackNumber="2"></div>
            <p>F</p>
        </div>
        <div class="track_speed_control_wrapper">
            <div id="track2_speed_control" class="speed_controller" trackNumber="2"></div>
        </div>
    </div>

</div>

</body>
</html>
