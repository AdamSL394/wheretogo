#!/bin/bash
#sh deploy.sh

echo What version is this ?

read VERSION

docker build ./ -t adamsl394/wheretogo:$VERSION

docker push adamsl394/wheretogo:$VERSION

ssh root@206.189.202.123 "docker pull adamsl394/wheretogo:$VERSION && docker tag adamsl394/wheretogo:$VERSION dokku/api:latest && dokku trace:off && dokku tags:deploy api latest"