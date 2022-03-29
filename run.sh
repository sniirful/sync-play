#!/bin/bash

DIRNAME=$(dirname "$(readlink -f "$0")")
source $DIRNAME/environment.sh
node $DIRNAME/index "$1"
