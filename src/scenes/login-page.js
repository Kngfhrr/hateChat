import React from "react";
import socket from "../app/components/api";
import "../app/components/styles/login-page.css";
import { withRouter } from "react-router-dom";

class Login extends React.Component {
  constructor(props) {
    super(props);
    socket.on("join", data => {
      console.log(data);
      this.setState({ online: data.join, room: data.rooms });
    });
  }

  state = {
    online: "",
    room: "",
    login: "Anon"
  };

  onButtonClick = () => {
    const online = this.state.online;
    const { history } = this.props;
    const room = this.state.room;
    console.log(room);
    if (online === 1) {
      return alert("Waiting to connect");
    }
    history.push("/chat", { login: this.state.login, room });
    this.onJoin();
  };
  onJoin = () => {
    socket.emit("join", "Test");

    console.log(this.state.online);
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
