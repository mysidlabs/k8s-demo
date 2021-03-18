#!/bin/bash

loadit() {
    echo "Starting thread ${1}..."
    for j in $(seq 1 "${COUNT}"); do
        [[ -f ${KILLER} ]] && echo "Draining ${1}..." && return
        echo "   Thread ${1} instance ${j}..."
        curl http://${HOST}/cgi-bin/stress.sh?${TIME}/${LOAD}/${SLEEP}
    done
    echo "Finished thread ${1}"
}

KILLER=./killer
[[ -f "${KILLER}" ]] && rm ${KILLER}

while [[ $# -gt 0 ]]; do
    k="${1}"
    case ${k} in
        --stop)
            touch ${KILLER}
            exit
            ;;
        -h|--host)
            HOST="${2}"
            shift
            shift
            ;;
        -i|--iter)
            ITER="${2}"
            shift
            shift
            ;;
        -c|--count)
            COUNT="${2}"
            shift
            shift
            ;;
        -t|--time)
            TIME="${2}"
            shift
            shift
            ;;
        -l|--load)
            LOAD="${2}"
            shift
            shift
            ;;
        -s|--sleep)
            SLEEP="${2}"
            shift
            shift
            ;;
        *)
            echo "Unknown argument: $0 $*"
            exit 1
    esac
done

COUNT=${COUNT:-10}
HOST=${HOST:-$(oc get route/stress --template "{{.spec.host}}")}
ITER=${ITER:-5}
LOAD=${LOAD:-40}
SLEEP=${SLEEP:-0}
TIME=${TIME:-10}

for i in $(seq 1 "${ITER}"); do
    loadit "$i" &
done

wait

[[ -f ${KILLER} ]] && rm ${KILLER}

