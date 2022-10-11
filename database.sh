#!/bin/bash

DB_HOST=mysql
DB_USERNAME=root
DB_PASSWORD=root
TENANT_COUNT=20
create() {

    for ((i = 1; i <= "$TENANT_COUNT"; i++)); do
        database="safe_tenant$i"
        docker exec -it mysql mysql -h "$DB_HOST" -u "$DB_USERNAME" -p"$DB_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS $database;"
        docker exec -it mysql mysql -h "$DB_HOST" -u "$DB_USERNAME" -p"$DB_PASSWORD" -e "USE $database; CREATE TABLE users (id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, email varchar(500) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=latin1;"
        # docker exec -it mysql mysql -h "$DB_HOST" -u "$DB_USERNAME" -p"$DB_PASSWORD" -e "USE $database; INSERT INTO users (id, email) VALUES (1, '$(echo $RANDOM | md5sum | head -c 5)@tent$i.com'),(2, '$(echo $RANDOM | md5sum | head -c 5)@tent$i.com'),(3, '$(echo $RANDOM | md5sum | head -c 5)@tent$i.com'),(4, '$(echo $RANDOM | md5sum | head -c 5)@tent$i.com'),(5, '$(echo $RANDOM | md5sum | head -c 5)@tent$i.com'),(6, '$(echo $RANDOM | md5sum | head -c 5)@tent$i.com'),(7, '$(echo $RANDOM | md5sum | head -c 5)@tent$i.com'),(8, '$(echo $RANDOM | md5sum | head -c 5)@tent$i.com'),(9, '$(echo $RANDOM | md5sum | head -c 5)@tent$i.com'),(10, '$(echo $RANDOM | md5sum | head -c 5)@tent$i.com');"
        docker exec -it mysql mysql -h "$DB_HOST" -u "$DB_USERNAME" -p"$DB_PASSWORD" -e "USE $database; CREATE TABLE tasks ( id int NOT NULL AUTO_INCREMENT, userId int NOT NULL, task VARCHAR(500), PRIMARY KEY (id), FOREIGN KEY (userId) REFERENCES users(id) );"
        # docker exec -it mysql mysql -h "$DB_HOST" -u "$DB_USERNAME" -p"$DB_PASSWORD" -e "USE $database; INSERT INTO tasks (id, userId, task) VALUES (1, 1, '$(echo $RANDOM | md5sum | head -c 10)'),(2,2, '$(echo $RANDOM | md5sum | head -c 10)'),(3,3, '$(echo $RANDOM | md5sum | head -c 10)'),(4,4, '$(echo $RANDOM | md5sum | head -c 10)'),(5,5, '$(echo $RANDOM | md5sum | head -c 10)'),(6,6, '$(echo $RANDOM | md5sum | head -c 10)'),(7,7, '$(echo $RANDOM | md5sum | head -c 10)'),(8,8, '$(echo $RANDOM | md5sum | head -c 10)'),(9,9, '$(echo $RANDOM | md5sum | head -c 10)'),(10,10, '$(echo $RANDOM | md5sum | head -c 10)');"
    done

}

drop() {
     for ((i = 1; i <= "$TENANT_COUNT"; i++)); do
        database="safe_tenant$i"
        docker exec -i mysql mysql -h "$DB_HOST" -u "$DB_USERNAME" -p"$DB_PASSWORD" -e "DROP DATABASE IF EXISTS $database"

    done

}

if [ "$1" == "create" ]; then
    create
    exit
elif [ "$1" == "drop" ]; then
    drop
    exit
fi
