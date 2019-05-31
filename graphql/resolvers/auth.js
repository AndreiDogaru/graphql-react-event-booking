const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { User } = require('../../models');

/*
  User authentication method
*/
module.exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) { throw new Error('User does not exist'); }

  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) { throw new Error('Password is incorrect'); }

  const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_TOKEN, { expiresIn: '1h' });

  return {
    userId: user._id,
    token,
    tokenExpiration: 1,
  };
};
