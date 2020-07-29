#! /usr/bin/env bash

trap 'echo trapped; exit' TERM

[[ ! -z "${CID}" ]] && xcid=" ${CID}" || xcid=""
[[ ! -z "${KUBERNETES_NS}" ]] && ns="${KUBERNETES_NS}/" || ns=""

[[ ! -d "/var/run/demo/${ns}" ]] && mkdir -p "/var/run/demo/${ns}"

for x in {1..100}; do

    printf "%s%s" "${x}" "${xcid}"
    printf ": %s %s %s\n" "${ns}" "${HOSTNAME}" "$(date)"

    printf "%s %s\n" "${xcid}" "$(date)" >> "/var/run/demo/${ns}${HOSTNAME}"

    sleep 3 &
    wait $!
done
