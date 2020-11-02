#!/bin/bash

genload(){
    for i in $(seq 1 "$1"); do
        curl -X GET "$2"
    done
}

t=$1
l=$2
u=$3

for i in $(seq 1 "$t"); do
    echo Starting thread "$i"...
    genload "$l" "$u" &
done

wait