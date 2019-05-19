const { Booking, Event } = require('../../models');
const eventResolver = require('./event');
const userResolver = require('./user');

/*
  Get all bookings from the db.
*/
module.exports.getBookings = async () => {
  try {
    const bookings = await Booking.find();
    return bookings.map(item => ({
      ...item._doc,
      user: userResolver.user.bind(this, item._doc.user),
      event: eventResolver.singleEvent.bind(this, item._doc.event),
      createdAt: new Date(item._doc.createdAt).toISOString(),
      updatedAt: new Date(item._doc.updatedAt).toISOString(),
    }));
  } catch (err) {
    throw err;
  }
};

/*
  Create new booking.
*/
module.exports.bookEvent = async (args) => {
  try {
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: '5ce14cf33cdde3686009b212',
      event: fetchedEvent,
    });
    const result = await booking.save();
    return {
      ...result._doc,
      user: userResolver.user.bind(this, result._doc.user),
      event: eventResolver.singleEvent.bind(this, result._doc.event),
      createdAt: new Date(result._doc.createdAt).toISOString(),
      updatedAt: new Date(result._doc.updatedAt).toISOString(),
    };
  } catch (err) {
    throw err;
  }
};

/*
  Cancel an existing booking.
*/
module.exports.cancelBooking = async (args) => {
  try {
    const booking = await Booking.findById(args.bookingId).populate('event');
    const event = {
      ...booking.event._doc,
      creator: userResolver.user.bind(this, booking.event._doc.creator),
    };
    await Booking.deleteOne({ _id: args.bookingId });
    return event;
  } catch (err) {
    throw err;
  }
};
