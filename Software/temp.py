import os
import glob
import syslog
import logging
from logging.handlers import SysLogHandler
import logging.handlers
import time
import datetime
from decimal import *
getcontext().prec = 3


###  Lets go ahead and make sure that the system is reeady for gpio
os.system('modprobe w1-gpio')
os.system('modprobe w1-therm')

### And not let's setup some syslog goodness
my_logger = logging.getLogger('MyLogger')
my_logger.setLevel(logging.DEBUG)
my_logger.addHandler(logging.FileHandler("/var/log/fans"))
#my_logger.addHandler(SysLogHandler(address=('192.168.230.5', 514)))


base_dir = '/sys/bus/w1/devices/'

temp0 = 32.0
temp1 = 32.0
#temps = temp0 + temp1

for f in range(1):
        device_folder = glob.glob(base_dir + '28*')[f]
        device_file = device_folder + '/w1_slave'

        def read_temp_raw():
            f = open(device_file, 'r')
            lines = f.readlines()
            f.close()
            return lines

        def read_temp():
            lines = read_temp_raw()
            while lines[0].strip()[-3:] != 'YES':
                time.sleep(0.2)
                lines = read_temp_raw()
            equals_pos = lines[1].find('t=')
            if equals_pos != -1:
                temp_string = lines[1][equals_pos+2:]
                temp_c = round(float(temp_string) / 1000.0, 2)
                temp_f = round(temp_c * 9.0 / 5.0 + 32.0, 2)
                return temp_f

        temp0 = read_temp()

        os.system('gpio -g mode 17 out')
        os.system('gpio -g mode 22 out')

        if temp0 < 95:
                os.system('gpio -g write 17 0') # Turn off the front fan
                os.system('gpio -g write 22 0') # Turn off the back fan

        if temp0 > 95 and temp0 < 110:
                os.system('gpio -g write 17 1') # Turn on the front fan
                os.system('date +%s > .front')  # Add lock file for front fan.
                os.system('gpio -g write 22 0') # Turn off the back fan (this will be used when temps are falling

        if temp0 > 110:
                os.system('gpio -g write 22 1') # Turn on the back fan
                os.system('date +%s > .back')   # Add lock file for back fan

        print "Temp 0: ", temp0 

        ts = time.time()
        st = datetime.datetime.fromtimestamp(ts).strftime('%m-%d %H:%M:%S')

        LogMe = str(st) + " atticpi " + "Attic_Temp[1]:" + " The current temp is: " + str(temp0)
        my_logger.info(LogMe)
