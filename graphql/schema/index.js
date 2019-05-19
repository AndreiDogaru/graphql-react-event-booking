const { buildSchema } = require('graphql');

const eventSchema = require('./event');
const userSchema = require('./user');
const bookingSchema = require('./booking');

module.exports = buildSchema(`
  ${eventSchema}
  ${userSchema}
  ${bookingSchema}

  type RootQuery {
    events: [Event!]!
    bookings: [Booking!]!
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
