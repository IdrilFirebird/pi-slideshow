#!/bin/bash

#export XAUTHORITY=/home/pi/.Xauthority
export DISPlAY=:0

#Lets start and restart the slideshow if needed
#until /usr/bin/pqiv -i -f -s  -t /home/pi/slideshow; do
#until /usr/bin/pqiv -i -f -s  --disable-scaling /home/pi/slideshow; do
#until /usr/bin/pqiv -i -f --watch-directories -s -t --slideshow-interval=2 /home/pi/images3/; do
until /usr/bin/pqiv -i -f --watch-directories -s -t --slideshow-interval=2 /home/pi/PicFolder/; do
	echo "Slideshow crashed with exit code $?. Restarting..." >&2
	sleep 2
done

