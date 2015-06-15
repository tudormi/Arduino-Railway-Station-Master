/**
 * Created by tmatrescu on 9/6/2015.
 */

$(document).ready(function() {

    clearCall();
    if(localStorage.length == 0) return;

    $('#track_25').html(localStorage.getItem('track_25'));

    $('#left_turnout_2').attr('src', localStorage.getItem('left_turnout_2'));
    $('#right_turnout_2').attr('src', localStorage.getItem('right_turnout_2'));
    $('#turnout1_toggle').val(localStorage.getItem('turnout5_toggle'));
    if(localStorage.getItem('turnout1_toggle_status') == 'disabled') $('#turnout1_toggle').attr('disabled', 'disabled');
    $('#turnout5_toggle').val(localStorage.getItem('turnout5_toggle'));
    if(localStorage.getItem('turnout5_toggle_status') == 'disabled') $('#turnout5_toggle').attr('disabled', 'disabled');
    $('#turnout4_toggle').val(localStorage.getItem('turnout4_toggle'));
    if(localStorage.getItem('turnout4_toggle_status') == 'disabled') $('#turnout4_toggle').attr('disabled', 'disabled');

    $('#track_3').html(localStorage.getItem('track_3'));

    $('#left_turnout_4').attr('src', localStorage.getItem('left_turnout_4'));
    $('#right_turnout_4').attr('src', localStorage.getItem('right_turnout_4'));
    $('#turnout3_toggle').val(localStorage.getItem('turnout3_toggle'));
    if(localStorage.getItem('turnout3_toggle_status') == 'disabled') $('#turnout3_toggle').attr('disabled', 'disabled');
    $('#turnout6_toggle').val(localStorage.getItem('turnout6_toggle'));
    if(localStorage.getItem('turnout6_toggle_status') == 'disabled') $('#turnout6_toggle').attr('disabled', 'disabled');
    $('#turnout2_toggle').val(localStorage.getItem('turnout2_toggle'));
    if(localStorage.getItem('turnout2_toggle_status') == 'disabled') $('#turnout2_toggle').attr('disabled', 'disabled');

    $('#track_46').html(localStorage.getItem('track_46'));

    $('#track1_direction_toggle').val(localStorage.getItem('track1_direction_toggle'));
    $('#track1_speed_control').val(localStorage.getItem('track1_speed_control'));
    $('#track2_direction_toggle').val(localStorage.getItem('track2_direction_toggle'));
    $('#track2_speed_control').val(localStorage.getItem('track2_speed_control'));

    localStorage.clear();
});

$(window).on('beforeunload', function(){

    /* layout */
    localStorage.setItem('track_25', $('#track_25').html());

    localStorage.setItem('left_turnout_2', $('#left_turnout_2').attr('src'));
    localStorage.setItem('right_turnout_2', $('#right_turnout_2').attr('src'));
    localStorage.setItem('turnout5_toggle', $('#turnout5_toggle').val());
    localStorage.setItem('turnout1_toggle_status', getTurnoutState(1));
    localStorage.setItem('turnout5_toggle_status', getTurnoutState(5));
    localStorage.setItem('turnout4_toggle', $('#turnout4_toggle').val());
    localStorage.setItem('turnout4_toggle_status', getTurnoutState(4));

    localStorage.setItem('track_3', $('#track_3').html());

    localStorage.setItem('left_turnout_4', $('#left_turnout_4').attr('src'));
    localStorage.setItem('right_turnout_4', $('#right_turnout_4').attr('src'));
    localStorage.setItem('turnout3_toggle', $('#turnout3_toggle').val());
    localStorage.setItem('turnout3_toggle_status', getTurnoutState(3));
    localStorage.setItem('turnout6_toggle', $('#turnout6_toggle').val());
    localStorage.setItem('turnout6_toggle_status', getTurnoutState(6));
    localStorage.setItem('turnout2_toggle', $('#turnout2_toggle').val());
    localStorage.setItem('turnout2_toggle_status', getTurnoutState(2));

    localStorage.setItem('track_46', $('#track_46').html());

    /* track control */
    localStorage.setItem('track1_direction_toggle', $('#track1_direction_toggle').val());
    localStorage.setItem('track1_speed_control', Number($('#track1_speed_control').val()));
    localStorage.setItem('track2_direction_toggle', $('#track2_direction_toggle').val());
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
