const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  req.isAuth = false;

  if (!authHeader) { return next(); }

  const token = authHeader.split(' ')[1]; // Bearer token_value
  if (!token || token === '') { return next(); }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_TOKEN);
  } catch (err) {
    return next();
  }

  if (!decodedToken) { return next(); }

  req.isAuth = true;
  req.userId = decodedToken.userId;

  return next();
};
