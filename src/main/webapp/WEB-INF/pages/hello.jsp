<%--<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>--%>
<!DOCTYPE html>
<html>

<head>
	<link href="resources/css/metro.css " rel="stylesheet" type="text/css">
	<%--<link href="${pageContext.request.contextPath}/resources/css/metro.css" rel="stylesheet" >--%>
	<script src="resources/js/jquery-1.11.3.js"></script>
	<script src="resources/js/metro.js"></script>
	<link href="resources/js/noUiSlider.7.0.10/jquery.nouislider.min.css" rel="stylesheet">
	<script src="resources/js/noUiSlider.7.0.10/jquery.nouislider.all.min.js"></script>
	<script src="resources/js/wNumb.min.js"></script>

</head>

<body>
	<h1>${message}</h1>
	<p>Track 1 : direction[${direction}]</p>
	<p id="scrie">[${speed}]</p>
	<div id="slidere"></div>

<script>
	// On document ready, initialize noUiSlider.
	$(function(){

		$('#slidere').noUiSlider({
			start: 50,
			connect: 'lower',
			animate: false,
			range: {
				'min': 0,
				'max': 255
			},
			format: wNumb({
				decimals: 0
			})
		});

		$('#slidere').on('set', function(){
			console.log($(this).val());
			var vitez = $(this).val();
			var track = {
				number: 1,
				speed: Number(vitez),
				direction: "forward"
			};

			$.ajax({
				url: '/command/line',
				type: 'post',
				dataType: 'json',
				contentType: "application/json; charset=utf-8",
				data: JSON.stringify(track),
				success: function(data){
					if(data === 1) console.dir('iei');
					else console.dir('banana');
				}
			});
		});
		$('#slidere').Link('lower').to($('#scrie'));
	});

</script>

</body>
</html>