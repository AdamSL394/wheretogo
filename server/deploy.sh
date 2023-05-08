#!/bin/bash

echo hello

read VERSION

docker build -t adamsl/wheretogo:$VERSION

docker push adamsl/wheretogo:$VERSION

ssh -v root@206.189.202.123