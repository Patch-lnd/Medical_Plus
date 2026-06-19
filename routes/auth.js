const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const db = require("../database/db");

// Display login page
router.get("/login", (req, res)=>{
    res.render("login");
});

// Handle login form submission
router.post("/login", (req, res)=>{
    const { identifier, password } = req.body;  

        // Search by email or phone number
    const sql = 'SELECT * FROM users WHERE email = ? OR phone = ?';
    db.query(
        sql, [identifier, identifier], 
        async(error, results)=>{
            if(err){
                console.log(err);
                return res.send("Databse Error");
            }
        
        // User Nont Foud 
        if(results.length === 0){
            return res.send("Invalid credidentails");
        }
        
        const user = results[0];
        // Compare entred password wit stred password has
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.send("Invalid credentials"); 
        }

        // Store user information inside session 
        req.session.user = {
            id: user.id,
            role: user.role,
            email: user.email,
            phone: user.phone
        };
        // Rediect authenticated user 
        res.redirect("/dashboard");
    });
});

module.exports = router;