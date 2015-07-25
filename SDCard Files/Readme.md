# Raspi live Slideshow

I've build a little live slide show with the Raspberry PI.
It grabs photos from the cameras and shows them with the RaspPi
Using pqiv for the picture showing part and a little shell script for updating the Pictures from Wifi SD-Cards. I used the FlashAir Cards from Toshiba.

## pqiv
So first thing you need is to get the latest version of pqiv from Github.
https://github.com/phillipberndt/pqiv
make sure you have the dependencies installt first. You'll need 
* gtk+ 3.0 or gtk+ 2.6
* gdk-pixbuf 2.2 (included in gtk+)
* glib 2.6
* cairo 1.6
* gio 2.0
* gdk 2.8 

You can add auto login to the PI. For that edit the /etc/inittab file.

```shell
sudo vi /etc/inittab
```

find the folling line and replace it

```shell
#1:2345:respawn:/sbin/getty --noclear 38400 tty1
1:2345:respawn:/bin/login -f pi tty1 </dev/tty1 >/dev/tty1 2>&1
```

## Slideshow autostart
Go to /etc/xdg/autostart and add the following file
```shell
cd /etc/xdg/autostart
sudo vi slideshow_start.desktop
```
Add the following to the file
```shell
[Desktop Entry]
Type=Application
Name=Slideshow Image Changer
Comment=Slideshow Image Changer
Exec=/home/pi/scripts/start_slideshow.sh # or whereever you put the script files
Terminal=true
```

## Prevent Raspberry Pi from sleep
to prevent the Pi from going to sleep update the folloing file
```shell
sudo vi /etc/kbd/config

#BLANK_TIME=30
BLANK_TIME=0

#POWERDOWN_TIME=30
POWERDOWN_TIME=0
```

Save and close the file.

And edit the ligthdm config file
```shell
sudo vi /etc/lightdm/lightdm.conf

xserver-command=X -s 0 dpms
```

## Add PhantomJS to the pi
I use phantomjs to pull the files from the SD Cards. 
You can get a compiled Version for the pi on 
https://github.com/spfaffly/phantomjs-linux-armv6l
If you like to compile it yourself you also find a description for that on this repo. 
But bring some time. 

## Prepare the SDCards
A little HTML server is running on the FlashAir Cards. That helps us to get a list of all the images we like to pull from the cards. 
Just add all the files from the "SDCard Files" Folder to the SD_WLAN directory on the Toshiba FlashAir.

The JavaScripts creats with each GET request on the card a list of all JPG/PNG files and adds them to an array. 

Make sure your camera is saving JPG files to the card. 

The cards is used in APPMODE=5, which means it will connect as simple client to a WIFI Access Point. In the CONFIG file you have to add your Wifi SSID and Key to which the cards should connect itself.

## Run the scripts
I've put the scripts in the PI home folder in the scripts folder. So all paths are pointing there. Feel free to change that but make sure you change all the pahts. 

I had 3 SD cards in use so the "startTmuxSession.sh" script is configured for that. You can specify the three IP-Addresses of the FlashAir Cards and the folder on them where the script should look for pictures. 
You need to create folders for each SD Card on the PI where the script can put the Pictures. The "download.js" file keeps track on the allready downloaded files. 
The second part in the Tmux file is starting the "copyToPictureFolder.sh". This script just copies the pics to the folder where pqiv is looking for the slideshow files. 
The convert part in this script only works if you have imagemagick installed. 

## What's next
My FlashAir Cards are Version 2. Toshiba introduced the next Version latley. On many new feature is LUA scripting on the card. That would be nice becaus it enables to push each new file to the PI. 
With the pulling mechaning in use now I've have encounterd the problem that the camera goes to sleep before the transfer to the PI is finised. 