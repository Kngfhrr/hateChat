import React, { Component } from 'react';
import Chatbox from './components/chatbox';
import {ALL_CHATS_QUERY, CREATE_CHAT_MUTATION} from './graph-query/chat-query'
// Import GraphQL helpers
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

// App component styles
import './App.css';

class App extends Component {
  state = {
    from: 'anonymous',
    content: ''
  };
  _createChat = async e => {
    if (e.key === 'Enter') {
      const { content, from } = this.state;
       await this.props.createChatMutation({
         variables: { content, from }
       });
       this.setState({ content: '' });
     }
   };
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
        updateQuery: (previous, { subscriptionData }) => {
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
    // Get username form prompt
    // when page loads
    const from = window.prompt('username');
    from && this.setState({ from });
    this._subscribeToNewChats();
  }
  render() {
    const allChats = this.props.allChatsQuery.allChats || [];
    return (
      <div className="App">
        <div className="container">
          <h2>Chats</h2>
          {allChats.map(message => (
            <Chatbox key={message.id} message={message} />
          ))}
       <div className='send-form'>  <input
                className="chat-input"
                value={this.state.content}
                onChange={e => this.setState({ content: e.target.value })}
                type="text"
                placeholder="Start typing"
                onKeyPress={this._createChat}
              />
              <button onClick={this._createChat} className='send-button'>SEND</button>
              </div>
          
      </div>
        </div> 
      
    );
  }
}

export default compose(
  graphql(ALL_CHATS_QUERY, { name: 'allChatsQuery' }),
  graphql(CREATE_CHAT_MUTATION, { name: 'createChatMutation' })
)(App);