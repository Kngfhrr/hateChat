const express = require('express');
const {ApolloServer, gql} = require('apollo-server-express');
const multiparty = require('multiparty');
var cors = require('cors');
var bodyParser = require("body-parser");
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());



const typeDefs = gql`
    type Query {
        hello: String
    }
`;


const resolvers = {
    Query: {
        hello: () => 'Hello world!',
    },
};


const server = new ApolloServer({typeDefs, resolvers});


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

app.listen({port: 4003}, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`));