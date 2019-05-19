const { Event, User } = require('../../models');
const userResolver = require('./user');
const { dateToString } = require('../../helpers/date');

/*
  Transform event to be sent back to the client via graphql.
*/
module.exports.transformEvent = event => ({
  ...event._doc,
  date: dateToString(event._doc.date),
  creator: userResolver.user.bind(this, event._doc.creator),
});

/*
  Fetch a single event by id.
*/
module.exports.singleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    return module.exports.transformEvent(event);
  } catch (err) {
    throw err;
  }
};

/*
  Fetch all events based on an array of ids.
*/
module.exports.events = eventIds => Event.find({ _id: { $in: eventIds } })
  .then(res => res.map(event => module.exports.transformEvent(event)))
  .catch((err) => { throw err; });

/*
  Get all events from the db.
*/
module.exports.getEvents = () => Event.find()
  .then(res => res.map(event => module.exports.transformEvent(event)))
  .catch((err) => { throw err; });

/*
  Create new event and assign it a creator.
*/
module.exports.createEvent = (args) => {
  const event = new Event({
    title: args.eventInput.title,
    description: args.eventInput.description,
    price: +args.eventInput.price,
    date: new Date(args.eventInput.date),
    creator: '5ce14cf33cdde3686009b212',
  });
  return event.save()
    .then(async (res) => {
      const existingUser = await User.findById(res.creator);
      if (!existingUser) { throw new Error('User does not exist'); }
      existingUser.createdEvents.push(res);
      await existingUser.save();

      return module.exports.transformEvent(res);
    })
    .catch((err) => { throw err; });
};
