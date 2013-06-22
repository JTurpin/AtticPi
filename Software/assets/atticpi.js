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




}(jQuery));
