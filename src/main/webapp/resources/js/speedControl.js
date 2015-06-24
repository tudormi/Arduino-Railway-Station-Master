/**
 * Created by Tudormi on 19/5/2015.
 */

var speedOperation = {};

$(document).ready(function () {

    /* Speed slider initializations */
    initializeTrackControllers(0);
    initializeTrackControllers(2);
    initializeTrackControllers(3);
    initializeTrackControllers(4);
    initializeTrackControllers(7);

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

    speedOperation.updateServerValue = function (trackNumber) {
        if (timer === null) {
            timer = setInterval(function () {
                var newValue = Math.round(Number($('#track' + trackNumber + '_speed_control').val()));
                if (newValue !== lastSentValue) {
                    speedOperation.sendValue(newValue, trackNumber);
                } else {
                    clearInterval(timer);
                    timer = null;
                }
            }, frequencyInMs);
        }
    };

    speedOperation.sendValue = function (newValue, trackNumber) {

        track.speed = newValue;
        track.number = trackNumber;

        $.ajax({
            url: '/command/track    ',
            type: 'post',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(track),
            success: function (data) {
                speedOperation.updateLastSentValue(newValue, trackNumber);
            }
        });
    };

    speedOperation.updateLastSentValue = function (newValue, trackNumber) {
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
        speedOperation.updateServerValue(trackNumber);
    });

    /* Stop the train(set speed to 0) when user changes the direction */
    speedOperation.reverseTrackDirection = function (trackNumber) {
        speedOperation.sendValue(0, trackNumber);
        $('#track' + trackNumber + '_speed_control').val(0);
    };

    $('.direction_toggler').on('slide', function (event) {
        /* forward = 1, backward = 0 */
        var trackNumber = Number($(this).attr('trackNumber'));
        if (Number($(this).val()) === 1) {
            track.direction = 'forward';
            speedOperation.reverseTrackDirection(trackNumber);
        } else {
            track.direction = 'backwards';
            speedOperation.reverseTrackDirection(trackNumber);
        }
    });
});

function initializeTrackControllers(trackNumber) {

    $('#track' + trackNumber + '_direction_toggle').noUiSlider({
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

    $('#track' + trackNumber + '_speed_control').noUiSlider({
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

    $('#track' + trackNumber + '_speed_control').Link('lower').to('-inline-<div class="tooltip"></div>', function (value) {
        $(this).html(
            '<strong>Speed: </strong>' +
            '<span>' + Math.round(Number(value)) + '</span>'
        );
    });
}

