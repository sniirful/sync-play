#!/bin/bash

sudo echo -n ""

DIRNAME=$(dirname "$(readlink -f "$0")")
source $DIRNAME/environment.sh

wget -O $NODE_FILE_FULL_NAME "https://nodejs.org/dist/$VERSION/$NODE_FILE_FULL_NAME"

sudo mkdir -p $NODE_DEST_FOLDER
sudo tar -xJvf $NODE_FILE_FULL_NAME -C $NODE_DEST_FOLDER
rm $NODE_FILE_FULL_NAME

cd $DIRNAME && npm install

sudo ln -s $SRC_FILE $DEST_FILE

echo "Installation complete."
