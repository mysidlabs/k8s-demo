#!/usr/bin/env bash

nodes=$(kubectl get nodes --output name --selector kubernetes.io/role=node)

for node in ${nodes}; do
  if [ "$1" == "clean" ]; then
    kubectl taint node ${node} taranto.dev/month-end-
  else
    kubectl taint node ${node} taranto.dev/month-end=true:NoSchedule
  fi
done

