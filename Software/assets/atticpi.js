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


  var colorizeTemp = function (f) {

    var temp = f.html();

    if ( temp > th1 && temp < th2 ) {
      f.addClass('temp-med');
    }
    else if ( temp > th2 ) {
      f.addClass('temp-hot');
    }
    
  }
  $('.temp').each(function(e) {
    colorizeTemp($(this)); 
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

  var sendCommand = function(command,which_fan, parameter) {
    $.ajax({
      type: "POST",
      url: "index.php",
      data: { fan:which_fan, cmd:command, param: parameter}
    }).done(function( msg ) {
      //alert( "Passed back: " + msg)
    });
  }


  $('.start-fan').click(function(e){
    // send a call back to the server to start the fan
    var command = "on";   
    var which = $(this).attr('name');
    var timer = 5;

    sendCommand(command, which, timer);
    //console.log(which);
    // switch the button to stop-fan
    var button = $(this);
    var sib = $(this).siblings("button");
    button.attr('disabled', 'disabled').hide();
    sib.removeAttr('disabled').show();
      
    // start the count-down timer.
    var running = $(this).parent().find('.running');
    //var li = $(this).parent().find('li');
    var li = $(this).parentsUntil('ul');
    //console.log(li);
    li.removeClass("off").addClass("on");

    var interval = setInterval(function() {
        timer--; 
        setCounter(running, timer);
        if (timer == 0) {
          // set the button back
          clearInterval(button.attr("interval"));
          sib.hide();
          button.removeAttr('disabled').show();
          setCounter(running);
          li.removeClass("on").addClass("off");
        }

    }, 1000);
    button.attr('interval', interval);
  });

  $('.stop-fan').click(function(e){

    // Send a Stop command
    var command = "off";   
    var which = $(this).attr('name');
    var force = 5;

    var li = $(this).parentsUntil('ul');
    li.removeClass("on").addClass("off");
    sendCommand(command, which, force);
    // switch the button to start-fan
    var button = $(this);
    var sib = $(this).siblings("button");
    button.attr('disabled', 'disabled').hide();
    clearInterval(sib.attr("interval"));
    sib.removeAttr('disabled').show();
    var running = $(this).parent().find('.running');
    setCounter(running);
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
    var t = $(this).find('.running').attr('time');
    var running = $(this).find('.running');
    setInterval(function() {
      running.text(toHHMMSS(Math.floor($.now() / 1000) - t));
    }, 1000);

    $(this).find(".stop-fan").show();
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
