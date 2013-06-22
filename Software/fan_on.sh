#!/bin/sh

FRONT=22;
BACK=17;

if [ -z "$2" ] ; then
  echo "USAGE $0 <front|back> <SECONDS-TO-RUN>"
  exit;
fi

FAN=''
SECONDS=${2}

if [ ${1} == 'front' ] ; then
  FAN=$FRONT
  FILE=".front"
elif [ ${1} == 'back' ] ; then
  FAN=$BACK
  FILE=".back"
fi

if [ -z "$FAN" ] ; then
  echo 'ERROR: FAN MUST BE front OR back'
  exit;
fi

if [ -a $FILE ] ; then
  echo "${1} is already running. exiting"
  exit;
fi
TIME=date +%s

#gpio -g mode $FAN out
#gpio -g mode $FAN out
#gpio -g write $FAN 1
"${TIME}|m" > $FILE
sleep ${SECONDS}s
#gpio -g write $FAN 0
rm $FILE
