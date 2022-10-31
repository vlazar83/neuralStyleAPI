#FROM node:16
FROM continuumio/anaconda3

RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl

ARG NODE_VERSION=16.14.0
ARG NODE_PACKAGE=node-v$NODE_VERSION-linux-x64
ARG NODE_HOME=/opt/$NODE_PACKAGE

ENV NODE_PATH $NODE_HOME/lib/node_modules
ENV PATH $NODE_HOME/bin:$PATH

RUN curl https://nodejs.org/dist/v$NODE_VERSION/$NODE_PACKAGE.tar.gz | tar -xzC /opt/


# Core dependencies
#RUN sudo apt-get update && sudo apt-get install

#FROM alpine:3.15
#FROM ubuntu
#RUN apt-get update && apt-get install -y libgtk2.0-dev && \
#    rm -rf /var/lib/apt/lists/*

#RUN apt-get install wget
#RUN apk add bash
#RUN wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda.sh
#RUN bash ~/miniconda.sh -b -p $HOME/miniconda
#RUN bash ~/miniconda.sh -b -p $HOME/miniconda

#ENV PATH=$PATH:/root/miniconda/bin

# RUN curl -L https://raw.githubusercontent.com/yyuu/pyenv-installer/master/bin/pyenv-installer | bash

#ENV PYENV_ROOT=$HOME/.pyenv
#ENV PATH=$PATH:$PYENV_ROOT/bin

RUN conda init bash
RUN conda update -n base conda
RUN conda install pytorch torchvision -c pytorch

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3000

CMD [ "node", "server.js" ]
