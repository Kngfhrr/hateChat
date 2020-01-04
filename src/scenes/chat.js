import React from 'react'
import Header from '../kit/modules/header'
import Chatbox from '../kit/components/chat/chatbox'
import '../App.css'
import Footer from '../kit/modules/footer'
import socket from '../kit/components/api'

class Chat extends React.Component {
  constructor(props) {
    super(props)
    socket.on('connect', async (data) => {
      console.log('SOCKET', socket)
      console.log('ME', localStorage.getItem('me'))
      this.setState({ me: socket.id })
    })
    socket.on('message', data => {
      const message = this.state.message
      console.log('MESSAGE', message)
      message.push(data)
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
    id: '',
    me: '',
  }

  sendMessage = e => {
    const name = localStorage.getItem('name')
    const me = localStorage.getItem('me')
    if (e.key === 'Enter' || e.type === 'click') {
      const msg = this.state.msg
      if (!msg) {
        return console.log('empty')
      } else {
        fetch('http://localhost:3002/messages', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name,
            message: this.state.msg,
            id: me,
          }),
        }).then(function(response) {
          return response
        })
      }
    }
  }
  render() {
    const me = localStorage.getItem('me')
    const name = localStorage.getItem('name')
    const state = this.props.location.state
    const message = this.state.message
    return (
      <div className="App">
        <Header props={state} name={name} connected={socket.connected} />
        <div>
          <div id="chat-form" className="chat-form">
            {message.map((message, index) => (
              <Chatbox key={index} message={message} me={me} />
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
