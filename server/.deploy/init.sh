#!/bin/bash
docker pull registry.cn-shenzhen.aliyuncs.com/docv/local-web-music:latest

docker rm -f local-web
docker run --restart=always --name local-web \
    -p 12021:12021 \
    -v /volume1/music:/app/data \
    -v $PWD/config.json:/app/config/config.json \
    -d registry.cn-shenzhen.aliyuncs.com/docv/local-web-music
