import React from 'react';
import '../Chatbox.css'
    const Chatbox = ({message}) => (
      <div className="chat-box">
        <div className="chat-message">
          <span><span className='nick'>{message.from}</span> : {message.content}</span>
        </div>
      </div>
    );
    export default Chatbox;