#! /usr/bin/env bash

cd /tmp

declare -a params
saveIFS=$IFS
IFS="/"
params=($QUERY_STRING)
IFS=$saveIFS

timeout="${params[0]:-10}"
load="${params[1]:-40}"
sleep="${params[2]:-0}"
quiet="${params[3]:-'--metrics'}"

[[ ! -z "${NODE}" ]] && echo "Stressing node ${NODE}/$(hostname)..."

if [[ "${sleep}" != "0" ]]; then
    s=$(( ( RANDOM % ${sleep} ) + 1 ))
    echo "Sleeping ${s}..."
    sleep ${s}s
fi

stress-ng ${quiet} --cpu 0 --cpu-load ${load} --timeout ${timeout}s 2>&1

