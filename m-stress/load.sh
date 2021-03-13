#!/bin/bash

genload(){
    for j in $(seq 1 "$1"); do
        echo i=$3
        echo j=$j
        curl --request GET "http://${2}/cgi-bin/stress.sh"
        #sleep .5
    done
}

t=$1
l=$2
h=$(oc get route/stress --template {{.spec.host}})

for i in $(seq 1 "$t"); do
    echo Starting thread "$i"...
    genload "$l" "$h" "$i" &
done

wait
