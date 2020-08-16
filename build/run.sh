#! /usr/bin/env bash

trap 'echo trapped; exit' TERM

[[ ! -z "${KUBERNETES_NS}" ]] && ns="${KUBERNETES_NS}/" || ns=""

[[ ! -d "/tmp/${ns}" ]] && mkdir -p "/tmp/${ns}"

for x in {1..100}; do

    # Don't use tee
    printf "%s%s %s\n" "${ns}" "${HOSTNAME}" "$(date)"
    printf "%s%s %s\n" "${ns}" "${HOSTNAME}" "$(date)" >> /tmp/${ns}${HOSTNAME}

    sleep 3 &
    wait $!
done
