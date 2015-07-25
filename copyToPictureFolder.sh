#! /bin/bash

while true; do
	change=$(inotifywait -e close_write .)
	#echo $change
#./ CLOSE_WRITE,CLOSE downloads.json 
	file=${change#./ CLOSE_WRITE,CLOSE *}
	#change=${change#./ *}
	#echo $change
	echo $file
	copydate=`date +%y%m%d%H%M%s`
	if [ "$file" != "downloads.json" ]; then
		echo $file
		#cp $file /home/pi/PicFolder/${copydate}.jpg
		convert $file -resize "1920x1080>" /home/pi/PicFolder/${copydate}.jpg
	fi
done

