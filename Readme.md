docker build -f BuildDockerfile .
docker run -v PWD/:/app/src -v $PWD/dist/:/app/dist <CONTAINER ID>

docker build -f StartDockerfile .
docker run -e TOKEN=<token> -e MODE=telegram -v $PWD/dist/:/app/dist/ <CONTAINER ID>