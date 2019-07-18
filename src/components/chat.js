import React from 'react';
import Header from './ui/header';
import smile from './images/smile1.svg'
import Chatbox from './chatbox'
import image from './images/image.svg'
import socket from './api'
import FileBase64 from 'react-file-base64';

import '../App.css';

class Chat extends React.Component {
    constructor(props) {
        super(props);
        socket.on('message', (data) => {
            let message = this.state.message;
            message.push(data);
            console.log('message:', message);
            this.setState({
                msg: '', message
            });
            const chatWindow = document.getElementById('chat-form');
            const height = chatWindow.scrollHeight;
            chatWindow.scrollBy(0, height);
        });

    }

    state = {
        message: [],
        msg: '',
        login: 'Anon',
        online: '',
        files: []
    };

    getFiles=(files)=>{
        this.setState({ files: files })
        console.log(this.state.files)
    }


    createChat = async e => {
        if (e.key === 'Enter') {
            const date = new Date();
            const login = this.state.login;
            const msg = this.state.msg;
            if (msg === '') {
                return console.log('empty')
            } else {
                socket.emit('message', {message: msg, date, login});
            }
        }
    };

    uploadFile = () => {
        const files = this.state.files;
        let data = new FormData();
        data.append("data", files[0]);
        console.log(files[0]);
        return fetch('http://localhost:3045/file', {
            method: "POST",
            body: data,

        }).then(response => {
            return response.json()
        }).then(file => {
            console.log('FileID', file);
        })
    }

    render() {
        const state = this.props.location.state;
        const message = this.state.message;
        return (

            <div className="App">
                <Header data={state}/>
                <div>

                    <div id='chat-form'
                         className='chat-form'>
                        {message.map((message, index) =>
                            <Chatbox key={index} message={message}/>
                        )}
                    </div>

                </div>
                <div className='footer'>
                    <div className='icons'>
                        <img style={{width: '30px', cursor: 'pointer'}} src={smile} alt={''}/>
                        <FileBase64
                            multiple={ true }
                            onDone={ this.getFiles } />
                            <button onClick={this.uploadFile}>send img</button>
                    </div>

                    <input
                        onKeyPress={this.createChat}
                        value={this.state.msg}
                        placeholder='Write a message...'
                        onChange={(e) => this.setState({msg: e.target.value})} className='input-send'></input>


                </div>
                <div style={{width: '150px', height: '20px'}}>

                </div>


            </div>
        );
    }
}

export default Chat;