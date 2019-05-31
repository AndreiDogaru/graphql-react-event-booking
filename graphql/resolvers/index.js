const eventResolver = require('./event');
const userResolver = require('./user');
const bookingResolver = require('./booking');
const authResolver = require('./auth');

module.exports = {
  events: () => eventResolver.getEvents(),
  createEvent: (args, req) => eventResolver.createEvent(args, req),

  createUser: args => userResolver.createUser(args),

  bookings: (args, req) => bookingResolver.getBookings(req),
  bookEvent: (args, req) => bookingResolver.bookEvent(args, req),
  cancelBooking: (args, req) => bookingResolver.cancelBooking(args, req),

  login: args => authResolver.login(args),
};
