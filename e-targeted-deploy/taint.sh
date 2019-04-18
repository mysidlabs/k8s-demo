#!/usr/bin/env bash

if [ "$1" == "clean" ]; then
  for i in {1..4}; do
    for l in cpu disk mem; do
      kubectl label nodes rock${i} "taranto.dev/${l}-"
    done
  done
else 
  for i in {1..4}; do
    kubectl taint  nodes rock${i} taranto.dev/month-end=true:NoSchedule
  done
fi
