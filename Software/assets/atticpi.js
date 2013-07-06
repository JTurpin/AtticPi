(function ($) {

  /**
   * Temperature thresholds
   */
  var th1 = 95;
  var th2 = 110;

  $('.temp').each(function(e) {
    var temp = $(this).html();

    if ( temp > th1 && temp < th2 ) {
      $(this).addClass('temp-med');
    }
    else if ( temp > th2 ) {
      $(this).addClass('temp-hot');
    }
  });
    

  // Format a time from a number of seconds
  var toHHMMSS = function (sec_num) {
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
   * Do the whole sending of the ajax command.
   */
  var sendCommand = function(command,which_fan, parameter) {
    $.ajax({
      type: "POST",
      url: "index.php",
      data: { fan:which_fan, cmd:command, param: parameter}
    }).done(function( msg ) {
      //alert( "Passed back: " + msg)
    });
  }


  /**
   * Click the run fan button and let the expected happen.
   */
  $('.start-fan').click(function(e){
    // send a call back to the server to start the fan
    var button = $(this);
    var which = button.attr('name');
    var timer = 300;

    // switch the button to stop-fan
    var sib = button.siblings("button");

    // start the count-down timer.
    var running = button.parent().find('.running');
    var li = button.parentsUntil('ul');

    sendCommand("on", which, timer);

    button.attr('disabled', 'disabled').hide();
    sib.removeAttr('disabled').show();
    li.removeClass("off").addClass("on");

    var interval = setInterval(function() {
        timer--; 
        setCounter(running, timer);
        if (timer == 0) {
          // set the button back
          clearInterval(button.attr("interval"));
          setCounter(running);

          sib.hide();
          button.removeAttr('disabled').show();
          li.removeClass("on").addClass("off");
        }

    }, 1000);

    button.attr('interval', interval);
  });

  /**
   * Stop the fan, If the fan was started automatically, the fan will restart
   * during the next check.
   */
  $('.stop-fan').click(function(e){
    // Send a Stop command
    var button = $(this);
    var which = button.attr('name');
    var sib   = button.siblings("button");
    var li    = button.parentsUntil('ul');

    var running = button.parent().find('.running');

    sendCommand("off", which, 1);
    clearInterval(sib.attr("interval"));
    setCounter(running);

    li.removeClass("on").addClass("off");
    // switch the button to start-fan
    button.attr('disabled', 'disabled').hide();
    sib.removeAttr('disabled').show();
  });

  /**
   * if the fan is not running we should show the 'Run 5Min' button.
   */
  $('.fan:not(.on)').each(function(e){
    $(this).find('.running').text("00:05:00");
    $(this).find(".start-fan").show();
  });

  /**
   * if the fan is running, we have other things to do.
   */
  $('.fan.on').each(function(e){
    var button = $(this).find('button.start-fan');
    var t = $(this).find('.running').attr('time');
    var running = $(this).find('.running');
    var interval = setInterval(function() {
      running.text(toHHMMSS(Math.floor($.now() / 1000) - t));
    }, 1000);

    button.attr('interval', interval);

    $(this).find(".stop-fan").show();
  });

}(jQuery));
