/**
 * Created by tmatrescu on 4/6/2015.
 */
var allow = true;

function Poll() {

    console.log('Polling started');
    setInterval(function () {
        if (allow === true) {
            allow = false;
            getSensorUpdate();
        }
    }, 500);
}

function getSensorUpdate() {

    console.log('new update request');
    if (request) {
        request.abort();
    }

    var request = $.ajax({
        url: 'command/getSensor',
        type: 'get'
    });
    request.done(function (sensor) {
        processSensor(sensor);
    });

    request.fail(function (jqXHR, textStatus, errorThrown) {
        console.log("Polling - the following error occured: " + textStatus, errorThrown);
    });

    request.always(function () {
        allow = true;
    });
}

function processSensor(sensor) {
    switch (sensor['track']) {
        case 0:
            if (sensor['state'] == 'empty' && sensor['orientation'] == 1) {
                blockRoute(1);
                /* se blocheaza parcursul */
            } else {
                $('#track_3_x').attr('src', 'resources/images/track_present.png');
            }
            break;

        case 3:
            $('#track_3_centre').attr('src', 'resources/images/track_' + sensor['state'] + '.png');
            if (sensor['state'] == 'present' && sensor['orientation'] == 0) {
                /* trenul trece de pe intrare pe linia 3 activand primul senzor */
                /* trebuie pus un timer pt deblocarea intrarii astfel incat trenul sa poata trece de macaze */
                console.log('inainte de 30 sec');
                setTimeout(function () {
                    unblockRoute(1);
                }, 30000);
                console.log('dupa 30 de sec');
            }
            break;
    }
}

function blockRoute(firstTurnout) {

    var presentTrack_src = 'resources/images/track_present.png';
    var routeTrack_src = 'resources/images/track_route.png';

    switch (firstTurnout) {
        case 1:
            $('#turnout1_toggle').attr('disabled', 'disabled');
            $('#turnout3_toggle').attr('disabled', 'disabled');
            $('#turnout5_toggle').attr('disabled', 'disabled');
            if ($('#turnout1_toggle').val() == 0) {
                /* coloram parcursul in rosu */
                $('#track_3_x_between').attr('src', presentTrack_src);
                $('#track_3_centre').attr('src', presentTrack_src);
            } else {
                /* coloram parcursul in rosu */
                $('#left_turnout_2').attr('src', presentTrack_src);
                $('#track_2').attr('src', presentTrack_src);
            }
            break;
    }
}

function unblockRoute(firstTurnout) {

    var emptyTrack_src = 'resources/images/track_empty.png';

    switch (firstTurnout) {
        case 1:
            $('#turnout1_toggle').removeAttr('disabled');
            $('#turnout3_toggle').removeAttr('disabled');
            $('#turnout5_toggle').removeAttr('disabled');
            $('#track_3_x').attr('src', emptyTrack_src);
            $('#track_3_x_between').attr('src', emptyTrack_src);
            //if ($('#turnout1_toggle').val() == 0) {
            //    /* revenim la parcurs neocupat */
            //    $('#track_3_x_between').attr('src', emptyTrack_src);
            //    $('#track_3_centre').attr('src', emptyTrack_src);
            //} else {
            //    /* revenim la parcurs neocupat */
            //    $('#left_turnout_2').attr('src', emptyTrack_src);
            //    $('#track_2').attr('src', emptyTrack_src);
            //}
            break;
    }
}
