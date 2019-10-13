let SCWorker = require('socketcluster/scworker')
let express = require('express')
let serveStatic = require('serve-static')
let path = require('path')
let morgan = require('morgan')
let healthChecker = require('sc-framework-health-check')

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

    let quests = []
    let rooms = []
    let online = 0

    const createRoom = function(socket) {
      if (quests.length >= 2) {
        const first_user = quests.pop()
        const second_user = quests.pop()

        let room = first_user + '#' + second_user
        console.log('room', room)
        quests.splice(-0, 2)
        rooms.push({
          id: first_user + second_user,
          firstUser: first_user,
          secondUser: second_user,
          room: room,
        })
        console.log('rooms', rooms)
      }
      console.log('only 1 user, has pushed in quests', quests.length)
    }
    scServer.on('connection', function(socket) {
      console.log('User connected', socket.id)
      quests.push(socket.id)
      online++
      console.log('online', online)
      if (online < 2) {
        console.log(' < 2 ')
      } else {
        console.log('> 2')
        createRoom(socket)
      }

      socket.on('disconnect', function() {
        console.log('User disconnected', socket.id)
        rooms
          .filter((item, index) => socket.id === item.firstUser && item.secondUser)
          .map((item) => {
            quests.push(
              socket.id === item.firstUser ? item.secondUser : item.firstUser,
            )
            rooms.filter((item, index) => socket.id === !item.firstUser && !item.secondUser)
          })

        console.log('after splice', quests)
          console.log('rooms', rooms)
        online--
      })
      socket.on('chat', data => {
        socket.emit('chat', { message: data, rooms: 'test' })
      })
    })
  }
}

new Worker()
