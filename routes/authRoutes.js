const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

// Landing page
router.get("/", authController.showLanding);

// Login pages
router.get("/login", authController.showLogin);
router.post("/login", authController.login);

// Signup pages
router.get("/signup", authController.showSignup);
router.post("/signup", authController.signup);

module.exports = router;