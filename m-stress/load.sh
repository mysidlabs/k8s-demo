#!/bin/bash

sleeper() {
    RANDOM=$(date +%s%N | cut -b10-19)
    sleep "0.${RANDOM}"
}

loadit() {
    echo -e "${GREEN}Starting thread ${1}...${RESET}"
    for j in $(seq 1 "${2}"); do
        sleeper
        echo -e "   ${GREEN}Thread ${1} instance ${j}...${RESET}"
        curl http://${h}/cgi-bin/stress.sh
        echo -e "${RESET}"
    done
    echo -e "${RED}Finished thread ${1}${RESET}"
}

RED='\033[00;31m'
GREEN='\033[00;32m'
YELLOW='\033[00;33m'
RESET='\033[0m'

h=$(oc get route/stress --template {{.spec.host}})

for i in $(seq 1 "$1"); do
    loadit "$i" "$2" &
done

wait

