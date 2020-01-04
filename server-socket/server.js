let express = require('express')
let bodyParser = require('body-parser')
let app = express()
let http = require('http').Server(app)
let io = require('socket.io')(http)
let mongoose = require('mongoose')
let { dbUrl } = require('./base')
let cors = require('cors')
app.use(cors())
let corsOptions = {
  origin: 'localhost:3000',
  optionsSuccessStatus: 200,
}

app.use(express.static(path.join(__dirname, 'build')));


app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
})

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

let Message = mongoose.model('Message', {
  name: String,
  message: String,
  id: String,
})

app.get('/messages', cors(corsOptions), (req, res) => {
  Message.find({}, (err, messages) => {
    res.send(messages)
  })
})

app.get('/messages/:user', (req, res) => {
  var user = req.params.user
  Message.find({ name: user }, (err, messages) => {
    res.send(messages)
  })
})

app.post('/messages', cors(corsOptions), async (req, res) => {
  try {
    let message = new Message(req.body)
    let savedMessage = await message.save()
    console.log('saved')
    let censored = await Message.findOne({ message: 'badword' })
    if (censored) await Message.remove({ _id: censored.id })
    else io.emit('message', req.body)
    res.sendStatus(200)
  } catch (error) {
    res.sendStatus(500)
    return console.log('error', error)
  } finally {
    console.log('Message Posted')
  }
})

io.on('connection', data => {
  console.log('a user is connected', data.id)
})

mongoose.connect(
  dbUrl,
  { useNewUrlParser: true, useUnifiedTopology: true },
  err => {
    console.log('mongodb connected', err)
  },
)

let server = http.listen(3001, () => {
  console.log('server is running on port', server.address().port)
})
