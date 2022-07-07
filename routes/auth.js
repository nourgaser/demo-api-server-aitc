const router = require("express").Router();
const User = require("../models/User")
const passport = require('../config/passport');

//Tools
const { ensureAuthenticated, generatePassword } = require('../modules/auth-tools');

router.post("/register", (req, res) => {
  if (req.isAuthenticated()) return res.send({message:"Already logged in."});

  generatePassword(req.body.password, (err, hash) => {
    if (err) {
      return res.status(500).send(err);
    }
    let user = new User({
      username: req.body.username,
      password: hash,
      email: req.body.email
    });
    user.save((err) => {
      if (err) {
        console.log(err)
        return res.status(500).send(err); //db error 
      };
      console.log("New user registered.");
      // res.status = 200;
      res.status(200).json({
        message: "New user registered.",
      });
    });
  });
});

router.post("/login", (req, res) => {
  if (req.isAuthenticated()) return res.send({message:"Already logged in."});

  passport.authenticate("local", (err, user) => {
    if (err) return res.status(500).json(err);
    if (!user) return res.status(401).send({});

    req.logIn(user, (err) => {
      if (err) return res.status(500).send(err);

      console.log(`${req.user.username} logged in.`);
      res.status(200).json({ message: `${req.user.username} logged in.` });
    });
  })(req, res);
});

router.post("/logout", ensureAuthenticated, (req, res) => {
  req.logout();
  res.send({message:"Logged out."});
});

router.get("/testauth", ensureAuthenticated, (req, res) => {
  res.send({message:`Welcome, ${req.user.username}!`});
});

module.exports = router;