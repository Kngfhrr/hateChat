import React from 'react';
import '../App.css'
import moment from 'moment'
const colors = ['grey'];
var rand = colors[Math.floor(Math.random() * colors.length)];
console.log(rand);
    const Chatbox = ({message}) => (

      <div className='message-block'>
          <div>    <span  style={{color: rand, marginBottom: '20px'}} >{message.from}</span>
              <div className="message">
                  <span> {message.content} </span>
              </div> </div>
       <div className='time'>{moment(message.createdAt).format("h:mm:ss a")}</div>
      </div>
    );
    export default Chatbox;