set -e

images=("db" "api" "superapi" "frontend")

for image in "${images[@]}"; do
	docker build -t peterpimley/bookings-$image:$GITHUB_REF_NAME $image
done


echo $DOCKER_HUB_PAT | docker login --password-stdin -u peterpimley

for image in "${images[@]}"; do
	docker push peterpimley/bookings-$image:$GITHUB_REF_NAME
done