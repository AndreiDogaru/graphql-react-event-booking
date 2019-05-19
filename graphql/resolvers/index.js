const eventResolver = require('./event');
const userResolver = require('./user');

module.exports = {
  events: () => eventResolver.getEvents(),
  createEvent: args => eventResolver.createEvent(args),

  createUser: args => userResolver.createUser(args),
};
