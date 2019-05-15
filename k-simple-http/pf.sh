#! /bin/sh

kubectl port-forward --address 0.0.0.0 svc/counter 8181:8181
