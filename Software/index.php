<?php

$temp = rand(90, 115);
$thresh1 = 95;
$thresh2 = 110;
$f_fan = ($temp > $thresh1);
$b_fan = ($temp > $thresh2);

/**
$temp = system('sudo python /scripts/web_temp.py');
$f_fan = exec('sudo gpio -g read 17');
$b_fan = exec('sudo gpio -g read 22');
**/

$front_state = ($f_fan == TRUE) ? 'on' : 'off';
$back_state = ($b_fan == TRUE) ? 'on' : 'off';

?>
<html>
<head>
  <!-- standard viewport tag to set the viewport to the device's width
  , Android 2.3 devices need this so 100% width works properly and
  doesn't allow children to blow up the viewport width-->
<meta name="viewport" id="vp" content="initial-scale=1.0,user-scalable=no,maximum-scale=1,width=device-width" />
<!-- width=device-width causes the iPhone 5 to letterbox the app, so
  we want to exclude it for iPhone 5 to allow full screen apps -->
<meta name="viewport" id="vp" content="initial-scale=1.0,user-scalable=no,maximum-scale=1" media="(device-height: 568px)" />
<!-- provide the splash screens for iPhone 5 and previous -->
<link href="assets/splashs/splash_1096.png" rel="apple-touch-startup-image" media="(device-height: 568px)">
<link href="assets/splashs/splash_iphone_2x.png" rel="apple-touch-startup-image" sizes="640x960" media="(device-height: 480px)">

  <script src="assets/jquery.min.js?v=1"></script>
  <link rel="stylesheet" href="assets/style.css?v=1">
</head>
<body>
<div id="main">
  <div id="stats">
    <span id="temp"><?php print $temp; ?></span><span id="temp-scale">F</span>
  </div>

  <div id="fans">
    <ul>
    <li class="fan <?php print $front_state; ?>">
      <h2 class="fan-label">Front Fan</h2>
      <div class="fan-stats">
        <span class="auto-manual auto">Automatic</span>
        <span time="1234567890" class="running long">02:30:45</span>
        <button class="stop-fan">Stop Fan</button>
      </div>
      <!--<canvas class="timer-canvas" id="back-fan-button" width="300" height="300">-->
    </li> 

    <li class="fan <?php print $back_state; ?>">
      <h2 class="fan-label">Back Fan</h2>
      <div class="fan-stats">
        <span class="auto-manual manual">Manual</span>
        <span time="1234567890" class="running short">05:00</span>
        <button class="start-fan">Run 5min</button>
      </div>
      <!--<canvas class="timer-canvas" id="front-fan-button" width="300" height="300">-->
    </li> 
    </ul>
  </div>
  
</div> 
<script>
  
</script>
  <script src="assets/atticpi.js?v=1"></script>
</body>
</html>
