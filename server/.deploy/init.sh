#!/bin/bash
docker pull registry.cn-shenzhen.aliyuncs.com/docv/locweb-music:latest

docker rm -f locweb
docker run --restart=always --name locweb \
    -p 12021:12021 \
    -v /volume1/music:/app/data \
    -v $PWD/config.json:/app/config/config.json \
    -d registry.cn-shenzhen.aliyuncs.com/docv/locweb-music