/**
 * Created by Tudormi on 19/5/2015.
 */
$(document).ready(function () {

    /* Speed slider initializations */
    initializeTrackControllers(1);
    initializeTrackControllers(2);
    initializeTurnoutControllers(1);
    initializeTurnoutControllers(5);
    initializeTurnoutControllers(3);
    initializeTurnoutControllers(4);
    initializeTurnoutControllers(2);
    initializeTurnoutControllers(6);

    $('.tooltip').hide();

    /* Ajax calls for speed on slide movement */
    var timer = null;
    var lastSentValue = null;
    var frequencyInMs = 500;

    var track = {
        number: 0,
        speed: 0,
        direction: "forward"
    };

    var updateServerValue = function (trackNumber) {
        if (timer === null) {
            timer = setInterval(function () {
                var newValue = Math.round(Number($('#track' + trackNumber + '_speed_control').val()));
                if (newValue !== lastSentValue) {
                    sendValue(newValue, trackNumber);
                } else {
                    clearInterval(timer);
                    timer = null;
                }
            }, frequencyInMs);
        }
    };

    var sendValue = function (newValue, trackNumber) {

        track.speed = newValue;
        track.number = trackNumber;

        $.ajax({
            url: '/command/line',
            type: 'post',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(track),
            success: function (data) {
                console.dir(track);
                updateLastSentValue(newValue, trackNumber);
            }
        });
    };

    var updateLastSentValue = function (newValue, trackNumber) {
        lastSentValue = newValue;
        if (newValue === 0) {
            $('#track' + trackNumber + '_direction_toggle').removeAttr('disabled');
            $('#track' + trackNumber + '_speed_control .tooltip').hide();
        } else {
            $('#track' + trackNumber + '_direction_toggle').attr('disabled', 'disabled');
            $('#track' + trackNumber + '_speed_control .tooltip').show();
        }
    };

    $('.speed_controller').on('slide', function () {
        var trackNumber = Number($(this).attr('trackNumber'));
        updateServerValue(trackNumber);
    });

    /* Stop the train(set speed to 0) when user changes the direction */

    var reverseTrackDirection = function (trackNumber) {
        sendValue(0, trackNumber);
        $('#track' + trackNumber + '_speed_control').val(0);
    }

    $('.direction_toggler').on('slide', function (event) {
        /* forward = 1, backward = 0 */
        var trackNumber = Number($(this).attr('trackNumber'));
        if (Number($(this).val()) === 1) {
            track.direction = 'forward';
            reverseTrackDirection(trackNumber);
        } else {
            track.direction = 'backwards';
            reverseTrackDirection(trackNumber);
        }
    });

    var turnout ={
        number: 0,
        direction: 0
    };

    $('.turnout_toggle').on('slide', function () {
        turnout.number = Number($(this).attr('turnoutNumber'));
        turnout.direction = Number($(this).val());
        changeRoute(turnout.number, turnout.direction);
        /* 0 - directa, 1 - abatuta */
        $.ajax({
            url: '/command/turnout',
            type: 'post',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(turnout)
        });
    })

});

function initializeTrackControllers(trackNumber){

    $('#track'+trackNumber+'_direction_toggle').noUiSlider({
        orientation: "horizontal",
        start: 0,
        range: {
            'min': [0, 1],
            'max': 1
        },
        format: wNumb({
            decimals: 0
        })
    });

    $('#track'+trackNumber+'_speed_control').noUiSlider({
        start: 0,
        connect: 'lower',
        behaviour: 'drag',
        animate: false,
        range: {
            'min': 0,
            'max': 255
        },
        format: wNumb({
            decimals: 0
        })
    });

    $('#track'+trackNumber+'_speed_control').Link('lower').to('-inline-<div class="tooltip"></div>', function ( value ) {
        $(this).html(
            '<strong>Speed: </strong>' +
            '<span>' + Math.round(Number(value)) + '</span>'
        );
    });
}

function initializeTurnoutControllers(turnoutNumber){
    $('#turnout'+ turnoutNumber +'_toggle').noUiSlider({
        orientation: "horizontal",
        connect: 'upper',
        start: 0,
        range: {
            'min': [0, 1],
            'max': 1
        },
        format: wNumb({
            decimals: 0
        })
    });
}

function changeRoute(turnoutNumber, direction){
    switch(turnoutNumber){
        case 1:
            if(direction === 1){
                var turnout_src = 'resources/images/left_switch_route.png';
                var track_src = 'resources/images/track_route.png';
                $('#left_turnout_2').attr('src', turnout_src);
                $('#track_2').attr('src', track_src);
            } else {
                var turnout_src = 'resources/images/left_switch.png';
                var track_src = 'resources/images/track.png';
                $('#left_turnout_2').attr('src', turnout_src);
                $('#track_2').attr('src', track_src);
            }

            break;
    }
}
