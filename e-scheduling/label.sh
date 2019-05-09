#!/usr/bin/env bash

cpu=(  0   "high"    "low"      "high"     "low"  )
mem=(  0   "large"   "large"    "small"    "tiny" )
disk=( 0   "fast"    "fast"     "slow"     "slow" )

nodes=$(kubectl get nodes --output name --selector kubernetes.io/role=node)

for x in cpu mem disk; do
  a=$x[@]
  v=(${!a})
  i=1
  for node in ${nodes}; do
    if [ "$1" == "clean" ]; then
      kubectl label ${node} "taranto.dev/${x}-"
    else
      echo ${node}
      kubectl label ${node} "taranto.dev/${x}=${v[i]}"
    fi
    ((i++))
  done
done



     # kubectl label nodes rock${i} "taranto.dev/${l}-"
