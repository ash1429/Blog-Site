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


//=======
//CLEAN UP
//=======
// Post.deleteMany({},(err,data)=>{
//   if (err) console.log(err);
//   else{
//     console.log('cleaned Post data');
    
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
  Post.find({}, (err, blogData)=>{
    if(err) console.log(err);
    else{
      res.render("posts/index",{ v_blogData: blogData });
    }
    
  });
});

app.get("/posts", function (req, res) {
  res.redirect("/");
});

app.post("/posts", function (req, res) {
  // console.log(req.body.blog);
  Post.create(req.body.blog, (err, blogData)=>{
    if(err) console.log(err);
    else{
      res.redirect('/');
    }    
  });
});

app.get("/posts/new", function (req, res) {
  res.render("posts/new");
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

app.get("/login", function (req, res) {
  res.render("login");
});


app.listen(3000, () => {
  console.log("Server is running");
});


