const mysql = require("mysql")
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", 
    database: "hospital_db"
});
db.connect((err)=>{
    if(err){
        console.log("Erreur de connexion MYSQL :", err);
        return;
    }
    console.log("Base de données Connecté ✔")
});

module.exports = db;