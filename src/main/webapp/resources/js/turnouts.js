/**
 * Created by tmatrescu on 16/6/2015.
 */
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

    $('.turnout_toggle').on('slide', function () {
        /* 0 - directa, 1 - abatuta */
        turnout.number = Number($(this).attr('turnoutNumber'));
        turnout.direction = Number($(this).val());
        sendServerNotificationForRoutingColor(turnout);
    });

});

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

function synchronizeTurnouts(turnout) {
    switch (turnout.number) {
        case 1:
            changeTurnout(5, turnout.direction);
            break;

        case 5:
            changeTurnout(1, turnout.direction);
            break;

        case 2:
            changeTurnout(6, turnout.direction);
            break;

        case 6:
            changeTurnout(2, turnout.direction);
            break;
    }
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
