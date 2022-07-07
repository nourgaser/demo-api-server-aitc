const bcrypt = require('bcrypt');

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.sendStatus(401);
};

const generatePassword = (password, cb) => {
  bcrypt.hash(password, 10, cb);
};

module.exports = {ensureAuthenticated, generatePassword};
