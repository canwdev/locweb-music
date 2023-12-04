DOCKER_REGISTRY=registry.cn-shenzhen.aliyuncs.com/docv
DOCKER_FROM_TAG=local-web-music:latest
DOCKER_TO_TAG=local-web-music:latest

docker build -t $DOCKER_FROM_TAG .
docker image tag $DOCKER_FROM_TAG $DOCKER_REGISTRY/$DOCKER_TO_TAG
docker image push $DOCKER_REGISTRY/$DOCKER_TO_TAG
