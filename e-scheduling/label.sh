#!/usr/bin/env bash

cpu=(  0   "high"    "low"      "high"     "low"  )
mem=(  0   "large"   "large"    "small"    "tiny" )
disk=( 0   "fast"    "fast"     "slow"     "slow" )

for x in cpu mem disk; do
  a=$x[@]
  v=(${!a})
  for i in {1..4}; do
    if [ "$1" == "clean" ]; then
      kubectl label nodes rock${i} "taranto.dev/${x}-"
    else
      kubectl label nodes rock${i} "taranto.dev/${x}=${v[i]}"
    fi
  done
done



     # kubectl label nodes rock${i} "taranto.dev/${l}-"
