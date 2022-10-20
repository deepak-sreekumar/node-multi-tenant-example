#!/bin/bash

REDIS_HOST=redis
REDIS_USERNAME=safe
REDIS_PASSWORD=safe
TENANT_COUNT=20
create() {

    for ((i = 1; i <= "$TENANT_COUNT"; i++)); do
        ## Password is set as deepak000000c14a5aa30c141efcc63v for all tenants
        docker exec "$REDIS_HOST" redis-cli --user "$REDIS_USERNAME" --pass "$REDIS_PASSWORD" acl setuser "tenant$i" on \#4d139d036a63430d01af6d03a626296c2101b80aea33e066539b694c5ffdaee6 ~"tenant$i:*" &* +@all
        echo "added tenant$i"
    done

}



create
