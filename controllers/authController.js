const db = require("../database/db");

exports.showLanding = (req, res) => {
    res.render("landing");
};

exports.showLogin = (req, res) => {
    const type = req.query.type;

    res.render("login", { type });
};

exports.showSignup = (req, res) => {

    const type = req.query.type;

    // Staff signup needs hospitals list
    if (type === "staff") {

        const query = `
            SELECT id, name
            FROM hospitals
            ORDER BY name
        `;

        db.query(query, (error, hospitals) => {

            if (error) {
                console.log(error);
                return res.send("Database error");
            }

            res.render("signup", {
                type,
                hospitals
            });

        });

        return;
    }

    // Patient signup does not need hospitals
    res.render("signup", {
        type,
        hospitals: []
    });

};

exports.login = (req, res) => {
    res.send("Login not implemented yet");
};

exports.signup = (req, res) => {
    res.send("Signup not implemented yet");
};