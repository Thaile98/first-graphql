import {allow, rule, shield} from "graphql-shield";

const isAuthorized = rule()(
    (obj, args, { authUser }, info) => authUser === 'ABC123'
);

export const permissions = shield({
    Query: {
        '*': isAuthorized,
        sayHello: isAuthorized,
        book: allow,
        books: allow,
        author: allow,
    },

    Mutation: {
        '*': isAuthorized,
        sayHello: allow,
    }
}, { allowExternalErrors: true });