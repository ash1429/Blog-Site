var express = require("express");
var router = express.Router({ mergeParams: true });
var passport = require("passport");
var middleware = require('../middleware');
var User = require('../models/user');
var Post = require('../models/post');

router.get("/", function (req, res) {
  Post.find({'status': 'publish'}, (err, blogData) => {
    if (err) console.log(err);
    else {
      res.render("posts/index", { v_blogData: blogData });
    }
  });
});

router.post("/", middleware.isLoggedIn, function (req, res) {
  var title = req.body.blog.title;
  var description = req.body.blog.description;
  var status = req.body.blog.status;
  var author = {
    id: req.user._id,
    username: req.user.username
  }

  var newPost = { title: title, description: description, status: status, author: author };

  Post.create(newPost, (err, blogData) => {
    if (err) console.log(err);
    else {
      res.redirect('/');
    }
  });
});

router.get("/new", middleware.isLoggedIn, function (req, res) {
  res.render("posts/new");
});


module.exports = router;
