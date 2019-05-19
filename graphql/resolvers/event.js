const { Event, User } = require('../../models');
const userResolver = require('./user');

/*
  Fetch a single event by id.
*/
module.exports.singleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    return {
      ...event._doc,
      creator: userResolver.user.bind(this, event._doc.creator),
    };
  } catch (err) {
    throw err;
  }
};

/*
  Fetch all events based on an array of ids.
*/
module.exports.events = eventIds => Event.find({ _id: { $in: eventIds } })
  .then(res => res.map(event => ({
    ...event._doc,
    date: new Date(event._doc.date).toISOString(),
    creator: userResolver.user.bind(this, event._doc.creator),
  }))).catch((err) => { throw err; });

/*
  Get all events from the db.
*/
module.exports.getEvents = () => Event.find()
  .then(res => res.map(event => ({
    ...event._doc,
    date: new Date(event._doc.date).toISOString(),
    creator: userResolver.user.bind(this, event._doc.creator),
  }))).catch((err) => { throw err; });

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

      return {
        ...res._doc,
        date: new Date(res._doc.date).toISOString(),
        creator: userResolver.user.bind(this, res.creator),
      };
    })
    .catch((err) => { throw err; });
};
