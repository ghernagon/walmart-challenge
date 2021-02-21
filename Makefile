database-docker-up:
	docker run -d --rm -e MONGO_INITDB_ROOT_USERNAME=brandDiscountsUser -e MONGO_INITDB_ROOT_PASSWORD=brandDiscountsPassword -p 27017:27017 --name mongodb-local -v "$(shell pwd)/db":/database mongo:3.6.8

database-provision:
	docker exec mongodb-local bash -c './database/import.sh localhost'

database-up:
	make database-docker-up
	make database-provision

database-reset:
	make database-down
	make database-up

database-down:
	docker rm -f mongodb-local

app-docker-build:
	docker build -t walmart-challenge-app ./app

app-docker-up:
	docker run -d -p 3000:3000 --name walmart-challenge-app walmart-challenge-app

app-docker-reset:
	make database-reset
	make app-docker-down

app-docker-down:
	docker rm -f walmart-challenge-app

app-up:
	make database-up
	make app-docker-build
	make app-docker-up