

docker build -t peterpimley/bookings-api:latest api


echo $DOCKER_HUB_PAT | docker login --password-stdin -u peterpimley

docker push peterpimley/bookings-api:latest
