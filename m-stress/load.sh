#!/bin/bash

loadit() {
    echo "Starting thread ${1}..."
    for j in $(seq 1 "${COUNT}"); do
        [[ -f ${KILLER} ]] && echo "Draining ${1}..." && return
        echo "Thread ${1} instance ${j}..."
        curl http://${HOST}/cgi-bin/stress.sh?${TIME}/${LOAD}/${SLEEP}/${QUIET}
    done
    echo "Finished thread ${1}"
}

gethost() {
    # Look for ingress first since it's available on all distros and
    # will fail much faster on OCP if an instance is not found and
    # a route is being used.
    local h=$(oc get ingress/stress -o 'jsonpath={.spec.rules[0].host}' 2> /dev/null)
    if [[ "${h}" == "" ]]; then
        h=$(oc get route/stress -o 'jsonpath={.spec.host}')
        if [[ "${h}" == "" ]]; then
            h=localhost
        fi
    fi
    echo "${h}"
}

KILLER=./killer
[[ -f "${KILLER}" ]] && rm ${KILLER}

while [[ $# -gt 0 ]]; do
    k="${1}"
    case ${k} in
        -h|--host)
            HOST="${2}"
            shift
            shift
            ;;
        -c|--count)
            COUNT="${2}"
            shift
            shift
            ;;
        -l|--load)
            LOAD="${2}"
            shift
            shift
            ;;
        -q|--quiet)
            QUIET="--quiet"
            shift
            ;;
        -s|--sleep)
            SLEEP="${2}"
            shift
            shift
            ;;
        --stop)
            touch ${KILLER}
            exit
            ;;
        -t|--thread)
            THREAD="${2}"
            shift
            shift
            ;;
        -x|--time)
            TIME="${2}"
            shift
            shift
            ;;
        @long)
            COUNT=16
            LOAD=66
            THREAD=8
            TIME=10
            shift
            ;;
        @short)
            COUNT=8
            LOAD=66
            THREAD=4
            TIME=10
            shift
            ;;
        @test)
            COUNT=1
            LOAD=1
            THREAD=1
            TIME=1
            shift
            ;;
        @genghis)
            COUNT=64
            LOAD=66
            THREAD=8
            TIME=10
            shift
            ;;
        *)
            echo "Unknown argument: $0 $*"
            exit 1
    esac
done

COUNT=${COUNT:-10}
HOST=${HOST:-$(gethost)}
THREAD=${THREAD:-5}
LOAD=${LOAD:-40}
QUIET=${QUIET:-"--metrics"}
SLEEP=${SLEEP:-0}
TIME=${TIME:-10}

if (( ${TIME} >= 30 )); then
    echo "Excessive --time will cause gateway timeout errors."
    exit 1
fi

echo "Stressing ${HOST}..."

for i in $(seq 1 "${THREAD}"); do
    loadit "$i" &
done

wait

[[ -f ${KILLER} ]] && rm ${KILLER}

