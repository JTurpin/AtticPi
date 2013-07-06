#!/bin/sh

FRONT=17;
BACK=22;

if [ -z "$1" ] ; then
  echo "USAGE $0 <front|back> [force]"
  exit;
fi

FAN=''

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

if [ ! -a "$FILE" ] &&  [ -z "$2" ] ; then
  echo "${1} is not running. exiting"
  exit;
fi

gpio -g mode $FAN out
gpio -g write $FAN 0
rm $FILE
