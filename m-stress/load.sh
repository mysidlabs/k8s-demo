#!/bin/bash

loadit() {
    echo Starting thread "${1}"...
    for j in $(seq 1 "${2}"); do
        echo "... Thread ${1} instance ${j}..."
        curl http://${h}/cgi-bin/stress.sh
    done
    echo "... Finished thread ${1}"
}

h=$(oc get route/stress --template {{.spec.host}})

for i in $(seq 1 "$1"); do
    loadit "$i" "$2" &
done

wait

