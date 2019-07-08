import React from 'react';
import '../App.css'
    const Chatbox = ({message}) => (
      <div>
        <div className="message">
          <span><span className='nick'>{message.from}</span> : {message.content}</span>
        </div>
      </div>
    );
    export default Chatbox;