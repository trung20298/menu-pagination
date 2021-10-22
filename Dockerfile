FROM node:15.11.0-alpine3.13
RUN apk add --no-cache --virtual .gyp g++ make python3 py3-pip
WORKDIR /app
COPY ./package.json ./package-lock.json /app/
RUN npm install --only=prod
COPY . /app
EXPOSE 3000
CMD cd /app && npm run start:prod
