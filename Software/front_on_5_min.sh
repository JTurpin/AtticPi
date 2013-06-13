#!/bin/sh
gpio -g mode 17 out
gpio -g write 17 1
sleep 5m
gpio -g write 17 0