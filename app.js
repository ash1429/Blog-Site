//npm packages
var bodyParser    = require("body-parser"),
    flash         = require("connect-flash"),
    express       = require("express"),
    app           = express(),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local");

//models
var User    = require('./models/user'),
    Post    = require('./models/post'),
    Comment = require('./models/comment');

//routers
var indexRouter       = require('./routes/indexRouter'),
    postRouter        = require('./routes/postRouter'),
    commentRouter     = require('./routes/commentRouter'),
    userProfileRouter = require('./routes/userProfileRouter');

    
var middleware = require("./middleware");

// ================
//To clean up data
// ================
var cleanUp    = require("./cleanUp");
// cleanUp.post();
// cleanUp.user();

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

app.use('/', indexRouter);
app.use('/posts/', postRouter);
app.use('/posts/:id_post/', commentRouter);
app.use('/posts/:username/:id_user', userProfileRouter);


app.listen(5000, () => {
  console.log("Server is running");
});


