<?php
echo  "The attic temperature is: ";
$temp =  system('sudo python /scripts/web_temp.py');
echo "<br><br>";
echo "The front fan is: ";
$f_fan = exec('sudo gpio -g read 17');

if ($f_fan = 1)
  echo "ON";
if ($f_fan = 0)
  echo "OFF";

echo "<br><br>";
echo "The back fan is: ";
$b_fan = exec('sudo gpio -g read 22');

if ($b_fan == 1)
  echo "ON";
if ($b_fan ==0)
  echo "OFF";
?>