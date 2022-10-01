#!/bin/bash
# for i in {1..2}; do
#     database="safe_tenant$i"

#     docker exec -it mysql mysql -u root -proot -e "CREATE DATABASE IF NOT EXISTS $database;"

#     docker exec -it mysql mysql -u root -proot -e "USE $database; CREATE TABLE users (id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, email varchar(500) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=latin1;"

#     docker exec -it mysql mysql -u root -proot -e "USE $database; INSERT INTO users (id, email) VALUES (1, '$(echo $RANDOM | md5sum | head -c 5)@tent$i.com'),(2, '$(echo $RANDOM | md5sum | head -c 5)@tent$i.com'),(3, '$(echo $RANDOM | md5sum | head -c 5)@tent$i.com'),(4, '$(echo $RANDOM | md5sum | head -c 5)@tent$i.com'),(5, '$(echo $RANDOM | md5sum | head -c 5)@tent$i.com'),(6, '$(echo $RANDOM | md5sum | head -c 5)@tent$i.com'),(7, '$(echo $RANDOM | md5sum | head -c 5)@tent$i.com'),(8, '$(echo $RANDOM | md5sum | head -c 5)@tent$i.com'),(9, '$(echo $RANDOM | md5sum | head -c 5)@tent$i.com'),(10, '$(echo $RANDOM | md5sum | head -c 5)@tent$i.com');"

    

# done


#!/bin/bash
# for i in {1..2}; do
#     database="safe_tenant$i"

#     docker exec -it mysql mysql -u root -proot -e "USE $database; CREATE TABLE user_assets (id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, user_id int(11), asset_name varchar(500) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=latin1;"
#     docker exec -it mysql mysql -u root -proot -e "USE $database; ALTER TABLE user_assets ADD FOREIGN KEY (user_id) REFERENCES users (id)"
#     docker exec -it mysql mysql -u root -proot -e "USE $database; INSERT INTO user_assets (user_id, asset_name) VALUES (1, '$(echo $RANDOM | md5sum | head -c 5)-asset'),(1, '$(echo $RANDOM | md5sum | head -c 5)-asset'),(2, '$(echo $RANDOM | md5sum | head -c 5)-asset'),(2, '$(echo $RANDOM | md5sum | head -c 5)-asset');"

    

# done


for i in {1..2}; do
    database="safe_tenant$i"

    docker exec -it mysql mysql -u root -proot -e "USE $database; CREATE TABLE tasks (id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, user_id int(11), task varchar(500) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=latin1;"
    docker exec -it mysql mysql -u root -proot -e "USE $database; ALTER TABLE tasks ADD FOREIGN KEY (user_id) REFERENCES users (id)"
    docker exec -it mysql mysql -u root -proot -e "USE $database; INSERT INTO tasks (user_id, task) VALUES (1, '$(echo $RANDOM | md5sum | head -c 5)-task'),(1, '$(echo $RANDOM | md5sum | head -c 5)-task'),(2, '$(echo $RANDOM | md5sum | head -c 5)-task'),(2, '$(echo $RANDOM | md5sum | head -c 5)-task');"

    

done