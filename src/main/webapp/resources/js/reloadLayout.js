/**
 * Created by tmatrescu on 9/6/2015.
 */

$(document).ready(function() {

    clearCall();
    if(localStorage.length == 0) return;

    /* signals */
    setSignalColorManual(0, 'x', localStorage.getItem('signal0_x'));
    $('#signal0_x').attr('state', localStorage.getItem('signal0_x'));

    setSignalColorManual(2, 'y', localStorage.getItem('signal2_y'));
    $('#signal2_y').attr('state', localStorage.getItem('signal2_y'));
    setSignalColorManual(2, 'x', localStorage.getItem('signal2_x'));
    $('#signal2_x').attr('state', localStorage.getItem('signal2_x'));

    setSignalColorManual(3, 'y', localStorage.getItem('signal3_y'));
    $('#signal3_y').attr('state', localStorage.getItem('signal3_y'));
    setSignalColorManual(3, 'x', localStorage.getItem('signal3_x'));
    $('#signal3_x').attr('state', localStorage.getItem('signal3_x'));

    setSignalColorManual(4, 'y', localStorage.getItem('signal4_y'));
    $('#signal4_y').attr('state', localStorage.getItem('signal4_y'));
    setSignalColorManual(4, 'x', localStorage.getItem('signal4_x'));
    $('#signal4_x').attr('state', localStorage.getItem('signal4_x'));

    setSignalColorManual(7, 'y', localStorage.getItem('signal7_y'));
    $('#signal7_y').attr('state', localStorage.getItem('signal7_y'));

    /* turnouts */
    $('#turnout1_toggle').val(localStorage.getItem('turnout1_toggle'));
    if(localStorage.getItem('turnout1_toggle_status') == 'disabled') $('#turnout1_toggle').attr('disabled', 'disabled');

    $('#turnout2_toggle').val(localStorage.getItem('turnout2_toggle'));
    if(localStorage.getItem('turnout2_toggle_status') == 'disabled') $('#turnout2_toggle').attr('disabled', 'disabled');

    $('#turnout3_toggle').val(localStorage.getItem('turnout3_toggle'));
    if(localStorage.getItem('turnout3_toggle_status') == 'disabled') $('#turnout3_toggle').attr('disabled', 'disabled');

    $('#turnout4_toggle').val(localStorage.getItem('turnout4_toggle'));
    if(localStorage.getItem('turnout4_toggle_status') == 'disabled') $('#turnout4_toggle').attr('disabled', 'disabled');

    $('#turnout5_toggle').val(localStorage.getItem('turnout5_toggle'));
    if(localStorage.getItem('turnout5_toggle_status') == 'disabled') $('#turnout5_toggle').attr('disabled', 'disabled');

    $('#turnout6_toggle').val(localStorage.getItem('turnout6_toggle'));
    if(localStorage.getItem('turnout6_toggle_status') == 'disabled') $('#turnout6_toggle').attr('disabled', 'disabled');
    /* tracks */
    $('#track_2').attr('src', localStorage.getItem('track_2'));
    $('#track_3_x').attr('src', localStorage.getItem('track_3_x'));
    $('#track_3_x_between').attr('src', localStorage.getItem('track_3_x_between'));
    $('#track_3_centre').attr('src', localStorage.getItem('track_3_centre'));
    $('#track_3_y_between').attr('src', localStorage.getItem('track_3_y_between'));
    $('#track_3_y').attr('src', localStorage.getItem('track_3_y'));
    $('#track_4').attr('src', localStorage.getItem('track_4'));
    $('#track_5').attr('src', localStorage.getItem('track_5'));
    $('#track_6').attr('src', localStorage.getItem('track_6'));

    $('#left_turnout_2').attr('src', localStorage.getItem('left_turnout_2'));
    $('#right_turnout_2').attr('src', localStorage.getItem('right_turnout_2'));
    $('#left_turnout_4').attr('src', localStorage.getItem('left_turnout_4'));
    $('#right_turnout_4').attr('src', localStorage.getItem('right_turnout_4'));


    $('#track1_direction_toggle').val(localStorage.getItem('track1_direction_toggle'));
    $('#track1_speed_control').val(localStorage.getItem('track1_speed_control'));
    $('#track2_direction_toggle').val(localStorage.getItem('track2_direction_toggle'));
    $('#track2_speed_control').val(localStorage.getItem('track2_speed_control'));

    localStorage.clear();
});

$(window).on('beforeunload', function(){

    /* signals */
    localStorage.setItem('signal0_x', getSignalColor(0, 'x'));

    localStorage.setItem('signal2_y', getSignalColor(2, 'y'));
    localStorage.setItem('signal2_x',getSignalColor(2, 'x'));

    localStorage.setItem('signal3_y', getSignalColor(3, 'y'));
    localStorage.setItem('signal3_x', getSignalColor(3, 'x'));

    localStorage.setItem('signal4_y', getSignalColor(4, 'y'));
    localStorage.setItem('signal4_x', getSignalColor(4, 'x'));

    localStorage.setItem('signal7_y', getSignalColor(7, 'y'));

    /* turnouts */
    localStorage.setItem('turnout1_toggle', $('#turnout1_toggle').val());
    localStorage.setItem('turnout1_toggle_status', getTurnoutState(1));

    localStorage.setItem('turnout2_toggle', $('#turnout2_toggle').val());
    localStorage.setItem('turnout2_toggle_status', getTurnoutState(2));

    localStorage.setItem('turnout3_toggle', $('#turnout3_toggle').val());
    localStorage.setItem('turnout3_toggle_status', getTurnoutState(3));

    localStorage.setItem('turnout4_toggle', $('#turnout4_toggle').val());
    localStorage.setItem('turnout4_toggle_status', getTurnoutState(4));

    localStorage.setItem('turnout5_toggle', $('#turnout5_toggle').val());
    localStorage.setItem('turnout5_toggle_status', getTurnoutState(5));

    localStorage.setItem('turnout6_toggle', $('#turnout6_toggle').val());
    localStorage.setItem('turnout6_toggle_status', getTurnoutState(6));

    /* tracks */
    localStorage.setItem('track_2', $('#track_2').attr('src'));
    localStorage.setItem('track_3_x', $('#track_3_x').attr('src'));
    localStorage.setItem('track_3_x_between', $('#track_3_x_between').attr('src'));
    localStorage.setItem('track_3_centre', $('#track_3_centre').attr('src'));
    localStorage.setItem('track_3_y_between', $('#track_3_y_between').attr('src'));
    localStorage.setItem('track_3_y', $('#track_3_y').attr('src'));
    localStorage.setItem('track_4', $('#track_4').attr('src'));
    localStorage.setItem('track_5', $('#track_5').attr('src'));
    localStorage.setItem('track_6', $('#track_6').attr('src'));

    localStorage.setItem('left_turnout_2', $('#left_turnout_2').attr('src'));
    localStorage.setItem('right_turnout_2', $('#right_turnout_2').attr('src'));
    localStorage.setItem('left_turnout_4', $('#left_turnout_4').attr('src'));
    localStorage.setItem('right_turnout_4', $('#right_turnout_4').attr('src'));

    /* track control */
    localStorage.setItem('track1_direction_toggle', Number($('#track1_direction_toggle').val()));
    localStorage.setItem('track1_speed_control', Number($('#track1_speed_control').val()));
    localStorage.setItem('track2_direction_toggle', Number($('#track2_direction_toggle').val()));
    localStorage.setItem('track2_speed_control', Number($('#track2_speed_control').val()));

    localStorage.setItem('make_route_x', make_route_x);
    localStorage.setItem('make_route_y', make_route_y);
});

function getTurnoutState(turnoutNumber){
    var attr = $('#turnout'+turnoutNumber+'_toggle').attr('disabled');
    if (typeof attr !== typeof undefined && attr !== false) {
        return 'disabled';
    }
    else return 'enabled';
}

function clearCall(){
    $.ajax({
        url: '/command/localStorage',
        async: false,
        type: 'get',
        success: function (data) {
            if(data == 0 ) {
                localStorage.clear();
                return 0;
            }
            else return 1;
        }
    });
}
