let SCWorker = require('socketcluster/scworker')
let express = require('express')
let serveStatic = require('serve-static')
let path = require('path')
let morgan = require('morgan')
let healthChecker = require('sc-framework-health-check')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');
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

    // let quests = []
    // let rooms = []
    // let online = 0

    // const createRoom = function(socket) {
    //   if (quests.length >= 2) {
    //     const first_user = quests.pop()
    //     const second_user = quests.pop()
    //
    //     let room = first_user + '#' + second_user
    //     console.log('room', room)
    //     quests.splice(-0, 2)
    //     rooms.push({
    //       id: first_user + second_user,
    //       firstUser: first_user,
    //       secondUser: second_user,
    //       room: room,
    //     })
    //     console.log('rooms', rooms)
    //   }
    //   console.log('only 1 user, has pushed in quests', quests.length)
    // }
    scServer.on('connection', function(socket) {
        console.log('user connected', socket.id)
        socket.emit('join', ( name, callback) => {
            console.log('Join', name)
            const { error, user } = addUser({ room: socket.id, name});
            if(error) return callback(error);
            socket.join(user.room);

            callback();
        });

        socket.on('disconnect', function() {
        console.log('User disconnected', socket.id)
        removeUser(socket.id)
      })
        socket.on('chat', (message, callback) => {
            const user = getUser(socket.id);
            console.log(message)
            socket.emit('chat',  message );

            callback();
        });

    })
  }
}

new Worker()
