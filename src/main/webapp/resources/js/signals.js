/**
 * Created by tmatrescu on 5/6/2015.
 */

var make_route = false;

$(document).ready(function () {

    initializeTurnoutControllers(1);
    initializeTurnoutControllers(5);
    initializeTurnoutControllers(3);
    initializeTurnoutControllers(4);
    initializeTurnoutControllers(2);
    initializeTurnoutControllers(6);

    $('#signal_x li').on('click', function () {
        var signal = {
            number: 0,
            type: 0,
            color: 'nothing'
        };
        signal.number = Number($(this).parent().attr('number'));
        signal.type = Number($(this).parent().attr('type'));
        signal.color = $(this).attr('color');

        if (make_route == true && (signal.color === 'green' || signal.color === 'yellow' )) {
            $.ajax({
                url: '/command/signal',
                type: 'post',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(signal),
                success: function (data) {
                    console.log('asdasdasd');
                    if (data == 1) {
                        blockRoute(1);
                        $('#signal_x li[color="' + signal.color + '"] span').removeClass('fg-grayLight').addClass('fg-' + signal.color);
                        $('#signal_x li[color="red"] span').removeClass('fg-red').addClass('fg-grayLight');
                    } else if (data == 0) {
                        alert('macaze puse gresit');
                    }
                }
            });
        }
    });

    var turnout = {
        number: 0,
        direction: 0
    };

    $('.turnout_toggle').on('slide', function () {
        turnout.number = Number($(this).attr('turnoutNumber'));
        turnout.direction = Number($(this).val());
        /* 0 - directa, 1 - abatuta */
        synchronizeTurnouts(turnout.number, turnout.direction);
        if (make_route == true) {
            $.ajax({
                url: '/command/turnout',
                type: 'post',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(turnout),
                success: function (data) {
                    changeRoute(turnout.number, turnout.direction);
                }
            });
        }
    });
});

function processSensor(sensor) {

    var present_track_src = 'resources/images/track_present.png';
    var route_track_src = 'resources/images/track_route.png';
    var empty_track_src = 'resources/images/track_empty.png';

    switch (sensor['track']) {
        case 0:
            if (sensor['state'] == 'present' && sensor['orientation'] == 0) {
                //trenul intra pe modul, se face parcursul, se coloreaza intarea in rosu
                $('#track_3_x').attr('src', present_track_src);
                make_route = true;
                changeRoute(1, $('#left_turnout_2').val());
            }
            if (sensor['state'] == 'present' && sensor['orientation'] == 1) {
                //trenul a ajuns la senzorul dinainte de semnal
                //se verifica semnalul ce culoare are. daca e rosu se opreste punand viteza pe 0
                //daca nu e rosu, se coloreaza macazul/sau linia between in rosu ca pentru prezenta
                if ($('#turnout1_toggle').val() == 1) {
                    $('#left_turnout_2').attr('src', present_track_src);
                }
                else {
                    $('#track_3_x_between').attr('src', present_track_src);
                }
            } else if (sensor['state'] == 'empty') {
                $('#track_3_x').attr('src', empty_track_src);
                $('#track_3_x_between').attr('src', empty_track_src);
                make_route = false;
                unblockRoute(1);
            }
            break;

        case 2:

            break;

        case 3:

            if (sensor['state'] == 'present' && sensor['orientation'] == 0) {
                $('#track_3_centre').attr('src', present_track_src);
                if (sensor['counter'] == 1) {
                    //vine dinspre y
                    //trenul a ajuns la senzorul dinainte de semnal
                    //se verifica semnalul ce culoare are. daca e rosu se opreste punand viteza pe 0
                    //daca nu e rosu, se coloreaza macazul/sau linia between in rosu ca pentru prezenta
                }
            }
            if (sensor['state'] == 'present' && sensor['orientation'] == 1) {
                $('#track_3_centre').attr('src', present_track_src);
                if (sensor['counter'] == 1) {
                    //vine dinspre x
                    //trenul a ajuns la senzorul dinainte de semnal
                    //se verifica semnalul ce culoare are. daca e rosu se opreste punand viteza pe 0
                    //daca nu e rosu, se coloreaza macazul/sau linia between in rosu ca pentru prezenta
                }
            }
            break;
    }
}


function initializeTurnoutControllers(turnoutNumber) {
    $('#turnout' + turnoutNumber + '_toggle').noUiSlider({
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

function changeRoute(turnoutNumber, direction) {
    /* use direction = -1 to know that the turnout before the active switch changed */
    var left_turnout_src_route = 'resources/images/left_switch_route.png';
    var left_turnout_src = 'resources/images/left_switch_empty.png';
    var track_src = 'resources/images/track_empty.png';
    var track_src_route = 'resources/images/track_route.png';
    var right_turnout_src_route = 'resources/images/right_switch_route.png';
    var right_turnout_src = 'resources/images/right_switch_empty.png';


    switch (turnoutNumber) {

        case 1:
            if (direction === 1) {
                /* abatuta - put route to track 2 */
                $('#left_turnout_2').attr('src', left_turnout_src_route);
                $('#track_2').attr('src', track_src_route);
                /* remove route to turnout 3 */
                $('#track_3_x_between').attr('src', track_src);
            } else {
                /* directa - remove route from track 2 */
                $('#left_turnout_2').attr('src', left_turnout_src);
                $('#track_2').attr('src', track_src);
                /* put route for turnout 3 */
                $('#track_3_x_between').attr('src', track_src_route);
            }
            var next_turnout_direction = Number($('#turnout3_toggle').val());
            changeRoute(3, next_turnout_direction);
            break;

        case 3:
            var previousTurnout = Number($('#turnout1_toggle').val());
            if (previousTurnout === 0) {
                if (direction === 1) {
                    /* abatuta - put route for track 4 */
                    $('#right_turnout_4').attr('src', right_turnout_src_route);
                    $('#track_4').attr('src', track_src_route);
                    /* remove route from track 3 */
                    $('#track_3_centre').attr('src', track_src);
                } else if (direction === 0) {
                    /* remove route from track 4 and put it to track 3 */
                    $('#right_turnout_4').attr('src', right_turnout_src);
                    $('#track_4').attr('src', track_src);
                    /* put route for track 3 */
                    $('#track_3_centre').attr('src', track_src_route);
                }
            } else {
                /* remove route starting from this turnout */
                $('#right_turnout_4').attr('src', right_turnout_src);
                $('#track_4').attr('src', track_src);
                $('#track_3_centre').attr('src', track_src);
            }
            break;
    }
}

function synchronizeTurnouts(turnoutNumber, turnoutDirection) {
    switch (turnoutNumber) {
        case 1:
            $('#turnout5_toggle').val(turnoutDirection);
            if (make_route == true) changeRoute(5, turnoutDirection);
            break;

        case 5:
            $('#turnout1_toggle').val(turnoutDirection);
            if (make_route == true) changeRoute(1, turnoutDirection);
            break;

        case 2:
            $('#turnout6_toggle').val(turnoutDirection);
            break;

        case 6:
            $('#turnout2_toggle').val(turnoutDirection);
            break;
    }
}

function blockRoute(firstTurnout) {
    switch (firstTurnout) {
        case 1:
            $('#turnout1_toggle').attr('disabled', 'disabled');
            $('#turnout3_toggle').attr('disabled', 'disabled');
            $('#turnout5_toggle').attr('disabled', 'disabled');
            break;
    }
}

function unblockRoute(firstTurnout) {
    /* in functie de primul macaz calcat, trebuie eliberat si semnalul */
    switch (firstTurnout) {
        case 1:
            /* trenul a venit dinspre intrare */
            $('#turnout1_toggle').removeAttr('disabled');
            $('#turnout3_toggle').removeAttr('disabled');
            $('#turnout5_toggle').removeAttr('disabled');
            /* eliberam semnalul */
            $('#signal_x li[color="green"] span').removeClass('fg-green').addClass('fg-grayLight');
            $('#signal_x li[color="yellow"] span').removeClass('fg-yellow').addClass('fg-grayLight');
            $('#signal_x li[color="red"] span').removeClass('fg-grayLight').addClass('fg-red');
            /* blocam macazul  */
            if($('#turnout1_toggle').val() == 1) {
                $('#turnout1_toggle').val(0);
                $('#turnout1_toggle').attr('disabled', 'disabled');
                $('#turnout5_toggle').attr('disabled', 'disabled');
            }
            else{
                if($('#turnout3_toggle').val() == 1){
                    $('#turnout3_toggle').val(0);
                    $('#turnout3_toggle').attr('disabled', 'disabled');
                } else{
                    $('#turnout3_toggle').val(1);
                    $('#turnout3_toggle').attr('disabled', 'disabled');
                }
            }
            break;
    }
}
