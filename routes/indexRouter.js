var express = require("express");
var router = express.Router({ mergeParams: true });
var passport = require("passport");
var middleware = require('../middleware');
var User = require('../models/user');

router.get("/", function (req, res) {
  res.redirect("/posts");
});

router.get("/register", function (req, res) {
  res.render("register");
});

router.post("/register", function (req, res) {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      req.flash("error", err.message);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function () {
      // req.flash("success", "Successfully signed up" + user.username);
      res.redirect("/posts");
    });
  });
});

router.get("/login", function (req, res) {
  res.render("login");
});

router.post("/login", passport.authenticate("local",
  {
    successRedirect: "/posts",
    failureRedirect: "/login"
  }), function (req, res) {
  });

router.get("/logout", function (req, res) {
  req.logout();
  // req.flash("success", "Logged you out!");
  res.redirect("/posts");
});

module.exports = router;