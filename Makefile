
dev: init-env dev-up logs

init-env:
	touch .env

dev-up:
	docker-compose up --build -d dev-server

down:
	docker-compose down

logs:
	docker-compose logs -f

restart:
	docker-compose restart

stop:
	docker-compose stop

build: init-env
	docker-compose up --build prod-builder
	docker build -t rpgtools -f src/server/Dockerfile .

prod: build
	docker-compose up --build prod-server

publish:
	docker login -u="${DOCKER_USERNAME}" -p="${DOCKER_PASSWORD}"
	docker tag rpgtools ${DOCKER_USERNAME}/rpgtools
	docker push ${DOCKER_USERNAME}/rpgtools

install:
	sudo apt update
	sudo apt install mongodb
	sudo mkdir /etc/rpgtools
	sudo cp example.env /etc/rpgtools/.env
	sudo cp rpgtools.service /lib/systemd/system
	sudo systemd daemon-reload
	sudo systemd start rpgtools
	echo rpgtools is now available
