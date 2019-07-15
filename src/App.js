import React, {Component} from 'react';
import Chatbox from './components/chatbox';
import Header from './components/ui/header';
import {ALL_CHATS_QUERY, CREATE_CHAT_MUTATION, DELETE_CHAT_MUTATION} from './graph-query/chat-query'
import {graphql, compose} from 'react-apollo';
import smile from './components/images/smile1.svg'
import image from './components/images/image.svg'
import axios, { post } from 'axios';
import Scrollbar from 'react-smooth-scrollbar';
import gql from 'graphql-tag';
import FileBase64 from 'react-file-base64';
import Footer from './components/ui/footer'
import './App.css';
require('es6-promise').polyfill()
require('isomorphic-fetch')



class App extends React.Component {
    constructor(props) {
        super(props);

    }

    state = {
        from: 'anonymous',
        content: '',
        pictures: [],
        img: [],
        files: []

    };
    createChat = async e => {
        if (e.key === 'Enter') {
            const {content, from} = this.state;
            await this.props.createChatMutation({
                variables: {content, from}
            });
            this.setState({content: ''});
        }
    };

    subscribeToNewChats = () => {
        this.props.allChatsQuery.subscribeToMore({
            document: gql`
                subscription {
                    Chat(filter: { mutation_in: [CREATED] }) {
                        node {
                            id
                            from
                            content
                            createdAt
                        }
                    }
                }
            `,
            updateQuery: (previous, {subscriptionData}) => {
                const newChatLinks = [
                    ...previous.allChats,
                    subscriptionData.data.Chat.node
                ];
                const result = {
                    ...previous,
                    allChats: newChatLinks
                };
                return result
            }
        });
    };

    componentDidMount() {
        const from = window.prompt('username');
        from && this.setState({from});
        this.subscribeToNewChats();
    }


    getFiles(files){
        this.setState({ files: files })
    }

    // onDrop = picture => {
    //     const pictures = this.state.pictures;
    //     pictures.push(picture);
    //     this.setState({
    //         pictures
    //     });
    //     console.log(pictures);
    // };


    uploadFile = () => {
        const files = this.state.files;
        let data = new FormData();
        data.append("data", files[0]);
        console.log(files[0]);
        return fetch('http://localhost:4002/file', {
            method: "POST",
            body: data,

        }).then(response => {
            return response.json()
        }).then(file => {
            console.log('FileID', file);
        })
    }

    render() {
        const img = this.state.files;
        const allChats = this.props.allChatsQuery.allChats || [];
        return (

            <div id='chat' className="App">
                <Header/>
                      <img src={img.base64} alt={''}/>
                <Scrollbar id='chat' className='chat-form'
                           damping={0.1}
                           thumbMinSize={10}
                           syncCallbacks={true}
                           renderByPixels={true}
                           alwaysShowTracks={false}
                           continuousScrolling={true}
                           wheelEventTarget={null}

                >
                    <div id='chat' className='form'>

                        {allChats.map(message => (
                            <Chatbox key={message.id} message={message}/>
                        ))}

                        {/*{ this.state.files.map((file,i) => {*/}
                            {/*return <img key={i} src={file.base64} />*/}
                        {/*}) }*/}
                    </div>
                </Scrollbar>
                <div className='footer'>
                    <div className='icons'>
                        <img style={{width: '30px', cursor: 'pointer'}} src={smile} alt={''}/>
                        <img style={{width: '30px', cursor: 'pointer'}} src={image} alt={''}/>
                    </div>

                    <input
                        onKeyPress={this.createChat}
                        placeholder='Write a message...'
                        onChange={(e) => {
                            this.setState({content: e.target.value})
                        }} value={this.state.content} className='input-send'></input>
                    <button onClick={this.uploadFile}>test</button>


                </div>
                <div style={{width: '150px', height: '20px'}}>
                    <FileBase64
                    multiple={ true }
                    onDone={ this.getFiles.bind(this) } />
                </div>


            </div>
        );
    }
}

export default compose(
    graphql(ALL_CHATS_QUERY, {name: 'allChatsQuery'}),
    graphql(CREATE_CHAT_MUTATION, {name: 'createChatMutation'}),
    graphql(DELETE_CHAT_MUTATION, {name: 'deleteChat'})
)(App);