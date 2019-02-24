FROM node:11.6
WORKDIR /usr/src/app
# Install the packages of the source
COPY ./package.json .
RUN [ "npm", "install", "--production" ]

COPY . ./
USER node

EXPOSE 3000
CMD [ "npm", "start" ]

