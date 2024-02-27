#!/bin/bash

ROOT_PATH="/home/ubuntu/notionapi"

CONTAINER="notionapi_container"
IMAGE="notionapi_image"

NETWORK="custom-network"

docker build -t "$IMAGE" "$ROOT_PATH"
docker run -dp 3000:3000 --name "$CONTAINER" "$IMAGE"
docker network connect "$NETWORK" "$CONTAINER"