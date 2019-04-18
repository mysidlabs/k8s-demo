#!/usr/bin/env bash

if [ "$1" == "clean" ]; then
  for i in {1..4}; do
    for l in cpu disk mem; do
      kubectl label nodes rock${i} "taranto.dev/${l}-"
    done
  done
else 
  for i in 1 3; do
    kubectl label nodes rock${i} taranto.dev/cpu=high
  done

  for i in 1 4; do
    kubectl label nodes rock${i} taranto.dev/disk=ssd
  done
  kubectl label nodes rock3 taranto.dev/disk=slow


  for i in 2 3; do
    kubectl label nodes rock${i} taranto.dev/mem=64
  done
fi
