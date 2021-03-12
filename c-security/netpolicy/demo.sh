#!/bin/bash

case "$1" in
    up)
        oc new-project $(whoami)-dev  --skip-config-write
        oc new-project $(whoami)-test --skip-config-write
esac
