import React from "react";
import Header from "../app/components/chat/header";
import Chatbox from "../app/components/chatbox";
import "emoji-mart/css/emoji-mart.css";
import socket from "../app/components/api";
import "../App.css";
import Footer from "../app/components/chat/footer";

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
    files: [],
    showReply: false
  };

  createChat = async e => {
    const data = this.props.location.state;
    const room = data.room;
    console.log(data);
    if (e.key === "Enter") {
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
        <Footer />
      </div>
    );
  }
}
export default Chat;
