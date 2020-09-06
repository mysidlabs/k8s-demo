#! /usr/bin/env bash

trap 'echo trapped; exit' TERM

odir="/var/run"

[[ ! -z "${KUBERNETES_NS}" ]] && ns="${KUBERNETES_NS}/" || ns=""

[[ ! -d "${odir}/${ns}" ]] && mkdir -p "${odir}/${ns}"

for x in {1..100}; do

    # Don't use tee
    printf "%s %s %s\n" "${ns}" "${HOSTNAME}" "$(date)"
    printf "%s %s %s\n" "${ns}" "${HOSTNAME}" "$(date)" >> ${odir}/${ns}${HOSTNAME}

    sleep 3 &
    wait $!
done
