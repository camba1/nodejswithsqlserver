# Connecting to nodejs container to an existing SQL Server container

## Using the Dockrefile

To connect to an existing SQL Server container that is already running from  a new nodejs container:

- build the nodejs container from the folder containing the DockerFile: `docker build -t nodeforsqlserver .`
- Run the container: `docker run -p 3000:3000 --name mynode nodeforsqlserver`
- Create a network that both containers can join (if one does not exist already): docker network create mynodenetwork
- Join the network:
  - nodejs container: `docker network connect mynodenetwork mynode`
  - sql container: `docker network connect mynodenetwork sql1`
- At this point you should be able to ping the containers by name from inside the containers: `ping sql1`
- Connect the nodejs code to the DB using the container name and the appropriate host: ex: host: sql1 port 1433

## Using docker compose

To connect to an existing SQL Server container that is already running from  a new nodejs container:

- Start the nodejs container from the folder containing the docker-compose.yml: `docker-compose up`
- Docker compose creates its own network with the nodejs container in it, so no need to create one
- Determine the name of the network that was automatically created: `docker network ls`
- Sql container joins the network:
  - `docker network connect <networkname> sql1`
- At this point you should be able to ping the containers by name from inside the containers: `ping sql1`
- Connect the nodejs code to the DB using the container name and the appropriate host: ex: host: sql1 port 1433

## Disconnecting from the network

If you created a temporary network manually that you will not use in the future, you must diconnect the containers before removing the network. Otherwise the next time you start the container, it will try to attach to the network and throw an error.

- Check which containers are attached to a network: `docker network inspect <networkname>`
- Disconnect the container: `docker network disconnect <networkname> <containerName>`
- Remove network: `docker network rm <networkname>`
