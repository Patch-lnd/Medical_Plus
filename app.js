const express = require("express")
const session = require("express-session")
const path = require("path")

// Routes
const authRoutes = require("./routes/auth");
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

app.use(
    session({
        secret: "hospital_secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 2*60*60*1000
            // 2hours
        }
    })
)

app.use("/", authRoutes);

app.get("/", (req, res)=>{
    res.render("login");
})

app.get("/dashboard", isAuthenticated, (req, res)=>{
    res.render("dashboard", {user: req.session.user});
});

app.listen(3000, ()=>{
    console.log("Serveur démaré sur le port 3000")
});