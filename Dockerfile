FROM continuumio/anaconda3

RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl
RUN apt install nano

ARG NODE_VERSION=16.14.0
ARG NODE_PACKAGE=node-v$NODE_VERSION-linux-arm64
ARG NODE_HOME=/opt/$NODE_PACKAGE

ENV NODE_PATH $NODE_HOME/lib/node_modules
ENV PATH $NODE_HOME/bin:$PATH

RUN curl https://nodejs.org/dist/v$NODE_VERSION/$NODE_PACKAGE.tar.gz | tar -xzC /opt/

RUN conda init bash
RUN conda update -n base conda
RUN conda install pytorch torchvision -c pytorch

# workaround for ImportError: cannot import name 'PILLOW_VERSION' from 'PIL' (/opt/conda/lib/python3.9/site-packages/PIL/__init__.py)
# change PILLOW_VERSION to __version__
RUN sed -i 's/from PIL import Image, ImageOps, ImageEnhance, PILLOW_VERSION/from PIL import Image, ImageOps, ImageEnhance, __version__/g' /opt/conda/lib/python3.9/site-packages/torchvision/transforms/functional.py

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# nodejs server is listening on this port
EXPOSE 3000

CMD [ "node", "server.js" ]
