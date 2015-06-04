<!DOCTYPE html>
<html>

<head>
	<link href="resources/css/metro.css " rel="stylesheet" type="text/css">
	<link href="resources/css/jquery.nouislider.min.css" rel="stylesheet">
	<link href="resources/css/mainLayout.css" rel="stylesheet">
    <link href="resources/css/metro-icons.css" rel="stylesheet">

	<script src="resources/js/jquery-1.11.3.js"></script>
	<script src="resources/js/metro.min.js"></script>
	<script src="resources/js/jquery.nouislider.all.min.js"></script>
	<script src="resources/js/wNumb.min.js"></script>
	<script src="resources/js/speedControl.js" ></script>
    <script src="resources/js/sensorPolling.js" ></script>
    <script src="resources/js/responsive.js" ></script>
    <script src="resources/js/jquery.liblink.js" ></script>

</head>

<body>

	<div id="wrapper">
		<h1>${message}</h1>
        <div id="station_scheme">
            <div id="track_1">
                <img class ="track" src="resources/images/track.png">
            </div>
            <div class="spatiu">
                <img class="turnout" id="left_turnout_1" src="resources/images/left_switch.png">
            </div>
            <div id="track_25">
                <img class ="track" id="track_5" src="resources/images/track.png">
                <img class ="track" id="track_2" src="resources/images/track.png">
            </div>
            <div class="spatiu">
                <div class="turnout_toggle_wrapper">
                    <div id="turnout1_toggle" class="turnout_toggle" turnoutNumber="1"></div>
                </div>
                <div class="turnout_toggle_wrapper">
                    <div id="turnout5_toggle" class="turnout_toggle" turnoutNumber="5"></div>
                </div>
                <img class="turnout" id="left_turnout_2" src="resources/images/left_switch.png">
                <div class="turnout_toggle_wrapper">
                    <div id="turnout4_toggle" class="turnout_toggle" turnoutNumber="4"></div>
                </div>
                <img class="turnout" id="right_turnout_2" src="resources/images/right_switch.png">
            </div>
            <div id="track_3">
                <img class ="track" id="track_3_x" src="resources/images/track.png">
                <img class ="track" id="track_3_x_between" src="resources/images/track.png">
                <img class ="track" id='track_3_centre' src="resources/images/track.png">
                <img class ="track" id="track_3_y_between" src="resources/images/track.png">
                <img class ="track" id='track_3_y' src="resources/images/track.png">
            </div>
            <div class="spatiu">
                <div class="turnout_toggle_wrapper">
                    <div id="turnout3_toggle" class="turnout_toggle" turnoutNumber="3"></div>
                </div>
                <img class="turnout" id="right_turnout_4" src="resources/images/right_switch.png">
                <div class="turnout_toggle_wrapper">
                    <div id="turnout6_toggle" class="turnout_toggle" turnoutNumber="6"></div>
                </div>
                <div class="turnout_toggle_wrapper">
                    <div id="turnout2_toggle" class="turnout_toggle" turnoutNumber="2"></div>
                </div>
                <img class="turnout" id="left_turnout_4" src="resources/images/left_switch.png">
            </div>
            <div id="track_46">
                <img class ="track" id="track_4" src="resources/images/track.png">
                <img class ="track" id="track_6" src="resources/images/track.png">
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
