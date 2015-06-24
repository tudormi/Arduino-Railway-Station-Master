/**
 * Created by tmatrescu on 4/6/2015.
 */
var allow = true;

$(document).ready(function(){
    var polling = new Poll();
});

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
        console.log('request aborted');
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
