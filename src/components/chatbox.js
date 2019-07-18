import React from 'react';
import '../App.css'
import moment from 'moment'
const colors = ['grey'];
var rand = colors[Math.floor(Math.random() * colors.length)];
console.log(rand);


    this.state = {
       login: '',
        };


     const Chatbox = ({message}) => (

      <div className='message-block'>
          <div>    <span  style={{color: rand, marginBottom: '20px'}} >{message.login}</span>
              <div className="message">
                  <span> {message.message} </span>
              </div> </div>
       <div className='time'>{moment(message.date).format("h:mm:ss a")}</div>
      </div>
    );


export default Chatbox;