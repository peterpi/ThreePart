set -e

docker build -t peterpimley/bookings-db:$GITHUB_REF_NAME db
docker build -t peterpimley/bookings-api:$GITHUB_REF_NAME api
docker build -t peterpimley/bookings-frontend:$GITHUB_REF_NAME frontend


echo $DOCKER_HUB_PAT | docker login --password-stdin -u peterpimley

docker push peterpimley/bookings-db:$GITHUB_REF_NAME
docker push peterpimley/bookings-api:$GITHUB_REF_NAME
docker push peterpimley/bookings-frontend:$GITHUB_REF_NAME
