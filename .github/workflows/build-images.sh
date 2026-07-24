set -e

docker build -t peterpimley/bookings-api:latest api
docker build -t peterpimley/bookings-frontend:latest frontend


echo $DOCKER_HUB_PAT | docker login --password-stdin -u peterpimley

docker push peterpimley/bookings-api:latest
docker push peterpimley/bookings-frontend:latest
