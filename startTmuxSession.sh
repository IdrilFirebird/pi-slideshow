#! /bin/sh

flashIP1=192.168.178.31
flashIP2=192.168.178.26
flashIP3=192.168.178.23

flashFolder1=/DCIM/102VIVE_
flashFolder2=/DCIM/101D5100
flashFolder3=/DCIM/102D3100

tmux new-session -d -s picCopy 
tmux send-keys 'cd /home/pi/flash1' 'C-m' "/home/pi/scripts/startPhantom.sh $flashIP1 $flashFolder1" 'C-m'
tmux select-window -t picCopy:0
tmux split-window -v 
tmux send-keys 'cd /home/pi/flash2' 'C-m' "/home/pi/scripts/startPhantom.sh $flashIP2 $flashFolder2" 'C-m'
tmux split-window -v 
tmux send-keys 'cd /home/pi/flash3' 'C-m' "/home/pi/scripts/startPhantom.sh $flashIP3 $flashFolder3" 'C-m'
tmux split-window -h -t 0
tmux send-keys 'cd /home/pi/flash1' 'C-m' "/home/pi/scripts/copyToPictureFolder.sh" 'C-m'
tmux split-window -h -t 1
tmux send-keys 'cd /home/pi/flash2' 'C-m' "/home/pi/scripts/copyToPictureFolder.sh" 'C-m'
tmux split-window -h -t 2
tmux send-keys 'cd /home/pi/flash3' 'C-m' "/home/pi/scripts/copyToPictureFolder.sh" 'C-m'
#tmux select-layout tiled

tmux -2 attach-session -t picCopy
