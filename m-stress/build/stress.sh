#! /usr/bin/env bash

cd /tmp

stress-ng --metrics --cpu 0 --cpu-load 40 --timeout 10s 2>&1

