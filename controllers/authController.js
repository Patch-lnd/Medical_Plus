
exports.showLanding = (req,res) => {
    res.render("landing");
};

exports.showLogin = (req,res) => {
    const type = req.query.type;
    res.render("login",{type});
};

exports.showSignup = (req,res) => {
    const type = req.query.type;
    res.render("signup",{type});
};