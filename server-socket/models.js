let mongoose = require('mongoose')

let Message = mongoose.model('Message', {
  name: String,
  message: String,
  id: String,
})
let Users = mongoose.model('Users', { id: String })

module.exports = { Users, Message }
