import React from "react";
import "../app/components/styles/login-page.css";
import { withRouter } from "react-router-dom";
import socketCluster from "socketcluster-client";


let options = {
    port: 8080,
    hostname: "localhost",
    autoConnect: true,
};

   const socket = socketCluster.connect(options)

class Login extends React.Component {
  constructor(props) {

    super(props);
      socket.on('error', function (err) {
          throw 'Socket error - ' + err;
      });

      socket.on('connect', function () {
          console.log('Connected to server');
      });
  }

  state = {
    room: "",
    login: "Anon",
      online: 0
  };


  onButtonClick = () => {
    const online = this.state.online;
    const { history } = this.props;
    const room = this.state.room;
    console.log(room);
    if (online === 1) {
      return alert("Waiting to connect");
    }
      socket.on('join', {name: 'Anon'})
    history.push("/chat", { login: this.state.login });

  };


  render() {
    console.log(this.state.login);
    return (
      <div className="Login">
        <div className="online-user-div">
          <div className="online-user">
            <span>Online users: {this.state.online}</span>
          </div>
        </div>

        <div className="login-form">
          <span className="login-text">Login</span>
          <input
            className="login-input"
            placeholder="Enter login"
            onChange={e => {
              this.setState({ login: e.target.value });
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
    );
  }
}

export default withRouter(Login);
