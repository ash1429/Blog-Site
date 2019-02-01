var middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    // req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

middlewareObj.checkUsersPostOwnership = function (req, res, next) {
    if(req.isAuthenticated()){
        if (req.user._id.equals(req.params.id_user)) {
            next();
        }
        else{
            res.send("You are not authorized");
        }
            

    }else{
        res.send("You need to log in first");
    }
}


module.exports = middlewareObj;