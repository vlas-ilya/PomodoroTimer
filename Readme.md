docker build -f BuildDockerfile .
docker run -v PWD/:/app/src -v $PWD/dist/:/app/dist de33003a5e41

docker build -f StartDockerfile .
docker run -e TOKEN=<token> -v $PWD/dist/:/app/dist/ 880fc11f7b7a