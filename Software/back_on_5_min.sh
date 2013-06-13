#!/bin/sh
gpio -g mode 22 out
gpio -g write 22 1
sleep 5m
gpio -g write 2 0