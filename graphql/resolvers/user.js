const bcrypt = require('bcryptjs');

const { User } = require('../../models');
const eventResolver = require('./event');

/*
  Get used by id.
*/
module.exports.user = userId => User.findById(userId)
  .then(res => ({
    ...res._doc,
    createdEvents: eventResolver.events.bind(this, res._doc.createdEvents),
  })).catch((err) => { throw err; });

/*
  Create new user.
*/
module.exports.createUser = async (args) => {
  let existingUser = await User.findOne({ email: args.userInput.email });
  if (existingUser) { throw new Error('Email already in use'); }

  const hashedPass = await bcrypt.hash(args.userInput.password, 12);
  existingUser = new User({
    email: args.userInput.email,
    password: hashedPass,
  });
  return existingUser.save()
    .then(res => ({ ...res._doc }))
    .catch((err) => { throw err; });
};
