const { buildSchema } = require('graphql');

const eventSchema = require('./event');
const userSchema = require('./user');
const bookingSchema = require('./booking');
const authDataSchema = require('./authData');

module.exports = buildSchema(`
  ${eventSchema}
  ${userSchema}
  ${bookingSchema}
  ${authDataSchema}

  type RootQuery {
    events: [Event!]!
    bookings: [Booking!]!
    login(email: String!, password: String!): AuthData!
  }

  type RootMutation {
    createEvent(eventInput: EventInput!): Event
    createUser(userInput: UserInput!): User
    bookEvent(eventId: String!): Booking
    cancelBooking(bookingId: String!): Event
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
