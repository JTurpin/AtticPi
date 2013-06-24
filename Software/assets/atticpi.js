(function ($) {
  // set a random temp
  /**
   * test data. This info will actually be added by the php.
   */
  /**
  var mintemp = 90;
  var maxtemp = 140;
  var tmp = Math.round(Math.random() * (maxtemp - mintemp) + mintemp);
  $('#temp').text(tmp);
  /**/

  var th1 = 95;
  var th2 = 110;

  var temp = $('#temp').html();

  if ( temp > th1 && temp < th2 ) {
    $('#temp').addClass('temp-med');
  }
  else if ( temp > th2 ) {
    $('#temp').addClass('temp-hot');
  }

toHHMMSS = function (sec_num) {
//    var sec_num = parseInt(this, 10); // don't forget the second parm
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
}

  var setCounter = function(counter, sec) {
    // set the default as 300
    sec = typeof sec !== 'undefined' ? sec : 300;
    counter.text(toHHMMSS(sec));
  }

  /**
   * if the fan is not running we should show the 'Run 5Min' button.
   */
  $('.fan:not(.on)').each(function(e){
    $(this).find('.running').text("00:05:00");
    $(this).find(".start-fan").show();

    var that = $(this);
  });

    $('.start-fan').click(function(e){
      // send a call back to the server to start the fan
      
      
      // switch the button to stop-fan
      var button = $(this);
      var sib = $(this).siblings("button");
      button.attr('disabled', 'disabled').hide();
      sib.show();
      
      // start the count-down timer.
      var timer = 3;
      var running = $(this).parent().find('.running');

      var interval = setInterval(function() {
          timer--; 
          setCounter(running, timer);
          if (timer == 0) {
            // set the button back
            clearInterval(button.attr("interval"));
            sib.hide();
            button.removeAttr('disabled').show();
            setCounter(running);
          }

      }, 1000);
      button.attr('interval', interval);
    });

    $('.start-fan').click(function(e){

      // Send a Stop command

      // switch the button to start-fan
      var button = $(this);
      var sib = $(this).siblings("button");
      button.attr('disabled', 'disabled').hide();
      sib.show();
    });

  /**
   * if the fan is running, we have other things to do.
   */
  $('.fan.on').each(function(e){
    var t = $(this).find('.running').attr('time');

    var running = $(this).find('.running');
    setInterval(function() {
      running.text(toHHMMSS(Math.floor($.now() / 1000) - t));
    }, 1000);

    $(this).find("button").text("Stop Fan").addClass('stop-fan');
  });



}(jQuery));

String.prototype.toHHMMSS = function (sec_num) {
    //var sec_num = parseInt(this, 10); // don't forget the second parm
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
}
