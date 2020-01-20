#!/usr/bin/env bash

nodes=$(kubectl get nodes --output name --selector kubernetes.io/role=node)

for node in ${nodes}; do
  if [ "$1" == "clean" ]; then
    kubectl taint node ${node} mysidlabs.com/month-end-
  else
    kubectl taint node ${node} mysidlabs.com/month-end=true:NoSchedule
  fi
done

