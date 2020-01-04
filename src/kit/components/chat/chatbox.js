import React from 'react'
import '../../../App.css'
import moment from 'moment'
const colors = ['grey']
var rand = colors[Math.floor(Math.random() * colors.length)]
console.log(rand)

this.state = {
  login: '',
}

const Chatbox = ({ message, me }) => (
  <div className={me === message.id ? 'message-block' : 'right-message'}>
    <div>
      {' '}
      <span style={{ color: rand, marginBottom: '20px' }}>{message.name}</span>
      <div className={me === message.id ? 'message' : 'message-r'}>
        <span> {message.message} </span>
      </div>{' '}
    </div>
    {/*<div className='time'>{moment(message.date).format("h:mm:ss a")}</div>*/}
  </div>
)

export default Chatbox
