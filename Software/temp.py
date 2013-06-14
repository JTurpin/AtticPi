import os
import glob
import syslog
import logging
from logging.handlers import SysLogHandler
import logging.handlers
import subprocess
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
hostname = " atticpi "
appname = "Attic_Temp[1]:" 

base_dir = '/sys/bus/w1/devices/'

temp0 = 32.0
temp1 = 32.0

def get_Fan_Stats( fangpio ):
        p = subprocess.Popen(["gpio", "-g", "read", str(fangpio)], stdout=subprocess.PIPE)
        fan, err = p.communicate()
#       print "GPIO " + str(fangpio) + " is: " + str(fan)
        return fan;

#print "getting the value for the front fan: " + get_Fan_Stats(17);

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
ts = time.time()
st = datetime.datetime.fromtimestamp(ts).strftime('%m-%d %H:%M:%S')

if temp0 < 95:
        ## Need some sort of check here to make sure that they aren't on a manual run of some sort. We can use a file or unused GPIO as a toggle for manual run
        if  get_Fan_Stats(17) == 1:
                os.system('gpio -g write 17 0') # Turn off the front fan
                LogMe = str(st) + hostname + appname + " Turning the FRONT fan OFF -- Temp = " + str(temp0) 
        if  get_Fan_Stats(22) == 1:
                os.system('gpio -g write 22 0') # Turn off the back fan
                LogMe = str(st) + hostname + appname + " Turning the BACK fan OFF -- Temp = " + str(temp0)

if temp0 > 95 and temp0 < 110:
        if  get_Fan_Stats(17) == 0: # The front fan should always be on in this temp range
                os.system('gpio -g write 17 1') # Turn on the front fan
                LogMe = str(st) + hostname + appname + " Turning the FRONT fan ON -- Temp = " + str(temp0)
        if  get_Fan_Stats(22) == 1: # This would indicate temps are falling unless in manual on mode, again need notify of manual
                os.system('gpio -g write 22 0') # Turn off the back fan (this will be used when temps are falling
                LogMe = str(st) + hostname + appname + " Turning the BACK fan OFF -- Temp = " + str(temp0)

if temp0 > 110:
        if  get_Fan_Stats(17) == 0: # We should always be on when temps are this hot!
                os.system('gpio -g write 17 1') # Turn on the front fan
                LogMe = str(st) + hostname + appname + " Turning the FRONT fan ON -- Temp = " + str(temp0)
        if  get_Fan_Stats(22) == 0: # We should always be on when temps are this hot!
                os.system('gpio -g write 22 1') # Turn on the back fan
                LogMe = str(st) + hostname + appname + " Turning the BACK fan ON -- Temp = " + str(temp0)

print "Temp 0: ", temp0 

LogMe = str(st) + hostname + appname + " The current temp is: " + str(temp0)
my_logger.info(LogMe)