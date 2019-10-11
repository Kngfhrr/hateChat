let SCWorker = require('socketcluster/scworker');
let express = require('express');
let serveStatic = require('serve-static');
let path = require('path');
let morgan = require('morgan');
let healthChecker = require('sc-framework-health-check');

class Worker extends SCWorker {
    run() {
        console.log('   >> Worker PID:', process.pid);
        let environment = this.options.environment;

        let app = express();

        let httpServer = this.httpServer;
        let scServer = this.scServer;

        if (environment === 'dev') {
            app.use(morgan('dev'));
        }
        app.use(serveStatic(path.resolve(__dirname, 'public')));


        healthChecker.attach(this, app);

        httpServer.on('request', app);

        let quests = []
        let rooms = []
        let online = 0

        const createRoom = function (socket) {
            if (quests.length >= 2) {
                const first_user = quests.pop();
                const second_user = quests.pop();

                const room = first_user.id + '#' + second_user.id;
                console.log('room', room);
                quests.splice(-0, 2);
                rooms.push({firstUser: first_user.id, secondUser: second_user.id, room: room});
                console.log('rooms', rooms)
                console.log("quests", quests)
            }
            return console.log('No users')
        }
        scServer.on('connection', function (socket) {
            console.log('User connected', socket.id);
            quests.push(socket)
            online++
            console.log('online', online)
            if (online > 2) {
                console.log(' < 2 ')
            }
            else {
                console.log('> 2')
                createRoom(socket)
            }

            socket.on('disconnect', function () {
                console.log('User disconnected');
                online--
            });

            scServer.on('message', function (data, rooms) {
                socket.to('dwadaw').emit('message', data);
                console.log('message from client:' + {data: data, rooms: online});
            });
        });

    }
}

new Worker();
