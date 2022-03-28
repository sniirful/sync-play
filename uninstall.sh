#!/bin/bash

source environment.sh

rm -rf $NODE_MODULES_FOLDER
sudo rm -rf $NODE_DEST_FOLDER
sudo rm $DEST_FILE

echo "Removal complete."
