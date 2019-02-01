var express = require("express");
var router = express.Router({ mergeParams: true });
var passport = require("passport");
var middleware = require('../middleware');
var User = require('../models/user');
var Post = require('../models/post');
var Comment = require('../models/comment');



router.get("/", function (req, res) {
  Post.findOne({ '_id': req.params.id_post }).populate("comments").exec((err, post) => {
    if (err) console.log(err);
    else {
      res.render("posts/show", { v_post: post });
    }
  });
});


router.get("/comments/new", function (req, res) {
  res.render("comments/new", { id: req.params.id_post });
});

router.post("/comments", function (req, res) {
  Post.findOne({'_id': req.params.id_post}, (err, post) => {
    if (err) console.log(err);
    else {
      // console.log(post);
      // console.log(req.body.comment);
      Comment.create(req.body.comment, (err, createdComment) => {
        if (err) {
          console.log(err);
        } else {
          // console.log(createdComment);
          post.comments.push(createdComment);
          post.save((err, commentedPost) => {
            if (err) console.log(err);
            else {
              // console.log(commentedPost);
              res.redirect("/posts/" + req.params.id_post);
            }
          });
        }
      });
    }
  });
});

router.get("/:id_user/:id_comment/delete", middleware.checkUsersPostOwnership, function (req, res) {
  // res.send("deleting..." + req.params.id_comment);
  Comment.findOneAndRemove({ '_id': req.params.id_comment}, (err, comment)=>{
    if(err) console.log(err);
    else{
      res.redirect("/posts/" + req.params.id_post);
    }
  });
});
module.exports = router;