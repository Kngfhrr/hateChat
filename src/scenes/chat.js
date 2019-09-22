import React from "react";
import Header from "../app/modules/header";
import Chatbox from "../app/components/chat/chatbox";
import "emoji-mart/css/emoji-mart.css";
import socket from "../app/components/api";
import "../App.css";
import Footer from "../app/modules/footer";

class Chat extends React.Component {
  constructor(props) {
    super(props);
    socket.on("message", data => {
      let message = this.state.message;
      message.push(data);
      console.log("message:", message);
      this.setState({
        msg: "",
        message
      });
      const chatWindow = document.getElementById("chat-form");
      const height = chatWindow.scrollHeight;
      chatWindow.scrollBy(0, height);
    });
  }

  state = {
    message: [],
    msg: "",
    login: "Anon",
    online: "",
  };

  createChat = e => {
    const data = this.props.location.state;
    const room = data.room;
    if (e.key === "Enter" || e.type === "click") {
      const date = new Date();
      const login = this.state.login;
      const msg = this.state.msg;
      if (msg === "") {
        return console.log("empty");
      } else {
        socket.emit("message", { message: msg, date, login, room });
      }
    }
  };

  render() {
    console.log(this.state.msg);
    const state = this.props.location.state;
    const message = this.state.message;
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
          onPress={this.createChat}
          onChange={e => this.setState({ msg: e.target.value })}
          value={this.state.msg}
        />
      </div>
    );
  }
}
export default Chat;
