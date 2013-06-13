<?php

echo "f_fan:";
system('sudo gpio -g read 17');

echo " b_fan:";
system('sudo gpio -g read 22');

echo  " temp:";
system('sudo python /scripts/web_temp.py');

?>