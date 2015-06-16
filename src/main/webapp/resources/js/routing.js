/**
 * Created by tmatrescu on 16/6/2015.
 */

function sendServerNotificationForRoutingColor(number, direction) {
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
                colorizeTrackAsRouteForEnteringTrain(turnout.number, turnout.direction);
            }
        }
    });
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

function setRouteForLeavingTrain(signal) {

    switch (signal.number) {
        case 2:
            setTurnoutsForLeavingTrain(2, signal.type);
            colorizeTrackAsRouteForLeavingTrain(2, signal.type);
            break;

        case 3:
            setTurnoutsForLeavingTrain(3, signal.type);
            colorizeTrackAsRouteForLeavingTrain(3, signal.type);
            break;

        case 4:
            setTurnoutsForLeavingTrain(4, signal.type);
            colorizeTrackAsRouteForLeavingTrain(4, signal.type);
            break;
    }
}

function cancelRouteForLeavingTrain(signal) {
    switch (signal.number) {
        case 2:
            setTurnoutsForLeavingTrain(2, signal.type);
            if (signal.type == 0) uncolorizeTrack(7, 1);
            else uncolorizeTrack(0, 0);
            break;

        case 3:
            setTurnoutsForLeavingTrain(3, signal.type);
            if (signal.type == 0) uncolorizeTrack(7, 1);
            else uncolorizeTrack(0, 0);
            break;

        case 4:
            setTurnoutsForLeavingTrain(4, signal.type);
            if (signal.type == 0) uncolorizeTrack(7, 1);
            else uncolorizeTrack(0, 0);
            break;
    }
}

function colorizeTrackAsRouteForEnteringTrain(turnoutNumber) {

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
            colorizeTrackAsRoute(lineNumberX, 0);
            break;

        case 2:
        case 4:
        case 6:
            if (!($('#track_2').attr('src') != track_src_present && make_route_x == true && lineNumberX == 2)) uncolorizeTrack(2, 1);
            else $('#right_turnout_2').attr('src', right_turnout_src);
            if (!($('#track_3_centre').attr('src') != track_src_present && make_route_x == true && lineNumberX == 3)) uncolorizeTrack(3, 1);
            if (!($('#track_4').attr('src') != track_src_present && make_route_x == true && lineNumberX == 4)) uncolorizeTrack(4, 1);
            else $('#left_turnout_4').attr('src', left_turnout_src);
            colorizeTrackAsRoute(lineNumberY, 1);
            break;

    }
}

function colorizeTrackAsRoute(tracknumber, orientation) {
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

function colorizeTrackAsRouteForLeavingTrain(trackNumber, signalType) {
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
        colorizeTrackAsRoute(7, 0);
    } else {//coloram x
        colorizeTrackAsRoute(0, 1);
    }
}

function uncolorizeTrack(tracknumber, orientation) {
    switch (tracknumber) {

        case 0:
            $('#track_3_x').attr('src', track_src);
            if (getCurrentSetTrackX() == 2) $('#left_turnout_2').attr('src', left_turnout_src);
            if (getCurrentSetTrackX() == 3) $('#track_3_x_between').attr('src', track_src);
            else {
                $('#track_3_x_between').attr('src', track_src);
                $('#right_turnout_4').attr('src', right_turnout_src);
            }
            break;

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

        case 7:
            $('#track_3_y').attr('src', track_src);
            if (getCurrentSetTrackY() == 4) $('#left_turnout_4').attr('src', left_turnout_src);
            if (getCurrentSetTrackY() == 3) $('#track_3_y_between').attr('src', track_src);
            else {
                $('#track_3_y_between').attr('src', track_src);
                $('#right_turnout_2').attr('src', right_turnout_src);
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

function unsecureOccupiedTrack(trackNumber, direction) {
    switch (trackNumber) {
        case 2:
            if (direction == 0) {//trenul vine dinspre y, blocam x-ul
                changeTurnout(1, 0);
                changeTurnout(5, 0);
                $('#turnout1_toggle').attr('blocked', 'false').removeAttr('disabled');
                $('#turnout5_toggle').attr('blocked', 'false').removeAttr('disabled');
            }
            else { //trenul vine dinspre x, blocam y-ul
                changeTurnout(4, 0);
                $('#turnout4_toggle').attr('blocked', 'false').removeAttr('disabled');
            }
            break;

        case 3:
            if (direction == 0) {//trenul vine dinspre y, blocam x-ul
                changeTurnout(3, 1);
                $('#turnout3_toggle').attr('blocked', 'false').removeAttr('disabled');
            } else { //trenul vine dinspre x, blocam y-ul
                changeTurnout(4, 1);
                $('#turnout4_toggle').attr('blocked', 'false').removeAttr('disabled');
            }
            break;

        case 4:
            if (direction == 0) {//trenul vine dinspre y, blocam x-ul
                changeTurnout(3, 0);
                $('#turnout3_toggle').attr('blocked', 'false').removeAttr('disabled');
            } else { //trenul vine dinspre x, blocam y-ul
                changeTurnout(2, 0);
                changeTurnout(6, 0);
                $('#turnout2_toggle').attr('blocked', 'false').removeAttr('disabled');
                $('#turnout6_toggle').attr('blocked', 'false').removeAttr('disabled');
            }
            break;
    }
}

function unblockRouteAfterTrainParked(lineNumber) {
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
