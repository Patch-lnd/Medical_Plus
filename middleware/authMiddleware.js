// Creating an auth middleware in order to protect dashboard. 

// Check whether a user is authenticated or not.
function isAuthenticated(req, res,next){
    // User not logged in 
    if(!req.session.user){
        return res.redirect("/login");
    }// We continue our exectutions. 
    next();
}

module.experots = isAuthenticated;