let cluster = require('cluster');
let io = [];
let cpuCount = require('os').cpus().length;
let workers = [];
let cors = require('cors')

if (cluster.isMaster) {
    for (let i = 0; i < cpuCount; i += 1) {
        let worker = cluster.fork();
        worker.on('message', function(data) {
            for (let j in workers) {workers[j].send(data);}
        });
        workers.push(worker);
    }


}

if (cluster.isWorker) {

    let worker_id = cluster.worker.id;
    let express  = require('express');
    let app = express();
    let server = require('http').Server(app);
    io[worker_id] = require('socket.io')(server);
    server.listen(3051+worker_id);

    io[worker_id].on('connection', function (socket) {
        console.log( socket.id );
        console.log( "WORKER ID :"+worker_id );
        socket.emit('news', { hello: 'world' });
        socket.on('my other event', function (data) {
            console.log(data);
        });
    });

    let app_express = express();
    app_express.use(cors())
    app_express.listen(3051);
    app_express.use(express.static('public'));//отдаем статичные данные
    app_express.get('/', cors(), function (request, response) {
        response.send('Hello from Worker '+worker_id);
        console.log( '------' );

    });


    app_express.get('/get_port', cors(), function (request, response) {
        response.send(3051+worker_id);
        console.log( 'get_port' );
    });


    app_express.get('/api', cors(), function (request, response) {

        response.setHeader('Content-Type', 'application/json');
        let id = request.param('id');
        let msg = request.param('msg');
        let JSON_DATA = {
            "worker_id":worker_id
            ,"id":id
            ,"msg":msg
        };

        io[port-3030].to(msg.id).emit('news', msg.msg);
        response.send(	JSON.stringify(JSON_DATA) );
        process.send(JSON_DATA);

    });

    process.on('message', function(msg){
        console.log(worker_id);
        console.log(msg.id);
        console.log(msg.msg);
        io[worker_id].to(msg.id).emit('news', msg.msg);

    });

}