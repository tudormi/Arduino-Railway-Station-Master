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


$(document).ready(function () {

    initializeSignals(4, 'x');
    initializeSignals(4, 'y');
    initializeSignals(2, 'x');
    initializeSignals(2, 'y');
    initializeSignals(3, 'x');
    initializeSignals(3, 'y');
    initializeSignals(0, 'x');
    initializeSignals(7, 'y');
    updateFlags();

});

function updateFlags() {
    if ($('#track_3_x').attr('src') == track_src_present) make_route_x = true;
    if ($('#track_3_y').attr('src') == track_src_present) make_route_y = true;
}

function initializeSignals(signalNumber, signalType) {
    $('#signal' + signalNumber + '_' + signalType + ' li').on('click', function () {
        signal.number = Number($(this).parent().attr('number'));
        signal.type = Number($(this).parent().attr('type'));
        signal.color = $(this).attr('color');
        if (signal.color != $(this).parent().attr('state')) {
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
        } else console.log('aceesi culoare');
    });
}

function changeSignal(signal, processFlag) {
    setSignalColor(signal);
    $.ajax({
        url: '/command/signal',
        type: 'post',
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(signal),
        success: function (data) {
            if (data == 1 && processFlag == true) {
                processSignal(signal);
            } else if (data == 0) {
                alert('Nu se poate pune semnalul');
            }
        }
    });
}

function checkIfLineIsOccupied(trackNumber) {
    switch (trackNumber) {
        case 3:
            if ($('#track_3_centre').attr('src') == track_src_present) return true;
            else return false;
        case 4:
            if ($('#track_4').attr('src') == track_src_present) return true;
            else return false;
        case 2:
            if ($('#track_2').attr('src') == track_src_present) return true;
            else return false;
    }
}

function markLineAsOccupied(trackNumber) {
    switch (trackNumber) {
        case 0:
            $('#track_3_x').attr('src', track_src_present);
            break;
        case 2:
            $('#track_2').attr('src', track_src_present);
            break;
        case 3:
            $('#track_3_centre').attr('src', track_src_present);
            break;
        case 4:
            $('#track_4').attr('src', track_src_present);
            break;
        case 7:
            $('#track_3_y').attr('src', track_src_present);
            break;
    }
}

function processSensor(sensor) {

    switch (sensor['track']) {
        case 0:
            if (sensor['orientation'] == 0) { //senzorul de la intrarea pe modul
                if (sensor['counter'] == 1 && sensor['state'] == 'present') { //trenul a intrat pe modul -->
                    markLineAsOccupied(0);
                    if (checkIfLineIsOccupied(2) && checkIfLineIsOccupied(3) && checkIfLineIsOccupied(4)) {
                        console.log('toata liniile sunt ocupate, nu se poate face parcursul');
                    } else {
                        make_route_x = true;
                        colorizeTrackAsRouteForEnteringTrain(1);
                    }
                } else if (sensor['counter'] == 0 && sensor['state'] == 'empty') { //trenul paraseste modulul <--
                    make_route_x = false;
                    uncolorizeTrack(0, 0);
                    unblockSwitchesForFreeTracks();
                    enableAvailableTurnouts(0);
                }
            } else { //senzorul de dinainte de macaze
                if (sensor['counter'] == 1 && sensor['state'] == 'present') {// trenul iese din statie si eliberam linia ocupata <--
                    //decoloram linia de pe care tocmai a plecat si coloram ca pentru prezenta intrarea
                    signal.color = 'red';
                    signal.type = 1;
                    signal.number = getCurrentSetTrackX();
                    changeSignal(signal, false);
                    markLineAsOccupied(0);
                    uncolorizeTrack(getCurrentSetTrackX(), 0);
                    unblockSwitchesForFreeTracks();
                } else if (sensor['counter'] == 0 && sensor['state'] == 'present') { //trenul intra in statie, este aproape de semnalul de intrare -->

                    if (checkIfLineIsOccupied(2) && checkIfLineIsOccupied(3) && checkIfLineIsOccupied(4)) {
                        console.log('toata liniile sunt ocupate, nu se poate face parcursul');
                    } else {
                        make_route_x = true;
                        colorizeTrackAsRouteForEnteringTrain(1);
                    }

                    if (getSignalColor(0, 'x') == 'red') {
                        console.log('semnal pe rosu');
                        //pune viteza pe 0
                    } else { //daca nu e rosu, se coloreaza macazul/sau linia between in rosu ca pentru prezenta
                        if ($('#turnout1_toggle').val() == 1) {
                            $('#left_turnout_2').attr('src', left_turnout_src_present);
                        }
                        else {
                            $('#track_3_x_between').attr('src', track_src_present);
                        }
                    }
                }
            }
            break;

        case 7:
            if (sensor['orientation'] == 1) { //senzorul de la intrarea pe modul
                if (sensor['counter'] == 1 && sensor['state'] == 'present') { //trenul a intrat pe modul <--
                    markLineAsOccupied(7);
                    make_route_y = true;
                    colorizeTrackAsRouteForEnteringTrain(2);
                } else if (sensor['counter'] == 0 && sensor['state'] == 'empty') { //trenul paraseste modulul -->
                    uncolorizeTrack(7, 1);
                    make_route_y = false;
                    unblockSwitchesForFreeTracks();
                    enableAvailableTurnouts(1);
                }
            } else { //senzorul de dinainte de macaze
                if (sensor['counter'] == 1 && sensor['state'] == 'present') { /// trenul iese din statie si eliberam linia ocupata -->
                    //decoloram linie de pe care tocmai a plecat
                    uncolorizeTrack(getCurrentSetTrackY(), 1);
                    signal.color = 'red';
                    signal.type = 0;
                    signal.number = getCurrentSetTrackY();
                    changeSignal(signal, false);
                    unblockSwitchesForFreeTracks();
                    markLineAsOccupied(7);

                } else if (sensor['counter'] == 0 && sensor['state'] == 'present') { //trenul intra in statie, este aprope de semnalul de intrare <--
                    if (getSignalColor(7, 'y') == 'red') {
                        console.log('semnal pe rosu');
                        //pune viteza pe 0
                    } else { //daca nu e rosu, se coloreaza macazul/sau linia between in rosu ca pentru prezenta
                        if ($('#turnout2_toggle').val() == 1) {
                            $('#left_turnout_4').attr('src', left_turnout_src_present);
                        }
                        else {
                            $('#track_3_y_between').attr('src', track_src_present);
                        }
                    }
                }
            }
            break;

        case 2:
            if (sensor['orientation'] == 0) {//s-a calcat senzorul x al liniei
                if (sensor['state'] == 'present' && sensor['counter'] == 1) { // -->
                    $('#left_turnout_2').attr('src', left_turnout_src_present);
                    $('#track_2').attr('src', track_src_present);
                    $('#track_3_x').attr('src', track_src); // eliberam intrarea
                    signal.number = 0;
                    signal.type = 0;
                    signal.color = 'red';
                    changeSignal(signal); //se elibereaza semnalul de intrare
                } else if (sensor['state'] == 'present' && sensor['counter'] == 0) { // <--
                    $('#right_turnout_2').attr('src', right_turnout_src);
                    //vine dinspre y, trenul a ajuns la senzorul dinainte de semnal
                    //se verifica semnalul ce culoare are. daca e rosu se opreste punand viteza pe 0

                    //daca nu e rosu, se coloreaza macazul/sau linia between in rosu ca pentru prezenta
                    make_route_y = false;
                    unblockRouteAfterTrainParked(7);
                }
            } else { // s-a calcat senzorul y al liniei
                if (sensor['state'] == 'present' && sensor['counter'] == 1) { // <--
                    $('#right_turnout_2').attr('src', right_turnout_src_present);
                    $('#track_2').attr('src', track_src_present);
                    $('#track_3_y').attr('src', track_src); //eliberam iesirea
                    $('#track_3_y_between').attr('src', track_src);
                    signal.number = 7;
                    signal.type = 1;
                    signal.color = 'red';
                    changeSignal(signal); //se elibereaza semnalul de intrare
                } else if (sensor['state'] == 'present' && sensor['counter'] == 0) {
                    $('#left_turnout_2').attr('src', left_turnout_src);
                    //vine dinspre x, trenul a ajuns la senzorul dinainte de semnal
                    //se verifica semnalul ce culoare are. daca e rosu se opreste punand viteza pe 0
                    if (getSignalColor(2, 'x') == 'red') {
                        console.log('semnal pe rosu');
                        //pune viteza pe 0
                    } else { //daca nu e rosu, se coloreaza macazul/sau linia between in rosu ca pentru prezenta
                        $('#right_turnout_2').attr('src', right_turnout_src_present);
                    }
                    //daca nu e rosu, se coloreaza macazul/sau linia between in rosu ca pentru prezenta
                    make_route_x = false;
                    unblockRouteAfterTrainParked(0);
                }
            }
            break;

        case 3:

            if (sensor['orientation'] == 0) {//s-a calcat senzorul x al liniei
                if (sensor['state'] == 'present' && sensor['counter'] == 1) { // -->
                    $('#track_3_centre').attr('src', track_src_present);
                    $('#track_3_x').attr('src', track_src); // eliberam intrarea
                    signal.number = 0;
                    signal.type = 0;
                    signal.color = 'red';
                    changeSignal(signal); //se elibereaza semnalul de intrare
                } else if (sensor['state'] == 'present' && sensor['counter'] == 0) { // <--
                    //vine dinspre y
                    //trenul a ajuns la senzorul dinainte de semnal
                    //se verifica semnalul ce culoare are. daca e rosu se opreste punand viteza pe 0
                    $('#track_3_y_between').attr('src', track_src);
                    if (getSignalColor(7, 'y') == 'red') {
                        console.log('semnal pe rosu');
                        //pune viteza pe 0
                    }
                    //daca nu e rosu, se coloreaza macazul/sau linia between in rosu ca pentru prezenta
                    make_route_y = false;
                    unblockRouteAfterTrainParked(7);
                }
            } else { // s-a calcat senzorul y al liniei
                if (sensor['state'] == 'present' && sensor['counter'] == 1) { // <--
                    $('#track_3_centre').attr('src', track_src_present);
                    $('#track_3_y').attr('src', track_src); // eliberam intrarea
                    signal.number = 7;
                    signal.type = 1;
                    signal.color = 'red';//se elibereaza semnalul de intrare
                    changeSignal(signal); //se elibereaza semnalul de intrare
                } else if (sensor['state'] == 'present' && sensor['counter'] == 0) {
                    $('#track_3_x_between').attr('src', track_src);
                    //vine dinspre x
                    //trenul a ajuns la senzorul dinainte de semnal
                    //se verifica semnalul ce culoare are. daca e rosu se opreste punand viteza pe 0

                    //daca nu e rosu, se coloreaza macazul/sau linia between in rosu ca pentru prezenta
                    //se elibereaza x-ul
                    make_route_x = false;
                    unblockRouteAfterTrainParked(0);
                }
            }
            break;

        case 4:

            if (sensor['orientation'] == 0) {//s-a calcat senzorul x al liniei
                if (sensor['state'] == 'present' && sensor['counter'] == 1) { // -->
                    $('#track_4').attr('src', track_src_present);
                    $('#right_turnout_4').attr('src', right_turnout_src_present);
                    $('#track_3_x').attr('src', track_src); // eliberam intrarea
                    signal.number = 0;
                    signal.type = 0;
                    signal.color = 'red';
                    changeSignal(signal); //se elibereaza semnalul de intrare
                } else if (sensor['state'] == 'present' && sensor['counter'] == 0) { // <--
                    $('#left_turnout_4').attr('src', left_turnout_src);
                    //vine dinspre y
                    //trenul a ajuns la senzorul dinainte de semnal
                    //se verifica semnalul ce culoare are. daca e rosu se opreste punand viteza pe 0
                    //daca nu e rosu, se coloreaza macazul/sau linia between in rosu ca pentru prezenta
                    make_route_y = false;
                    unblockRouteAfterTrainParked(7);
                }
            } else { // s-a calcat senzorul y al liniei
                if (sensor['state'] == 'present' && sensor['counter'] == 1) { // <--
                    $('#track_4').attr('src', track_src_present);
                    $('#left_turnout_4').attr('src', left_turnout_src_present);
                    $('#track_3_y').attr('src', track_src); // eliberam intrarea
                    signal.number = 7;
                    signal.type = 1;
                    signal.color = 'red';//se elibereaza semnalul de intrare
                    changeSignal(signal); //se elibereaza semnalul de intrare
                } else if (sensor['state'] == 'present' && sensor['counter'] == 0) {
                    $('#right_turnout_4').attr('src', right_turnout_src);
                    //vine dinspre x
                    //trenul a ajuns la senzorul dinainte de semnal
                    //se verifica semnalul ce culoare are. daca e rosu se opreste punand viteza pe 0
                    //daca nu e rosu, se coloreaza macazul/sau linia between in rosu ca pentru prezenta
                    //se elibereaza x-ul
                    make_route_x = false;
                    unblockRouteAfterTrainParked(0);
                }
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
            if (checkIfLineIsOccupied(2) && checkIfLineIsOccupied(3) && checkIfLineIsOccupied(4)) {
                console.log('toata liniile sunt ocupate, nu se poate face parcursul');
            } else {
                make_route_x = true;
                colorizeTrackAsRouteForEnteringTrain(1);
            }
            //secureTrackForParking(getCurrentSetTrackX(), 0);
            break;

        case 2:
        case 3:
        case 4:
            setSignalColor(signal);
            if (signal.color == 'green' || signal.color == 'yellow') {
                setRouteForLeavingTrain(signal);
                if (signal.type == 0) { //semnal x de iesire
                    blockRouteForPassingTrain(2);
                } else {
                    blockRouteForPassingTrain(1);
                }
            } else if (signal.color == 'red') {
                cancelRouteForLeavingTrain(signal);
            }
            break;

        case 7: //semnal de intrare y
            setSignalColor(signal);
            blockRouteForPassingTrain(2);
            secureOccupiedTrack(getCurrentSetTrackY(), 0);
            if (checkIfLineIsOccupied(2) && checkIfLineIsOccupied(3) && checkIfLineIsOccupied(4)) {
                console.log('toata liniile sunt ocupate, nu se poate face parcursul');
            } else {
                make_route_y = true;
                colorizeTrackAsRouteForEnteringTrain(7);
            }
            //secureTrackForParking(getCurrentSetTrackY(), 1);
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

function setSignalColorManual(number, type, color) {
    var signalId = '#signal' + number + '_' + type;
    $(signalId + ' li[color="red"] span').removeClass('fg-red').addClass('fg-grayLight');
    $(signalId + ' li[color="' + color + '"] span').removeClass('fg-grayLight').addClass('fg-' + color);
}

function getSignalColor(lineNumber, signalType) {
    var signalId = '#signal' + lineNumber + '_' + signalType;
    return $(signalId).attr('state');
}


