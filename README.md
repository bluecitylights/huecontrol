# huecontrol
NodeJS server using HUEJay library with React client to restrict acccess to Philips HUE Bridge per user.


# Build application
install nodejs
npm install -g nodemon
Note thst the scrips in package.json are working in linux only. for windows they have to be adjusted. Running Ubuntu forom the Microsfot store is fine too.


## build development
cd client
npm install
npm start
cd server
npm install
nom run watch

## build production
cd client
npm install
npm run build
cd server
npm install
npm run build
npm prune --production 
npm start

https://medium.com/netbeast/devops-workflow-node-js-docker-ec33a5133311


Continuous integration
https://travis-ci.org/bluecitylights/huecontrol/builds

Dockerhub
https://hub.docker.com/r/bluecitylights/huecontrol/
