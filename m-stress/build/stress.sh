#! /bin/bash

cd /tmp

n=$(nproc)
h=$(( $(nproc)/2 ))
w=$(seq ${h} ${n} | sort -R | head -n 1)
t=$(seq 4 10 | sort -R | head -n 1)

stress-ng --times --wcs ${w} --timeout ${t}s 2>&1
