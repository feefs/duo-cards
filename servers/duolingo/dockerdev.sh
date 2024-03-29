#!/bin/bash -e

docker build -t duolingo_dev .
docker run \
  --rm \
  -v "$PWD/src:/code/src" \
  -p 5000:80 \
  --name duolingo_dev_container \
  duolingo_dev
