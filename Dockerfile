FROM node
WORKDIR /code

RUN npm install -g nodemon@1.18.3
RUN npm install tedious
RUN npm install async

COPY package.json /code
RUN npm install && npm ls

COPY . /code

EXPOSE 3000
CMD ["npm","start"]