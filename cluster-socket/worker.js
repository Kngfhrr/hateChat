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


    scServer.on('connection', function(socket) {
        console.log('user connected', socket.id)
        const {error, user} = addUser({id: socket.id})

        socket.on('join', async (id) => {
            const room = await getRandomUsers()

            if(error){
                console.log('ERROR')
            }
        });

        socket.on('disconnect', function() {
        console.log('User disconnected', socket.id)
        removeUser(socket.id)
      })
        socket.on('chat', (message, callback) => {
            socket.emit('chat',  message, ()=>{
                console.log('MESSAGE', message)
            } );

            callback();
        });

    })
  }
}

new Worker()
