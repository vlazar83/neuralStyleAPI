# neuralStyleAPI

## For start run:

cd script

python3 models/download_models.py  
npm i  
npm run start

OR

Use the docker which has anaconda + nodejs setup + contains the above mentioned models:

https://hub.docker.com/repository/docker/dockerdoc83/neural-style-api

The front end project repository is located here:

https://hub.docker.com/repository/docker/dockerdoc83/neural-style-fe

each project contains a docker-compose fle as well, so with a simple command:

docker-compose up -d

both the front end and the back end can be started.

ACHTUNG!
```
Do not start the server process (npm run start) in VSCode terminal, because the CPU and Memory usage will be limited,
and the OS might terminate the python process once the neural transfer kicks in.
```

---

## Used materials:

```
@misc{ProGamerGov2018,
  author = {ProGamerGov},
  title = {neural-style-pt},
  year = {2018},
  publisher = {GitHub},
  journal = {GitHub repository},
  howpublished = {\url{https://github.com/ProGamerGov/neural-style-pt}},
}
```
