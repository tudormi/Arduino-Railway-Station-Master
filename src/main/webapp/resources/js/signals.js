/**
 * Created by tmatrescu on 5/6/2015.
 */
$(document).ready(function(){

    $('#signal_x li').on('click', function () {
        var signal = {
            number: 0,
            type: 0,
            color: 'nothing'
        };
        signal.number = Number($(this).parent().attr('number'));
        signal.type = Number($(this).parent().attr('type'));
        signal.color = $(this).attr('color');

        $.ajax({
            url:'/command/signal',
            type: 'post',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(signal),
            success: function(data){
                console.log(data);
            }
        })


    })

})
