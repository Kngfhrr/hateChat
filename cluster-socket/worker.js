let SCWorker = require('socketcluster/scworker')
let express = require('express')
let serveStatic = require('serve-static')
let path = require('path')
let morgan = require('morgan')
let healthChecker = require('sc-framework-health-check')
const { addUser, removeUser, getUser, getUsersInRoom, users, getRandomUsers } = require('./users');
class Worker extends SCWorker {
  run() {
    console.log('   >> Worker PID:', process.pid)
    let environment = this.options.environment

    let app = express()

    let httpServer = this.httpServer
    let scServer = this.scServer

    if (environment === 'dev') {
      app.use(morgan('dev'))
    }
    app.use(serveStatic(path.resolve(__dirname, 'public')))

    healthChecker.attach(this, app)

    httpServer.on('request', app)


      scServer.on('connection', function (socket) {

          console.log('User connected');

          socket.on('chat', function (data) {
              scServer.global.publish('yell', data);
              console.log('Chat:', data);
          });

          socket.on('disconnect', function () {
              console.log('User disconnected');
          });
      });
  }
}

new Worker()
