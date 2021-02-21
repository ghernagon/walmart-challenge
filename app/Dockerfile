FROM node:10-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
RUN chmod +x ./wait-for-it.sh
RUN apk update && apk add bash