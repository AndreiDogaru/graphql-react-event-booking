const { Booking, Event } = require('../../models');
const eventResolver = require('./event');
const userResolver = require('./user');
const { dateToString } = require('../../helpers/date');

/*
  Transform booking to be sent back to the client via graphql.
*/
module.exports.transformBooking = booking => ({
  ...booking._doc,
  user: userResolver.user.bind(this, booking._doc.user),
  event: eventResolver.singleEvent.bind(this, booking._doc.event),
  createdAt: dateToString(booking._doc.createdAt),
  updatedAt: dateToString(booking._doc.updatedAt),
});

/*
  Get all bookings from the db.
*/
module.exports.getBookings = async (req) => {
  if (!req.isAuth) { throw new Error('Unauthenticated'); }

  try {
    const bookings = await Booking.find();
    return bookings.map(item => module.exports.transformBooking(item));
  } catch (err) {
    throw err;
  }
};

/*
  Create new booking.
*/
module.exports.bookEvent = async (args, req) => {
  if (!req.isAuth) { throw new Error('Unauthenticated'); }

  try {
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: req.userId,
      event: fetchedEvent,
    });
    const result = await booking.save();
    return module.exports.transformBooking(result);
  } catch (err) {
    throw err;
  }
};

/*
  Cancel an existing booking.
*/
module.exports.cancelBooking = async (args, req) => {
  if (!req.isAuth) { throw new Error('Unauthenticated'); }

  try {
    const booking = await Booking.findById(args.bookingId).populate('event');
    const event = await eventResolver.transformEvent(booking.event);
    await Booking.deleteOne({ _id: args.bookingId });
    return event;
  } catch (err) {
    throw err;
  }
};
