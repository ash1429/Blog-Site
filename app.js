var bodyParser  = require("body-parser"),
    flash       = require("connect-flash"),
    express     = require("express"),
    app         = express(),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local");

var User = require('./models/user'),
    Post = require('./models/post'),
    Comment = require('./models/comment');

var middleware = require("./middleware");


//=======
//CLEAN UP
//=======
// Post.deleteMany({},(err,data)=>{
//   if (err) console.log(err);
//   else{
//     console.log('cleaned Post data');
    
//   }
// });

// User.deleteMany({},(err,data)=>{
//   if (err) console.log(err);
//   else{
//     console.log('cleaned User');
    
//   }
// });




// var middleware = require('./middleware');


const url = 'mongodb://localhost:27017/simpleBlog';
mongoose.connect(url, { useNewUrlParser: true }, function (err) {
  if (!err) {
    console.log("connected to db");
  }
  else {
    console.log(err);
  }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(flash());

app.use(require("express-session")({
    secret: "123456",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ================
//Locals
// ================
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.flashMessageError = req.flash("error");
  res.locals.flashMessageSuccess = req.flash("success");
  next();
});

// ================
//Routes
// ================
app.get("/", function (req, res) {
  res.redirect("/posts");

});

app.get("/posts",function (req, res) {
  Post.find({}, (err, blogData) => {
    if (err) console.log(err);
    else {
      res.render("posts/index", { v_blogData: blogData });
    }
  });
});

app.post("/posts",middleware.isLoggedIn, function (req, res) {
  var title = req.body.blog.title;
  var description = req.body.blog.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }

  var newPost = { title: title, description: description, author: author };
  // console.log(newPost);
  
  // res.send("posting");
  // console.log(req.body);

  Post.create(newPost, (err, blogData)=>{
    if(err) console.log(err);
    else{
      console.log(newPost);
      res.redirect('/');
    }    
  });
});

app.get("/posts/new", middleware.isLoggedIn, function (req, res) {
  res.render("posts/new");
});


app.get("/posts/:username/:id_user/", middleware.isLoggedIn, function (req, res) {
  // res.send(req.params.id_user);
  if(req.user._id.equals(req.params.id_user)){
    Post.find({ 'author.id': req.params.id_user }, (err, posts) => {
      if (err) {
        console.log(err);
        res.send(err);
      }
      else {
        // console.log(posts);
        res.render("posts/owned", { v_posts: posts });

      }
    });
  }
  else{
    res.send('You are not authorized');
  }
});

app.get("/posts/:id_post", function (req, res) {
  Post.findById(req.params.id_post).populate("comments").exec((err,post)=>{
    if(err) console.log(err);
    else {
      // console.log(post);
      res.render("posts/show", {v_post : post});
    }
  });
});


app.get("/posts/:id_post/comments/new", function (req, res) {
  res.render("comments/new",{id: req.params.id_post});
});

app.post("/posts/:id_post/comments", function (req, res) {
  Post.findById(req.params.id_post, (err, post)=>{
    if (err) console.log(err);
    else {
      // console.log(post);
      // console.log(req.body.comment);
      Comment.create(req.body.comment, (err, createdComment)=>{
        if (err) {
          console.log(err);
        }else{
          // console.log(createdComment);
          post.comments.push(createdComment);
          post.save((err, commentedPost)=>{
            if (err) console.log(err);
            else{
              // console.log(commentedPost);
              res.redirect("/posts/" + req.params.id_post);
            }
          });
        }
      });
    }
  });
});
app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
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

app.get("/login", function (req, res) {
  res.render("login");
});

app.post("/login", passport.authenticate("local",
  {
    successRedirect: "/posts",
    failureRedirect: "/login"
  }), function (req, res) {
  });

app.get("/logout", function (req, res) {
  req.logout();
  // req.flash("success", "Logged you out!");
  res.redirect("/posts");
});

app.listen(3000, () => {
  console.log("Server is running");
});


