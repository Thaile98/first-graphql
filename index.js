import gql from 'graphql-tag';
import express from 'express';
import { merge } from 'lodash';
import depthLimit from 'graphql-depth-limit'
import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import {applyMiddleware} from "graphql-middleware";
import { GraphQLDate, GraphQLDateTime, GraphQLTime } from 'graphql-iso-date';
import GraphQLJSON, { GraphQLJSONObject } from 'graphql-type-json';
import {typeDef as Author, resolvers as authorResolvers,} from './type/author.js';
import {typeDef as Book, resolvers as bookResolvers,} from './type/book.js';
import { permissions } from "./permission/permission";
import {validators} from "./validation/validation";

const port = process.env.PORT || 8080;

// Define APIs using GraphQL SDL
const typeDefs = [gql`
   scalar Date
   scalar Time
   scalar DateTime
   scalar JSON
   scalar JSONObject
   
   type Query {
       sayHello(name: String!): JSON!
   }
   
   type Mutation {
       sayHello(name: String!): String!
       signup(input:SignUpInput): String!
   }
   
   input SignUpInput {
        email:String!,
        password:String!,
        rePassword:String!
   }
`, Author, Book];

// Define resolvers map for API definitions in SDL
const resolvers = merge({
    Date: GraphQLDate,
    Time: GraphQLTime,
    DateTime: GraphQLDateTime,
    JSON: GraphQLJSON,
    JSONObject: GraphQLJSONObject,

    Query: {
        sayHello: (obj, args, context, info) => {
            return context;
        },
    },

    Mutation: {
        sayHello: (obj, args, context, info) => {
            return `Hello ${ args.name }!`;
        }
    }
}, bookResolvers, authorResolvers);

// Configure express
const app = express();

// Build GraphQL schema based on SDL definitions and resolvers maps
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Build Apollo server
const schemaWithMiddleware = applyMiddleware(schema, validators, permissions);

// Build Apollo server
const apolloServer = new ApolloServer({ schema : schemaWithMiddleware, validationRules: [ depthLimit(10) ],
    context: ({ req, res }) => {
        const context = {};

        // Verify jwt token
        const parts = req.headers.authorization ? req.headers.authorization.split(' ') : [''];
        const token = parts.length === 2 && parts[0].toLowerCase() === 'bearer' ? parts[1] : undefined;
        context.authUser = token ? token : undefined;

        return context;
    }
});
apolloServer.applyMiddleware({ app });

// const apolloServer = new ApolloServer({
//     schema,
//
//     context: ({ req, res }) => {
//         const context = {};
//
//         // Verify jwt token
//         const parts = req.headers.authorization ? req.headers.authorization.split(' ') : [''];
//         const token = parts.length === 2 && parts[0].toLowerCase() === 'bearer' ? parts[1] : undefined;
//         context.authUser = token ? token : undefined;
//
//         return context;
//     }
// });
// apolloServer.applyMiddleware({ app });


// Run server
app.listen({ port }, () => {
    console.log(`🚀Server ready at http://localhost:${ port }${ apolloServer.graphqlPath }`);
});