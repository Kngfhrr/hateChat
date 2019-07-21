var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var multiparty = require('multiparty');
var cors = require('cors');
app.use(cors());


server.listen(3048);

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
    socket.emit('join', {join: online, rooms});
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
        console.log(msg.room, rooms);
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