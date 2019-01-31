var Post = require('./models/post');
var User = require('./models/user');

var cleanUp = {};

cleanUp.post = function () {
  Post.deleteMany({}, (err, data) => {
    if (err) console.log(err);
    else {
      console.log('cleaned Post data');

    }
  });
}

cleanUp.user = function () { 
  User.deleteMany({}, (err, data) => {
    if (err) console.log(err);
    else {
      console.log('cleaned User');

    }
  });
}

module.exports = cleanUp;
