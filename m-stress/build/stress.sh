#! /bin/bash

cd /tmp

n=$(nproc)
h=$(( $(nproc)/2 ))
w=$(seq ${h} ${n} | sort -R | head -n 1)
t=$(seq 4 10 | sort -R | head -n 1)

echo "--- Runtime ---"
echo n=$n
echo h=$h
echo w=$w
echo t=$t

stress-ng --times --wcs ${w} --timeout ${t}s 2>&1
