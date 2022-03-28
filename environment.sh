#!/bin/bash

VERSION=v16.14.0
DISTRO=linux-x64

DIRNAME=$(dirname "$(readlink -f "$0")")
NODE_FILE_NAME=node-$VERSION-$DISTRO
NODE_FILE_FULL_NAME=$NODE_FILE_NAME.tar.xz
NODE_DEST_FOLDER=$DIRNAME/node
NODE_MODULES_FOLDER=$DIRNAME/node_modules

SRC_FILE=$DIRNAME/run.sh
DEST_FILE=/usr/bin/sync-play

export PATH=$NODE_DEST_FOLDER/$NODE_FILE_NAME/bin:$PATH
