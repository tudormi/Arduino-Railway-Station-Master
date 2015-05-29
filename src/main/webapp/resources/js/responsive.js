/**
 * Created by tmatrescu on 29/5/2015.
 */
$(document).ready(function(){

    $( window ).resize(function() {
        var total = $('#station_scheme').width();
        $('#left_turnout_1').css('left',parseInt($('#track_1 .track').css('margin-left'),10)-122);
        $('#left_turnout_2').css('left',$('#track_5').width() + parseInt($('#track_5').css('left'),10) -122);
        $('#right_turnout_2').css('right',total - $('#track_2').width()- parseInt($('#track_2').css('left'),10) -122);
        $('#left_turnout_4').css('right',total - $('#track_4').width()- parseInt($('#track_46 .track').css('left'),10) -122);
        $('#right_turnout_4').css('left', parseInt($('#track_4').css('left'),10) -122);

    });

});
