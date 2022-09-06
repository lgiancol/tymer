#!/bin/bash

services="firestore"

while getopts s: flag
do
    case "${flag}" in
        s) services=${OPTARG};;
    esac
done

echo "== Starting firestore emulator [${services}]"

firebase emulators:start --only $services --import=./data