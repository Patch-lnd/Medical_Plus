const express = require("express")
const session = require("express-session")
const path = require("path")

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

app.get("/", (req, res)=>{
    res.render("login");
})

app.listen(3000, ()=>{
    console.log("Serveur démaré sur le port 3000")
});