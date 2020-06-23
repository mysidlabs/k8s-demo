#! /bin/bash

sa=c-sa
oc create serviceaccount ${sa}

ns=$(kubectl config view --minify --output 'jsonpath={..namespace}')
echo alias osa=\'oc --as system:serviceaccount:${ns}:${sa} -n ${ns}\'
