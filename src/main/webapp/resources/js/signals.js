/**
 * Created by tmatrescu on 5/6/2015.
 */

var left_turnout_src_route = 'resources/images/left_switch_route.png',
    left_turnout_src_present = 'resources/images/left_switch_present.png',
    left_turnout_src = 'resources/images/left_switch_empty.png',
    track_src = 'resources/images/track_empty.png',
    track_src_route = 'resources/images/track_route.png',
    track_src_present = 'resources/images/track_present.png',
    right_turnout_src_route = 'resources/images/right_switch_route.png',
    right_turnout_src = 'resources/images/right_switch_empty.png',
    right_turnout_src_present = 'resources/images/right_switch_present.png';

var make_route_x = false;
var make_route_y = false;

var layoutTracks = {
    $track_2 : $('#track_2'),
    $track_4 : $('#track_4'),
    $track_3_x : $('#track_3_x'),
    $track_3_centre : $('#track_3_centre'),
    $track_3_y : $('#track_3_y')
}

var layoutTurnouts = {

}

$(document).ready(function () {

    initializeTurnoutControllers(1);
    initializeTurnoutControllers(5);
    initializeTurnoutControllers(3);
    initializeTurnoutControllers(4);
    initializeTurnoutControllers(2);
    initializeTurnoutControllers(6);

    var signal = {
        number: 0,
        type: 0,
        color: 'nothing'
    };

    $('#signal_x li').on('click', function () {
        signal.number = Number($(this).parent().attr('number'));
        signal.type = Number($(this).parent().attr('type'));
        signal.color = $(this).attr('color');

        if (make_route_x == true && (signal.color === 'green' || signal.color === 'yellow' )) {
            $.ajax({
                url: '/command/signal',
                type: 'post',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(signal),
                success: function (data) {
                    if (data == 1) {
                        processSignal(signal);
                    } else if (data == 0) {
                        alert('Nu se poate intra in statie');
                    }
                }
            });
        }
    });

    $('#signal_y li').on('click', function () {
        signal.number = Number($(this).parent().attr('number'));
        signal.type = Number($(this).parent().attr('type'));
        signal.color = $(this).attr('color');

        if (make_route_y == true && (signal.color === 'green' || signal.color === 'yellow' )) {
            $.ajax({
                url: '/command/signal',
                type: 'post',
                dataType: 'json',
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(signal),
                success: function (data) {
                    if (data == 1) {
                        processSignal(signal);
                    } else if (data == 0) {
                        alert('Nu se poate intra in statie');
                    }
                }
            });
        }
    });

    $('.turnout_toggle').on('slide', function () {
        var number = Number($(this).attr('turnoutNumber'));
        var direction = Number($(this).val());
        /* 0 - directa, 1 - abatuta */
        changeTurnout(number, direction);
        synchronizeTurnouts(number, direction);
    });
});

var turnout = {
    number: 0,
    direction: 0
};

function getCurrentSetTrackX(){
    if($('#turnout1_toggle').val() == 1){
        return 2;
    } else{
        if($('#turnout3_toggle').val() == 1) return 4;
        else return 3
    }
}

function getCurrentSetTrackY(){
    if($('#turnout2_toggle').val() == 1){
        return 4;
    } else{
        if($('#turnout4_toggle').val() == 1) return 2;
        else return 3
    }
}

function changeTurnout(number, direction) {

    turnout.number = number;
    turnout.direction = direction;

    if ((make_route_x == true && (turnout.number == 1 || turnout.number == 3 || turnout.number == 5)) ||
        (make_route_y == true && (turnout.number == 2 || turnout.number == 4 || turnout.number == 6))) {
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
};

function processSensor(sensor) {

    switch (sensor['track']) {
        case 0:
            if (sensor['state'] == 'present' && sensor['orientation'] == 0) {
                //trenul intra pe modul, se face parcursul, se coloreaza intarea in rosu
                $('#track_3_x').attr('src', track_src_present);
                make_route_x = true;
                changeRoute(1, $('#turnout1_toggle').val());
            }
            if (sensor['state'] == 'present' && sensor['orientation'] == 1) {
                //trenul a ajuns la senzorul dinainte de semnal
                //se verifica semnalul ce culoare are. daca e rosu se opreste punand viteza pe 0
                //daca nu e rosu, se coloreaza macazul/sau linia between in rosu ca pentru prezenta
                if ($('#turnout1_toggle').val() == 1) {
                    $('#left_turnout_2').attr('src', left_turnout_src_present);
                }
                else {
                    $('#track_3_x_between').attr('src', track_src_present);
                }
            } else if (sensor['state'] == 'empty') {
                //$('#track_3_x').attr('src', empty_track_src);
                layoutTracks.$track_3_x.attr('src', track_src);
                $('#track_3_x_between').attr('src', track_src);
                //layoutTracks.
                make_route_x = false;
                unblockRoute(1);
            }
            break;

        case 2:
            if (sensor['state'] == 'present' && sensor['orientation'] == 0) {
                $('#track_2').attr('src', track_src_present);
                $('#left_')
                if (sensor['counter'] == 1) {
                    //vine dinspre y
                    //trenul a ajuns la senzorul dinainte de semnal
                    //se verifica semnalul ce culoare are. daca e rosu se opreste punand viteza pe 0
                    //daca nu e rosu, se coloreaza macazul/sau linia between in rosu ca pentru prezenta
                }
            }
            if (sensor['state'] == 'present' && sensor['orientation'] == 1) {
                $('#track_2').attr('src', track_src_present);
                if (sensor['counter'] == 1) {
                    //vine dinspre x
                    //trenul a ajuns la senzorul dinainte de semnal
                    //se verifica semnalul ce culoare are. daca e rosu se opreste punand viteza pe 0
                    //daca nu e rosu, se coloreaza macazul/sau linia between in rosu ca pentru prezenta
                }
            }
            break;

        case 3:

            if (sensor['state'] == 'present' && sensor['orientation'] == 0) {
                $('#track_3_centre').attr('src', track_src_present);
                if (sensor['counter'] == 1) {
                    //vine dinspre y
                    //trenul a ajuns la senzorul dinainte de semnal
                    //se verifica semnalul ce culoare are. daca e rosu se opreste punand viteza pe 0
                    //daca nu e rosu, se coloreaza macazul/sau linia between in rosu ca pentru prezenta
                }
            }
            if (sensor['state'] == 'present' && sensor['orientation'] == 1) {
                $('#track_3_centre').attr('src', track_src_present);
                if (sensor['counter'] == 1) {
                    //vine dinspre x
                    //trenul a ajuns la senzorul dinainte de semnal
                    //se verifica semnalul ce culoare are. daca e rosu se opreste punand viteza pe 0
                    //daca nu e rosu, se coloreaza macazul/sau linia between in rosu ca pentru prezenta
                }
            }
            break;

        case 4:
            if (sensor['state'] == 'present' && sensor['orientation'] == 0) {
                $('#track_4').attr('src', track_src_present);
                $('#right_turnout_4').attr('src', right_turnout_src_present);
                if (sensor['counter'] == 1) {
                    //vine dinspre y
                    //trenul a ajuns la senzorul dinainte de semnal
                    //se verifica semnalul ce culoare are. daca e rosu se opreste punand viteza pe 0
                    //daca nu e rosu, se coloreaza macazul/sau linia between in rosu ca pentru prezenta
                }
            }
            if (sensor['state'] == 'present' && sensor['orientation'] == 1) {
                $('#track_4').attr('src', track_src_present);
                if (sensor['counter'] == 1) {
                    //vine dinspre x
                    //trenul a ajuns la senzorul dinainte de semnal
                    //se verifica semnalul ce culoare are. daca e rosu se opreste punand viteza pe 0
                    //daca nu e rosu, se coloreaza macazul/sau linia between in rosu ca pentru prezenta
                }
            }
            break;

        case 7:
            if (sensor['state'] == 'present' && sensor['orientation'] == 1) {
                //trenul intra pe modul, se face parcursul, se coloreaza iesirea in rosu
                $('#track_3_y').attr('src', track_src_present);
                make_route_y = true;
                changeRoute(2, $('#turnout2_toggle').val());
            }
            if (sensor['state'] == 'present' && sensor['orientation'] == 0) {
                //trenul a ajuns la senzorul dinainte de semnal
                //se verifica semnalul ce culoare are. daca e rosu se opreste punand viteza pe 0
                //daca nu e rosu, se coloreaza macazul/sau linia between in rosu ca pentru prezenta
                if ($('#turnout2_toggle').val() == 1) {
                    $('#left_turnout_4').attr('src', track_src_present);
                }
                else {
                    $('#track_3_y_between').attr('src', track_src_present);
                }
            } else if (sensor['state'] == 'empty') {
                $('#track_3_y').attr('src', track_src);
                $('#track_3_y_between').attr('src', track_src);
                make_route_y = false;
                unblockRoute(2);
            }
            break;
    }
}

function processSignal(signal) {

    switch (signal.number) {
        case 0: //semnal de intrare x
            blockRouteForPassingTrain(1);
            secureOccupiedTrack(getCurrentSetTrackX(), 1);
            $('#signal_x li[color="' + signal.color + '"] span').removeClass('fg-grayLight').addClass('fg-' + signal.color);
            $('#signal_x li[color="red"] span').removeClass('fg-red').addClass('fg-grayLight');
            break;

        case 7: //semnal de intrare y
            blockRouteForPassingTrain(2);
            secureOccupiedTrack(getCurrentSetTrackY(), 0);
            $('#signal_y li[color="' + signal.color + '"] span').removeClass('fg-grayLight').addClass('fg-' + signal.color);
            $('#signal_y li[color="red"] span').removeClass('fg-red').addClass('fg-grayLight');
            break;
    }

}

function changeRoute(turnoutNumber, direction) {

    //trebuie luata linia curent, si colorat pt fiecare
    //se verifica daca linia e ocupata sau nu

    var currentSetTrackX = getCurrentSetTrackX();
    var currentSetTrackY = getCurrentSetTrackY();

    switch (turnoutNumber) {

        case 5:
        case 1:
            if (direction === 1) { // abatuta - put route to track 2
                $('#left_turnout_2').attr('src', left_turnout_src_route);
                $('#track_2').attr('src', track_src_route);
                $('#track_3_x_between').attr('src', track_src); // remove route to turnout 3
            } else { // directa - remove route from track 2
                if ($('#track_2').attr('src') != track_src_present) {
                    $('#left_turnout_2').attr('src', left_turnout_src);
                    $('#track_2').attr('src', track_src);
                }
                $('#track_3_x_between').attr('src', track_src_route); // put route for turnout 3
            }
            var next_turnout_direction = Number($('#turnout3_toggle').val());
            changeRoute(3, next_turnout_direction);
            break;

        case 3:
            var previousTurnout = Number($('#turnout1_toggle').val());
            if (previousTurnout === 0) {
                if (direction === 1) { // abatuta - put route for track 4
                    $('#right_turnout_4').attr('src', right_turnout_src_route);
                    $('#track_4').attr('src', track_src_route);
                    if ($('#track_3_centre').attr('src') != track_src_present) $('#track_3_centre').attr('src', track_src); // remove route from track 3
                } else if (direction === 0) {
                    if ($('#track_4').attr('src') != track_src_present) { // remove route from track 4 and put it to track 3s
                        $('#right_turnout_4').attr('src', right_turnout_src);
                        $('#track_4').attr('src', track_src);
                    }
                    $('#track_3_centre').attr('src', track_src_route); // put route for track 3
                }
            } else { // remove route starting from this turnout
                $('#right_turnout_4').attr('src', right_turnout_src);
                $('#track_4').attr('src', track_src);
                if ($('#track_3_centre').attr('src') != track_src_present) $('#track_3_centre').attr('src', track_src);
            }
            break;

        case 6:
        case 2:
            if (direction === 1) { // abatuta - put route to track 4
                $('#left_turnout_4').attr('src', left_turnout_src_route);
                $('#track_4').attr('src', track_src_route);
                $('#track_3_y_between').attr('src', track_src); // remove route to turnout 4
            } else { // directa - remove route from track 4
                if ($('#track_4').attr('src') != track_src_present) {
                    $('#left_turnout_4').attr('src', left_turnout_src);
                    $('#track_4').attr('src', track_src);
                }
                $('#track_3_y_between').attr('src', track_src_route); // put route for turnout 4
            }
            var next_turnout_direction = Number($('#turnout4_toggle').val());
            changeRoute(4, next_turnout_direction);
            break;

        case 4:
            var previousTurnout = Number($('#turnout2_toggle').val());
            if (previousTurnout === 0) {
                if (direction === 1) {
                    /* abatuta - put route for track 2 */
                    $('#right_turnout_2').attr('src', right_turnout_src_route);
                    $('#track_2').attr('src', track_src_route);
                    /* remove route from track 3 */
                    if ($('#track_3_centre').attr('src') != track_src_present) $('#track_3_centre').attr('src', track_src);
                } else if (direction === 0) {
                    /* remove route from track 2 and put it to track 3 */
                    if ($('#track_2').attr('src') != track_src_present) {
                        $('#right_turnout_2').attr('src', right_turnout_src);
                        $('#track_2').attr('src', track_src);
                    }
                    /* put route to track 3 */
                    $('#track_3_centre').attr('src', track_src_route);
                }
            } else {
                /* remove route starting from this turnout */
                $('#right_turnout_2').attr('src', right_turnout_src);
                $('#track_2').attr('src', track_src);
                if ($('#track_3_centre').attr('src') != track_src_present) $('#track_3_centre').attr('src', track_src);
            }
            break;
    }
}

function synchronizeTurnouts(turnoutNumber, turnoutDirection) {
    switch (turnoutNumber) {
        case 1:
            $('#turnout5_toggle').val(turnoutDirection);
            changeTurnout(5, turnoutDirection);
            if (make_route_x == true) changeRoute(5, turnoutDirection);
            break;

        case 5:
            $('#turnout1_toggle').val(turnoutDirection);
            changeTurnout(1, turnoutDirection);
            if (make_route_x == true) changeRoute(1, turnoutDirection);
            break;

        case 2:
            $('#turnout6_toggle').val(turnoutDirection);
            changeTurnout(6, turnoutDirection);
            if (make_route_y == true) changeRoute(6, turnoutDirection);
            break;

        case 6:
            $('#turnout2_toggle').val(turnoutDirection);
            changeTurnout(2, turnoutDirection);
            if (make_route_y == true) changeRoute(2, turnoutDirection);
            break;
    }
}

function blockRouteForPassingTrain(firstTurnout) {
    switch (firstTurnout) {
        case 1:
        case 3:
        case 5:
            $('#turnout1_toggle').attr('disabled', 'disabled');
            $('#turnout3_toggle').attr('disabled', 'disabled');
            $('#turnout5_toggle').attr('disabled', 'disabled');
            break;
        case 2:
        case 4:
        case 6:
            $('#turnout2_toggle').attr('disabled', 'disabled');
            $('#turnout4_toggle').attr('disabled', 'disabled');
            $('#turnout6_toggle').attr('disabled', 'disabled');
            break;
    }
}

function secureOccupiedTrack(trackNumber, direction) {
    switch (trackNumber) {
        case 2:
            if (direction == 0) {//trenul vine dinspre y, blocam x-ul
                changeTurnout(1, 0);
                changeTurnout(5, 0);
                $('#turnout1_toggle').attr({disabled: 'disabled', blocked: true});
                $('#turnout5_toggle').attr({disabled: 'disabled', blocked: true});
            }
            else { //trenul vine dinspre x, blocam y-ul
                changeTurnout(4, 0);
                $('#turnout4_toggle').attr({disabled: 'disabled', blocked: true});
            }
            break;

        case 3:
            if (direction == 0) {//trenul vine dinspre y, blocam x-ul
                changeTurnout(3, 1);
                $('#turnout3_toggle').attr({disabled: 'disabled', blocked: true});
            } else { //trenul vine dinspre x, blocam y-ul
                changeTurnout(4, 1);
                $('#turnout4_toggle').attr({disabled: 'disabled', blocked: true});
            }

            break;

        case 4:
            if (direction == 0) {//trenul vine dinspre y, blocam x-ul
                changeTurnout(3, 0);
                $('#turnout3_toggle').attr({disabled: 'disabled', blocked: true});
            } else { //trenul vine dinspre x, blocam y-ul
                changeTurnout(2, 0);
                changeTurnout(6, 0);
                $('#turnout2_toggle').attr({disabled: 'disabled', blocked: true});
                $('#turnout6_toggle').attr({disabled: 'disabled', blocked: true});
            }
            break;
    }
}

function enableAvailableTurnouts() {
    if ($('#turnout1_toggle').attr('blocked') == false) $('#turnout1_toggle').removeAttr('disabled');
    if ($('#turnout2_toggle').attr('blocked') == false) $('#turnout2_toggle').removeAttr('disabled');
    if ($('#turnout3_toggle').attr('blocked') == false) $('#turnout3_toggle').removeAttr('disabled');
    if ($('#turnout4_toggle').attr('blocked') == false) $('#turnout4_toggle').removeAttr('disabled');
    if ($('#turnout5_toggle').attr('blocked') == false) $('#turnout5_toggle').removeAttr('disabled');
    if ($('#turnout6_toggle').attr('blocked') == false) $('#turnout6_toggle').removeAttr('disabled');
}

function unblockRoute(firstTurnout) {
    /* in functie de primul macaz calcat, trebuie eliberat si semnalul */
    switch (firstTurnout) {
        case 1:
            /* eliberam semnalul */
            $('#signal_x li[color="green"] span').removeClass('fg-green').addClass('fg-grayLight');
            $('#signal_x li[color="yellow"] span').removeClass('fg-yellow').addClass('fg-grayLight');
            $('#signal_x li[color="red"] span').removeClass('fg-grayLight').addClass('fg-red');
            secureOccupiedTrack(getCurrentSetTrackX(), 0);
            break;

        case 2:
            /* eliberam semnalul */
            $('#signal_y li[color="green"] span').removeClass('fg-green').addClass('fg-grayLight');
            $('#signal_y li[color="yellow"] span').removeClass('fg-yellow').addClass('fg-grayLight');
            $('#signal_y li[color="red"] span').removeClass('fg-grayLight').addClass('fg-red');
            secureOccupiedTrack(getCurrentSetTrackY(), 1);
    }
    enableAvailableTurnouts();
}
