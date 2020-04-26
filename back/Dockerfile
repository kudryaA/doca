FROM node:12
WORKDIR /home/node
COPY package.json /home/node
COPY package-lock.json /home/node
RUN npm install

COPY app/  /home/node/app
CMD npm start