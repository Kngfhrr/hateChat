// const app = require('express')();
// const http = require('http').Server(app);
// const io = require('socket.io')(http);
//
// const Rebridge = require("rebridge");
// const redis = require('redis');
//
//
// const client = redis.createClient();
// const db = new Rebridge(client, {
//     mode: "deasync"
// });
//
// // const redis_client = redis1.createClient();
// // io.adapter(redis({host: 'localhost', port: 6379}));
//
//
// const quest = [];
// const rooms = [];
// const names = {};
// const allUsers = {};
// db.test = [];
//
//
//
// const findPeerForLoneSocket = function (socket) {
//     if (quest) {
//         const peer = quest.pop();
//         const room1 = Object.keys(peer.rooms);
//         const room2 = Object.keys(socket.rooms);
//         const room = room1 + '#' + room2;
//         console.log('room1', peer.rooms, room2);
//          if(room1 === room2) {
//              return console.log('1111');
//          }
//          else {
//              rooms.push(room);
//          }
//         console.log('room:', room, 'ROOMS:', room1, room2);
//         peer.join(room);
//         socket.join(room);
//         peer.emit('chat start', {'name': socket.id, 'room': room});
//         socket.emit('chat start', {'name': peer.id, 'room': room});
//
//     } else {
//         console.log('Length < 2')
//     }
// };
//
// io.on('connection', function (socket) {
//     quest.push(socket);
//     console.log('User ' + socket.id + ' connected', '>>>Redis database: <<<<', db.test._value);
//     socket.on('join', function (room) {
//         names[socket.id] = room.username;
//         allUsers[socket.id] = socket;
//         // quest.splice(-0, 2);
//         console.log('SLICE', rooms, 'QUEST', quest.length, 'names', names[0]);
//         findPeerForLoneSocket(socket);
//     });
//     socket.on('message', function (msg) {
//         io.sockets.in(rooms).emit('message', msg);
//         console.log(msg, rooms);
//     });
//
//     socket.on('leave room', function () {
//         socket.broadcast.to(rooms).emit('chat end');
//         var peerID = rooms.split('#');
//         peerID = peerID[0] === socket.id ? peerID[1] : peerID[0];
//         findPeerForLoneSocket(allUsers[peerID]);
//         findPeerForLoneSocket(socket);
//     });
//
//     // socket.on('disconnect', function () {
//     //     var room = rooms[socket.id];
//     //     socket.broadcast.to(room).emit('chat end');
//     //     var peerID = room.split('#');
//     //     peerID = peerID[0] === socket.id ? peerID[1] : peerID[0];
//     //     // current socket left, add the other one to the queue
//     //     findPeerForLoneSocket(allUsers[peerID]);
//     // });
//     //
//
//     // io.on('connection', function(socket) {
// //
// //          socket.join('await room');
// //     socket.on('chat message', function (msg) {
// //         io.sockets.in('await room').emit('chat message', msg);
// //         console.log(socket.id);
// //
// //     });
// });
//
// io.listen(3040, function () {
//     console.log('listening on localhost:3000');
// });
// const app = require('express')();
// const http = require('http').Server(app);
// const io = require('socket.io')(http);
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var multiparty = require('multiparty');
var cors = require('cors');
app.use(cors());


server.listen(3045);

const quest = [];
const rooms = [];
const names = {};
const allUsers = {};
let online = 0;






 app.post('/file', function (req, res, next) {
    console.log('asasas');
    const form = new multiparty.Form();

    form.on('error', (err) => {
        res.status(400);
        next(err);
    });

    form.on('part', async (part) => {
        try {
            console.log('part ', await part);
            res.send(part)
        } catch (e) {
            console.error(e)
        }
    });
    form.parse(req)
});



const findPeerForLoneSocket = function (socket) {
    if (quest.length >= 2) {
        const peer = quest.pop();
        console.log(peer.id + ' was popped from queue\n');
        const room = peer.id + '#' + socket.id;
        console.log('room', room);
        console.log(peer.id, socket.id);
        quest.splice(-0, 2);
        rooms.splice(-0, 2);
        rooms.push(room);
        peer.join(room);
        socket.join(room);
        // peer.emit('chat start', {'name': socket.id, 'room': room});
        // socket.emit('chat start', {'name': peer.id, 'room': room});
    } else {
        quest.push(socket)

    }
};

io.on('connection', function (socket) {
    quest.push(socket);
    online++;
    socket.emit('join', online);
    console.log('User ' + socket.id + ' connected');
    console.log('online:', online);
    socket.on('join', function (room) {
        if(quest.length <= 1){
            return;
        }
        else {
            console.log('join: ', room);
            names[socket.id] = room.username;
            allUsers[socket.id] = socket;
            findPeerForLoneSocket(socket);
        }

    });
    socket.on('message', function (msg) {
        io.sockets.in(rooms).emit('message', msg);
        console.log(msg, rooms);
    });


    socket.on('leave room', function () {
        socket.broadcast.to(rooms).emit('chat end');
        var peerID = rooms.split('#');
        peerID = peerID[0] === socket.id ? peerID[1] : peerID[0];
        findPeerForLoneSocket(allUsers[peerID]);
        findPeerForLoneSocket(socket);
    });

    socket.on('disconnect', function () {
        var room = rooms[socket.id];
        online--;
        console.log('online:',online);


        // var peerID = room.split('#');
        // peerID = peerID[0] === socket.id ? peerID[1] : peerID[0];
        // // current socket left, add the other one to the queue
        // findPeerForLoneSocket(allUsers[peerID]);
    });

});