const {
  makeExecutableSchema,
  addMockFunctionsToSchema
} = require('graphql-tools');
const mocks = require('./mocks');
const resolvers = require('./resolvers');

const typeDefs = `
type Author {
  id: Int
  firstName: String
  lastName: String
  posts: [Post]
}
type Post {
  id: Int
  title: String
  text: String
  views: Int
  author: Author
}
type Query {
 author(firstName: String, lastName: String): Author
 post(title: String): Post
 getFortuneCookie: String
}
schema {
 query: Query
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

addMockFunctionsToSchema({ schema, mocks });

module.exports = schema;
