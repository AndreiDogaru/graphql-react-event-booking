const { buildSchema } = require('graphql');

const eventSchema = require('./event');
const userSchema = require('./user');

module.exports = buildSchema(`
  ${eventSchema}
  ${userSchema}

  type RootQuery {
    events: [Event!]!
  }

  type RootMutation {
    createEvent(eventInput: EventInput!): Event
    createUser(userInput: UserInput!): User
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
