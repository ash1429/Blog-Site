var express = require("express");
var router = express.Router({ mergeParams: true });
var passport = require("passport");
var middleware = require('../middleware');
// var User = require('../models/user');
var Post = require('../models/post');

router.get("/", middleware.isLoggedIn, middleware.checkUsersPostOwnership ,function (req, res) {
  // res.send(req.params.id_user);
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

});

router.get("/edit/:id_post", middleware.isLoggedIn, middleware.checkUsersPostOwnership, function (req, res) {
  Post.findById(req.params.id_post, (err, foundPost)=>{
    if(err) console.log(err);
    else{
      res.render("posts/edit", { v_post: foundPost, referer: req.headers.referer});
    }
    
  });
});


router.post("/edit/:id_post", middleware.isLoggedIn, middleware.checkUsersPostOwnership, function (req, res) {
  var title = req.body.blog.title;
  var description = req.body.blog.description;
  var status = req.body.blog.status;
  var author = {
    id: req.user._id,
    username: req.user.username
  }

  var editedPost = { title: title, description: description, status: status, author: author };

  Post.findOneAndUpdate({'_id':req.params.id_post}, editedPost, (err, post)=>{
    if(err) console.log(err);
    else{
      res.redirect(req.body.referer);
      // res.redirect('/posts/' + req.params.username + '/' + req.params.id_user);
    }
    
  });
  
});

router.get("/delete/:id_post", middleware.isLoggedIn, middleware.checkUsersPostOwnership, function (req, res) {

  Post.findOneAndDelete({'_id': req.params.id_post},(err)=>{
    if(err){
      console.log(err);
      res.send(err);
    }
    else{
      res.redirect('/posts/' + req.params.username + '/' + req.params.id_user);
    }
  });
});


// }
///posts/:username/:id_user

module.exports = router;