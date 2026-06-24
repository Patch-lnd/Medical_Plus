
exports.showLanding = (req,res) => {
    res.render("landing");
};

exports.showLogin = (req,res) => {
    const type = req.query.type;
    res.render("login",{type});
};

exports.login = (req, res) => {
    res.send("Login not implemented yet");
};

exports.showSignup = (req,res) => {
    const type = req.query.type;
    res.render("signup",{type});
};

exports.signup = (req, res) => {
    res.send("Signup not implemented yet");
};