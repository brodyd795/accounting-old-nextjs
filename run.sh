#!/bin/bash

cd "$(dirname "$0")"
port=`grep 'PORT' .env | awk -F'[=]' '{print $2}'`
npx next start -p $port
