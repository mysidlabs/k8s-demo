#! /usr/bin/env bash

echo ${@}

if [[ "$1" == "server" ]]; then
    socat -u tcp-l:7777,fork system:/stress.sh
    #nc -l -p 7777 -e /stress.sh
else
    stress-ng --metrics --cpu 0 --cpu-load 40 --timeout 10s
fi




