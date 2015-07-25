#!/bin/bash
#start and watch the phantom file download script


until phantomjs /home/pi/scripts/checkSDCardData.js $1 $2; do 
    echo "Phantom exited after not beeing able to download file with code $?. Restarting..." >&2
    sleep 30
done
