const express = require("express")
const session = require("express-session")
const path = require("path")
require("dotenv").config({
    path: "./configs.env"
});

// Routes
const authRoutes = require("./routes/authRoutes");
const isAuthenticated = require("./middleware/authMiddleware");

const app = express();


app.use(express.urlencoded({extended:true}));
app.use(express.json());

// Statit Files 
app.use(
    express.static(
        path.join(__dirname, "public")
    )
);

// EJS configuration 
app.set("view engine", "ejs");

// If behing a proxy server (like when deploying on Cloudfalre, Nginx, Heroku), trust the first proxy
app.set('trust proxy', 1); // 1 Means trust first proxy


app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 2*60*60*1000
            // 2hours
        }
    })
)

app.use("/", authRoutes);

app.get("/dashboard", isAuthenticated, (req, res)=>{
    res.render("dashboard", {user: req.session.user});
});

app.listen(process.env.PORT, ()=>{
    console.log(`Serveur démaré sur le port ${process.env.PORT}`)
});