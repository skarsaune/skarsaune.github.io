#!/bin/bash -x
for file in `ls *.mp3`
do 
OGG_FILE=`echo $file | sed s/mp3/ogg/`
ffmpeg -y -i $file -acodec libvorbis -aq 60 $OGG_FILE 
done
