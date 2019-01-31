var express = require("express");
var router = express.Router({ mergeParams: true });
var passport = require("passport");
var middleware = require('../middleware');
// var User = require('../models/user');
var Post = require('../models/post');

router.get("/", middleware.isLoggedIn, function (req, res) {
  // res.send(req.params.id_user);
  if (req.user._id.equals(req.params.id_user)) {
    Post.find({ 'author.id': req.params.id_user }, (err, posts) => {
      if (err) {
        console.log(err);
        res.send(err);
      }
      else {
        // console.log(posts);
        res.render("profiles/userProfile", { v_posts: posts });

      }
    });
  }
  else {
    res.send('You are not authorized');
  }
});


module.exports = router;