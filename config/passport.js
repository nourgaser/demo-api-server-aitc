const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const User = require("../models/User");

const invalidCredentialsMsg = "Wrong username or password.";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    (email, password, done) => {
      User.findOne({
        email: email.toLowerCase(),
      })
        .then((user) => {
          if (!user) {
            return done(null, false, {
              message: invalidCredentialsMsg, //email not found in db
            });
          }
          //TODO: check !user.password, maybe user connected using OAuth and has no password.
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) return done(null, user);
            else return done(null, false, { message: invalidCredentialsMsg }); //wrong password
          });
        })
        .catch((err) => {
          console.log(err);
          done(err);
        });
    }
  )
);

passport.serializeUser((user, done) => {
  return done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

module.exports = passport;
