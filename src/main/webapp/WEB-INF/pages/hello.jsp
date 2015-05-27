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
    <script src="resources/js/jquery.liblink.js" ></script>

</head>

<body>

	<div id="wrapper">
		<h1>${message}</h1>
		<img src="resources/images/plan_statie.jpg" alt="plan statie">
		<div class="track_control">
            <h3 class="track_title">Track 1</h3>
			<div class="track_direction_toggle_wrapper">
				<p> B</p>
				<div id="track1_direction_toggle" class="toggle direction_toggler" trackNumber="1"></div>
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
                <div id="track2_direction_toggle" class="toggle direction_toggler" trackNumber="2"></div>
                <p>F</p>
            </div>
            <div class="track_speed_control_wrapper">
                <div id="track2_speed_control" class="speed_controller" trackNumber="2"></div>
            </div>
        </div>

	</div>

</body>
</html>
