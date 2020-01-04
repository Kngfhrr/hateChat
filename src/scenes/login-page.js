import React from 'react'
import { withRouter } from 'react-router-dom'
import socket from '../kit/components/api'
import '../kit/components/styles/login-page.css'

class Login extends React.Component {
  constructor(props) {
    super(props)
    socket.on('error', function(err) {
      throw 'Socket error - ' + err
    })

    socket.on('connect', () => {
      localStorage.setItem('me', socket.id)
    })
  }

  state = {
    room: '',
    id: '',
    login: '',
    online: 0,
  }

  onButtonClick = () => {
    const { history } = this.props
    localStorage.setItem('name', this.state.login || 'Anon')
    socket.emit('join', this.state.id)
    history.push('/chat')
  }

  render() {
    return (
      <div className="Login">
        <div className="online-user-div">
          <div className="online-user">
            <span>Online users: null</span>
          </div>
        </div>

        <div className="login-form">
          <span className="login-text">Login</span>
          <input
            className="login-input"
            placeholder="Enter login"
            onChange={e => {
              this.setState({ login: e.target.value })
            }}
          />
          <button
            onClick={this.onButtonClick}
            className="btn btn-primary btn-block btn-large"
          >
            Join
          </button>
        </div>
      </div>
    )
  }
}

export default withRouter(Login)
