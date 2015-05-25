<!DOCTYPE html>
<html>

<head>
	<link href="resources/css/metro.css " rel="stylesheet" type="text/css">
	<link href="resources/css/jquery.nouislider.min.css" rel="stylesheet">
	<link href="resources/css/mainLayout.css" rel="stylesheet">

	<script src="resources/js/jquery-1.11.3.js"></script>
	<script src="resources/js/metro.min.js"></script>
	<script src="resources/js/jquery.nouislider.all.min.js"></script>
	<script src="resources/js/wNumb.min.js"></script>
	<script src="resources/js/speedControl.js" ></script>

</head>

<body>

	<div id="wrapper">
		<h1>${message}</h1>
		<img src="resources/images/plan_statie.jpg" alt="plan statie">
		<h3>Linia 1</h3>
		<div id="track1_control">
			<div id="track1_direction_toggle_wrapper">
				<label>Forward</label>
				<div id="track1_direction_toggle" class="toggle direction_toggler" trackNumber="1"></div>
				<label>Backward</label>
			</div>
			<div id="track1_speed_control_wrapper">
				<div id="track1_speed_control" class="speed_controller" trackNumber="1"></div>
			</div>
		</div>
		<p class="centre" >Track 1: Direction[${direction}]</p>
		<p class="centre" id="viewSpeed_track1">Viteza: <span>[${speed}]</span></p>
	</div>

</body>
</html>