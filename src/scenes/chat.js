import React from 'react'
import Header from '../app/modules/header'
import Chatbox from '../app/components/chat/chatbox'

import socketCluster from 'socketcluster-client'
import '../App.css'
import Footer from '../app/modules/footer'

let options = {
  port: 8080,
  hostname: 'localhost',
  autoConnect: true,
}
const socket = socketCluster.connect(options)
class Chat extends React.Component {
  constructor(props) {
    super(props)
    socket.on('chat', data => {
      const message = this.state.message
      message.push(data.message)
      console.log('message on client:', data)
      this.setState({
        msg: '',
        message,
      })
      const chatWindow = document.getElementById('chat-form')
      const height = chatWindow.scrollHeight
      chatWindow.scrollBy(0, height)
    })
  }

  state = {
    message: [],
    msg: '',
    login: 'Anon',
    online: '',
  }

  sendMessage = e => {
    const data = this.props.location.state
    if (e.key === 'Enter' || e.type === 'click') {
      const date = new Date()
      const login = this.state.login
      const msg = this.state.msg
      if (msg === '') {
        return console.log('empty')
      } else {
        socket.emit('chat', { message: msg, date, login })
      }
    }
  }

  render() {
    const state = this.props.location.state
    const message = this.state.message
    return (
      <div className="App">
        <Header props={state} />
        <div>
          <div id="chat-form" className="chat-form">
            {message.map((message, index) => (
              <Chatbox key={index} message={message} />
            ))}
          </div>
        </div>
        <Footer
          onPress={this.sendMessage}
          onChange={e => this.setState({ msg: e.target.value })}
          value={this.state.msg}
        />
      </div>
    )
  }
}
export default Chat
