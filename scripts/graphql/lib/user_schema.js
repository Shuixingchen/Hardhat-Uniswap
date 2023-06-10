import { buildSchema } from 'graphql';


const user_schema = buildSchema(`
  type Query {
    hello: String
    user(id: ID!): User
  }
  type User {
    id: ID
    name: String
    age: Int
    email: String
    posts: [Post]
  }
  type Post {
    id: ID
    title: String
    content: String
  }
`);


export default {user_schema}