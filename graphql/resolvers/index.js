const eventResolver = require('./event');
const userResolver = require('./user');
const bookingResolver = require('./booking');

module.exports = {
  events: () => eventResolver.getEvents(),
  createEvent: args => eventResolver.createEvent(args),

  createUser: args => userResolver.createUser(args),

  bookings: () => bookingResolver.getBookings(),
  bookEvent: args => bookingResolver.bookEvent(args),
  cancelBooking: args => bookingResolver.cancelBooking(args),
};
