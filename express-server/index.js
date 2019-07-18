
const express = require('express');
const {ApolloServer, gql} = require('apollo-server-express');
const multiparty = require('multiparty');
var cors = require('cors');
var bodyParser = require("body-parser");
const uuidv4 = require('uuid/v4');

const {schema} = require('./src/schema/index')

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

let users = {
    1: {
        id: '1',
        firstname: 'Robin',
        lastname: ' Wieruch',
        messageIds: [1],
    },
    2: {
        id: '2',
        firstname: 'Dave',
        lastname: 'Davids',
        messageIds: [2]
    },
};

let messages = {

    1: {
        id: '1',
        text: 'Hello world',
        userId: '1'
    },
    2: {
        id: '2',
        text: 'By world',
        userId: '2'
    },
}

const typeDefs = gql`
    type Query {
        me: User
        users: [User!]
        user(id: ID!): User
        messages: [Message!]!
        message(id: ID!): Message!
    }
    type User {
    id: ID!
    username: String!
    messages: [Message!]
    }
    
    type Message {
    id: ID!
    text: String!
    user: User!
    }
    
    type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean!
    }
`;

const me = users[1];
const resolvers = {
    Query: {
        me: (parent, args, {me}) => {
            return me;

        },
        user: (parent, {id}) => {
            return users[id];
        },
        users: () => {
            return Object.values(users);
        },
        messages: () => {
            return Object.values(messages);
        },
        message: (parent, {id}) => {
            return messages[id];
        }

    },

    Mutation: {
        createMessage: (parent, {text}, {me}) => {
            const id = uuidv4();
            const message = {
                text,
                id,
                userId: me.id,
            };
            message[id] = message;
            users[me.id].messageIds.push(id);
            return message;
        },
        deleteMessage: (parent, {id}) => {
            const {[id]: message, ...otherMessages} = messages;
            if(!message) {
                return false;
            }
            messages=otherMessages;
            return true;
        }
    },

    User: {
        messages: user => {
            return Object.values(messages).filter(message=> message.userId === user.id)
        }
    },
    Message: {
        user: message => {
            return users[message.userId]
        }
    }
};
const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: {
        me: users[1],
    },

});

server.applyMiddleware({app});

app.post('/file', function (req, res, next) {
    console.log('asasas');
    const form = new multiparty.Form();

    form.on('error', (err) => {
        res.status(400);
        next(err);
    });

    form.on('part', async (part) => {
        try {
            console.log('part ', await part);
            res.send(part)
        } catch (e) {
            console.error(e)
        }
    });
    form.parse(req)
});

app.listen({port: 4005}, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`));