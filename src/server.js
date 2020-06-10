const express = require('express');
const expressGraphQL = require('express-graphql');
const { GraphQLSchema } = require('graphql');
const { RootQueryType, RootMutationType } = require('./graphql');

const app = express();

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

const graphql = expressGraphQL({ schema, graphiql: true });

app.use('/graphql', graphql);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => { console.log(`GraphQL server is running on http://localhost:${PORT}`)});
