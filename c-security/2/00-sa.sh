#! /bin/bash

oc create serviceaccount z-sa

# alias osa='oc --as system:serviceaccount:${1}:z-sa -n ${1}'
