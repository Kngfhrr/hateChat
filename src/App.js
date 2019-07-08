import React, {Component} from 'react';
import Chatbox from './components/chatbox';
import {ALL_CHATS_QUERY, CREATE_CHAT_MUTATION} from './graph-query/chat-query'
import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';


import './App.css';

class App extends React.Component {
    constructor(props) {
        super(props);

    }
    state = {
        from: 'anonymous',
        content: ''
    };
    _createChat = async e => {
        if (e.key === 'Enter') {
            const {content, from} = this.state;
            await this.props.createChatMutation({
                variables: {content, from}
            });
            this.setState({content: ''});
        }
    };
    btnCreateChat = async e => {
        const {content, from} = this.state;
        await this.props.createChatMutation({
            variables: {content, from}
        })
        this.setState({content: ''})
    }
    _subscribeToNewChats = () => {
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
                return result;
            }
        });
    };

    componentDidMount() {
        const from = window.prompt('username');
        from && this.setState({from});
        this._subscribeToNewChats();
        // const chatWindow = document.getElementById('chat-form');
        // const height = chatWindow.scrollHeight;
        // chatWindow.scrollBy(0, height);

    }
    render() {
        const allChats = this.props.allChatsQuery.allChats || [];
        return (
            <div id='chat-form' className="App">
                <div className='chat-form'>
                    {allChats.map(message => (
                        <Chatbox key={message.id} message={message}/>
                    ))}
                </div>
                <div className='footer'>
                    <input
                        onKeyPress={this._createChat}
                        placeholder='Start typing'
                        onChange={(e) => {
                            this.setState({content: e.target.value})
                        }} value={this.state.content} className='input-send'></input>
                    <button onClick={this.btnCreateChat} className='button-send'>SEND</button>
                </div>
            </div>
        );
    }
}

export default compose(
    graphql(ALL_CHATS_QUERY, {name: 'allChatsQuery'}),
    graphql(CREATE_CHAT_MUTATION, {name: 'createChatMutation'})
)(App);