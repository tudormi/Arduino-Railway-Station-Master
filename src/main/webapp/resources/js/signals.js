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

var signal = {
    number: 0,
    type: 0,
    color: 'nothing'
};

var turnout = {
    number: 0,
    direction: 0
};

$(document).ready(function () {

    initializeTurnoutControllers(1);
    initializeTurnoutControllers(5);
    initializeTurnoutControllers(3);
    initializeTurnoutControllers(4);
    initializeTurnoutControllers(2);
    initializeTurnoutControllers(6);

    initializeSignals(4, 'x');
    initializeSignals(4, 'y');
    initializeSignals(2, 'x');
    initializeSignals(2, 'y');
    initializeSignals(3, 'x');
    initializeSignals(3, 'y');
    initializeSignals(0, 'x');
    initializeSignals(7, 'y');
    updateFlags();

    $('.turnout_toggle').on('slide', function () {
        var number = Number($(this).attr('turnoutNumber'));
        var direction = Number($(this).val());
        /* 0 - directa, 1 - abatuta */
        changeTurnoutForRoutingColor(number, direction);
        synchronizeTurnouts(number, direction);
    });
});

function updateFlags() {
    if ($('#track_3_x').attr('src') == track_src_present) make_route_x = true;
    if ($('#track_3_y').attr('src') == track_src_present) make_route_y = true;
}

function changeTurnoutForRoutingColor(number, direction) {
    turnout.number = number;
    turnout.direction = direction;

    $.ajax({
        url: '/command/turnout',
        type: 'post',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(turnout),
        success: function (data) {
            if ((make_route_x == true && (turnout.number == 1 || turnout.number == 3 || turnout.number == 5)) ||
                (make_route_y == true && (turnout.number == 2 || turnout.number == 4 || turnout.number == 6))) {
                colorizeRouteForEnteringTrain(turnout.number, turnout.direction);
            }
        }
    });
}

function changeTurnout(number, direction) {
    turnout.number = number;
    turnout.direction = direction;
    $.ajax({
        url: '/command/turnout',
        type: 'post',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(turnout),
        success: function (data) {
            $('#turnout' + number + '_toggle').val(direction);
        }
    });
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

function synchronizeTurnouts(turnoutNumber, turnoutDirection) {
    switch (turnoutNumber) {
        case 1:
            changeTurnout(5, turnoutDirection);
            break;

        case 5:
            changeTurnout(1, turnoutDirection);
            break;

        case 2:
            changeTurnout(6, turnoutDirection);
            break;

        case 6:
            changeTurnout(2, turnoutDirection);
            break;
    }
}

function initializeSignals(signalNumber, signalType) {
    $('#signal' + signalNumber + '_' + signalType + ' li').on('click', function () {
        signal.number = Number($(this).parent().attr('number'));
        signal.type = Number($(this).parent().attr('type'));
        signal.color = $(this).attr('color');

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
                    alert('Nu se poate pune semnalul');
                }
            }
        });
    });
}

function processSensor(sensor) {

    switch (sensor['track']) {
        case 0:
            if (sensor['state'] == 'present' && sensor['orientation'] == 0) { //trenul intra dinspre X, se face parcursul, se coloreaza intarea in rosu
                $('#track_3_x').attr('src', track_src_present);
                make_route_x = true;
                colorizeRouteForEnteringTrain(1, $('#turnout1_toggle').val());
            }
            if (sensor['state'] == 'present' && sensor['orientation'] == 1) {
                //trenul a ajuns la senzorul dinainte de semnal
                //se verifica semnalul ce culoare are. daca e rosu se opreste punand viteza pe 0
                if (getSignalColor(0, 'x') == 'red') {
                    console.log('semnal pe rosu');
                }
                //else
                //daca nu e rosu, se coloreaza macazul/sau linia between in rosu ca pentru prezenta
                if ($('#turnout1_toggle').val() == 1) {
                    $('#left_turnout_2').attr('src', left_turnout_src_present);
                }
                else {
                    $('#track_3_x_between').attr('src', track_src_present);
                }
            } else if (sensor['state'] == 'empty') {
                $('#track_3_x').attr('src', track_src);
                $('#track_3_x_between').attr('src', track_src);
                $('#left_turnout_2').attr('src', left_turnout_src);
                $('#right_turnout_4').attr('src', right_turnout_src);
                make_route_x = false;
                unblockRoute(0);
            }
            break;

        case 2:
            if (sensor['state'] == 'present' && sensor['orientation'] == 0) {
                $('#track_2').attr('src', track_src_present);
                $('#left_turnout_2').attr('src', left_turnout_src_present);
                if (sensor['counter'] == 1) {
                    //vine dinspre y
                    //trenul a ajuns la senzorul dinainte de semnal
                    //se verifica semnalul ce culoare are. daca e rosu se opreste punand viteza pe 0
                    //daca nu e rosu, se coloreaza macazul/sau linia between in rosu ca pentru prezenta
                }
            }
            if (sensor['state'] == 'present' && sensor['orientation'] == 1) {
                $('#track_2').attr('src', track_src_present);
                $('#right_turnout_2').attr('src', right_turnout_src_present);
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
                $('#left_turnout_4').attr('src', left_turnout_src_present);
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
                colorizeRouteForEnteringTrain(2, $('#turnout2_toggle').val());
            }
            if (sensor['state'] == 'present' && sensor['orientation'] == 0) {
                //trenul a ajuns la senzorul dinainte de semnal
                //se verifica semnalul ce culoare are. daca e rosu se opreste punand viteza pe 0
                //daca nu e rosu, se coloreaza macazul/sau linia between in rosu ca pentru prezenta
                if ($('#turnout2_toggle').val() == 1) {
                    $('#left_turnout_4').attr('src', left_turnout_src_present);
                }
                else {
                    $('#track_3_y_between').attr('src', track_src_present);
                }
            } else if (sensor['state'] == 'empty') {
                $('#track_3_y').attr('src', track_src);
                $('#track_3_y_between').attr('src', track_src);
                $('#left_turnout_4').attr('src', left_turnout_src);
                $('#right_turnout_2').attr('src', right_turnout_src);
                make_route_y = false;
                unblockRoute(7);
            }
            break;
    }
}

function processSignal(signal) {

    switch (signal.number) {
        case 0: //semnal de intrare x
            setSignalColor(signal);
            blockRouteForPassingTrain(1);
            secureOccupiedTrack(getCurrentSetTrackX(), 1);
            break;

        case 2:
            if (signal.type == 0) { //semnal x de iesire
                setSignalColor(signal);
                changeRouteForLeavingTrain(signal);
                blockRouteForPassingTrain(2);
            } else {
                setSignalColor(signal);
                changeRouteForLeavingTrain(signal);
                blockRouteForPassingTrain(2);
            }

        case 7: //semnal de intrare y
            setSignalColor(signal);
            blockRouteForPassingTrain(2);
            secureOccupiedTrack(getCurrentSetTrackY(), 0);
            break;
    }

}

function setSignalColor(signal) {
    var orientation;
    if (signal.type == 0) orientation = 'x';
    else orientation = 'y';

    var signalId = '#signal' + signal.number + '_' + orientation;
    var currentColor = $(signalId).attr('state');
    $(signalId + ' li[color="' + signal.color + '"] span').removeClass('fg-grayLight').addClass('fg-' + signal.color);
    $(signalId + ' li[color="' + currentColor + '"] span').removeClass('fg-' + currentColor).addClass('fg-grayLight');
    $(signalId).attr('state', signal.color);
}

function getSignalColor(lineNumber, orientation) {
    var signalId = '#signal' + lineNumber + '_' + orientation;
    return $(signalId).attr('state');
}

function colorizeRouteForEnteringTrain(turnoutNumber, direction) {

    var lineNumberX = getCurrentSetTrackX();
    var lineNumberY = getCurrentSetTrackY();

    switch (turnoutNumber) {

        case 1:
        case 3:
        case 5:
            if (!($('#track_2').attr('src') != track_src_present && make_route_y == true && lineNumberY == 2))uncolorizeTrack(2, 0);
            else $('#left_turnout_2').attr('src', left_turnout_src);
            if (!($('#track_3_centre').attr('src') != track_src_present && make_route_y == true && lineNumberY == 3)) uncolorizeTrack(3, 0);
            if (!($('#track_4').attr('src') != track_src_present && make_route_y == true && lineNumberY == 4)) uncolorizeTrack(4, 0);
            else $('#right_turnout_4').attr('src', right_turnout_src);
            colorizeRouteTrack(lineNumberX, 0);
            break;

        case 2:
        case 4:
        case 6:
            if (!($('#track_2').attr('src') != track_src_present && make_route_x == true && lineNumberX == 2)) uncolorizeTrack(2, 1);
            else $('#right_turnout_2').attr('src', right_turnout_src);
            if (!($('#track_3_centre').attr('src') != track_src_present && make_route_x == true && lineNumberX == 3)) uncolorizeTrack(3, 1);
            if (!($('#track_4').attr('src') != track_src_present && make_route_x == true && lineNumberX == 4)) uncolorizeTrack(4, 1);
            else $('#left_turnout_4').attr('src', left_turnout_src);
            colorizeRouteTrack(lineNumberY, 1);
            break;

    }
}

function changeRouteForLeavingTrain(signal) {

    switch (signal.number) {
        case 2:
            setTurnoutsForLeavingTrain(2, signal.type);
            colorizeRouteForLeavingTrain(2, signal.type);
            break;
    }

}

function colorizeRouteForLeavingTrain(trackNumber, signalType) {
    switch (trackNumber) {
        case 2:
            if (signalType == 0) {
                $('#right_turnout_2').attr('src', right_turnout_src_present);
                $('#track_3_y_between').attr('src', track_src_present);
            }
            else $('#left_turnout_2').attr('src', left_turnout_src_present);
            break;
        case 3:
            if (signalType == 0) $('#track_3_y_between').attr('src', track_src_present);
            else $('#track_3_x_between').attr('src', track_src_present);
            break;
        case 4:
            if (signalType == 0) $('#left_turnout_4').attr('src', left_turnout_src_present);
            else {
                $('#right_turnout_4').attr('src', right_turnout_src_present);
                $('#track_3_x_between').attr('src', track_src_present);
            }
            break;
    }

    if (signalType == 0) {//semnal de tip x, coloram y
        colorizeRouteTrack(7, 0);
    } else {//coloram x
        colorizeRouteTrack(0, 1);
    }
}

function colorizeRouteTrack(tracknumber, orientation) {
    switch (tracknumber) {
        case 0:
            $('#track_3_x').attr('src', track_src_route);
            break;

        case 2:
            $('#track_2').attr('src', track_src_route);
            if (orientation == 0) { //trenul vine dinspre x
                $('#left_turnout_2').attr('src', left_turnout_src_route);
            } else {
                $('#right_turnout_2').attr('src', right_turnout_src_route);
                $('#track_3_y_between').attr('src', track_src_route);
            }
            break;

        case 3:
            $('#track_3_centre').attr('src', track_src_route);
            if (orientation == 0) {
                $('#track_3_x_between').attr('src', track_src_route);
            } else {
                $('#track_3_y_between').attr('src', track_src_route);
            }
            break;

        case 4:
            $('#track_4').attr('src', track_src_route);
            if (orientation == 0) {
                $('#track_3_x_between').attr('src', track_src_route);
                $('#right_turnout_4').attr('src', right_turnout_src_route);
            } else {
                $('#left_turnout_4').attr('src', left_turnout_src_route);
            }
            break;

        case 7:
            $('#track_3_y').attr('src', track_src_route);
            break;
    }
}

function uncolorizeTrack(tracknumber, orientation) {
    switch (tracknumber) {
        case 2:
            $('#track_2').attr('src', track_src);
            if (orientation == 0) { //trenul vine dinspre x
                $('#left_turnout_2').attr('src', left_turnout_src);
            } else {
                $('#right_turnout_2').attr('src', right_turnout_src);
                $('#track_3_y_between').attr('src', track_src);
            }
            break;

        case 3:
            $('#track_3_centre').attr('src', track_src);
            if (orientation == 0) {
                $('#track_3_x_between').attr('src', track_src);
            } else {
                $('#track_3_y_between').attr('src', track_src);
            }
            break;

        case 4:
            $('#track_4').attr('src', track_src);
            if (orientation == 0) {
                $('#track_3_x_between').attr('src', track_src);
                $('#right_turnout_4').attr('src', right_turnout_src);
            } else {
                $('#left_turnout_4').attr('src', left_turnout_src);
            }
            break;
    }
}

function setTurnoutsForLeavingTrain(lineNumber, orientation) {
    switch (orientation) {
        case 0:
            if (lineNumber == 4) {
                changeTurnout(6, 1);
                changeTurnout(2, 1);
            } else if (lineNumber == 3) {
                changeTurnout(2, 0);
                changeTurnout(4, 0);
            } else if (lineNumber == 2) {
                changeTurnout(2, 0);
                changeTurnout(4, 1);
            }
            break;

        case 1:
            if (lineNumber == 2) {
                changeTurnout(1, 1);
                changeTurnout(5, 1);
            } else if (lineNumber == 3) {
                changeTurnout(1, 0);
                changeTurnout(3, 0);
            } else if (lineNumber == 4) {
                changeTurnout(1, 0);
                changeTurnout(3, 1);
            }
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

function unblockRoute(lineNumber) {
    switch (lineNumber) {
        case 0:
            /* eliberam semnalul */
            $('#signal0_x li[color="green"] span').removeClass('fg-green').addClass('fg-grayLight');
            $('#signal0_x li[color="yellow"] span').removeClass('fg-yellow').addClass('fg-grayLight');
            $('#signal0_x li[color="red"] span').removeClass('fg-grayLight').addClass('fg-red');
            secureOccupiedTrack(getCurrentSetTrackX(), 0);
            break;

        case 7:
            /* eliberam semnalul */
            $('#signal7_y li[color="green"] span').removeClass('fg-green').addClass('fg-grayLight');
            $('#signal7_y li[color="yellow"] span').removeClass('fg-yellow').addClass('fg-grayLight');
            $('#signal7_y li[color="red"] span').removeClass('fg-grayLight').addClass('fg-red');
            secureOccupiedTrack(getCurrentSetTrackY(), 1);
            break;
    }
    enableAvailableTurnouts();
}

function getCurrentSetTrackX() {
    if ($('#turnout1_toggle').val() == 1) {
        return 2;
    } else {
        if ($('#turnout3_toggle').val() == 1) return 4;
        else return 3
    }
}

function getCurrentSetTrackY() {
    if ($('#turnout2_toggle').val() == 1) {
        return 4;
    } else {
        if ($('#turnout4_toggle').val() == 1) return 2;
        else return 3
    }
}

function enableAvailableTurnouts() {
    if ($('#turnout1_toggle').attr('blocked') == 'false') $('#turnout1_toggle').removeAttr('disabled');
    if ($('#turnout2_toggle').attr('blocked') == 'false') $('#turnout2_toggle').removeAttr('disabled');
    if ($('#turnout3_toggle').attr('blocked') == 'false') $('#turnout3_toggle').removeAttr('disabled');
    if ($('#turnout4_toggle').attr('blocked') == 'false') $('#turnout4_toggle').removeAttr('disabled');
    if ($('#turnout5_toggle').attr('blocked') == 'false') $('#turnout5_toggle').removeAttr('disabled');
    if ($('#turnout6_toggle').attr('blocked') == 'false') $('#turnout6_toggle').removeAttr('disabled');
}
