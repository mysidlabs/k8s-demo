#! /usr/bin/env bash

cd /tmp

declare -a params
saveIFS=$IFS
IFS="/"
params=($QUERY_STRING)
IFS=$saveIFS

timeout="${params[0]:-10}"
load="${params[1]:-40}"
echo "load=${load} timeout=${timeout}"

stress-ng --metrics --cpu 0 --cpu-load ${load} --timeout ${timeout}s 2>&1

