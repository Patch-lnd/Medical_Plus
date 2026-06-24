const db = require("../database/db");
const bcrypt = require("bcrypt");

// Display landing page
exports.showLanding = (req, res) => {
    res.render("landing");
};

// Display login page
exports.showLogin = (req, res) => {
    const type = req.query.type;
    res.render("login", { type });
};

// Display signup page
exports.showSignup = (req, res) => {
    const type = req.query.type;

    // Staff accounts need the hospitals list
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

            res.render("signup", { type, hospitals });
        });

        return;
    }

    // Patients do not need hospitals
    res.render("signup", {
        type,
        hospitals: []
    });
};

// Create a new account
exports.signup = async (req, res) => {

    const {
        account_type,
        name,
        email,
        phone,
        password,
        confirm_password
    } = req.body;

    // Verify password confirmation
    if (password !== confirm_password) {
        return res.send("Passwords do not match");
    }

    try {

        // Hash password before saving it
        const passwordHash = await bcrypt.hash(password, 10);

        // =========================
        // PATIENT ACCOUNT CREATION
        // =========================
        if (account_type === "patient") {

            const {
                birth_date,
                gender,
                blood_group,
                allergies
            } = req.body;

            const userQuery = `
                INSERT INTO users (
                    hospital_id,
                    name,
                    email,
                    phone,
                    password_hash,
                    role,
                    status
                )
                VALUES (
                    NULL,
                    ?,
                    NULL,
                    ?,
                    ?,
                    'patient',
                    'approved'
                )
            `;

            db.query(
                userQuery,
                [name, phone, passwordHash],
                (error, userResult) => {

                    if (error) {
                        console.log(error);
                        return res.send("Database error");
                    }

                    // Create unique patient number using AUTO_INCREMENT id
                    const patientNumber =
                        "PAT" +
                        String(userResult.insertId).padStart(5, "0");

                    const patientQuery = `
                        INSERT INTO patients (
                            user_id,
                            patient_number,
                            birth_date,
                            gender,
                            blood_group,
                            allergies
                        )
                        VALUES (?, ?, ?, ?, ?, ?)
                    `;

                    db.query(
                        patientQuery,
                        [
                            userResult.insertId,
                            patientNumber,
                            birth_date,
                            gender,
                            blood_group || null,
                            allergies || null
                        ],
                        (error) => {

                            if (error) {
                                console.log(error);
                                return res.send("Database error");
                            }

                            res.send(
                                `Patient account created successfully. Your patient number is ${patientNumber}`
                            );
                        }
                    );
                }
            );

            return;
        }

        // =======================
        // STAFF ACCOUNT CREATION
        // =======================
        if (account_type === "staff") {

            const {
                hospital_id,
                requested_role
            } = req.body;

            // Create staff account in pending state
            const userQuery = `
                INSERT INTO users (
                    hospital_id,
                    name,
                    email,
                    phone,
                    password_hash,
                    role,
                    requested_role,
                    status
                )
                VALUES (
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    'pending',
                    ?,
                    'pending'
                )
            `;

            db.query(
                userQuery,
                [
                    hospital_id,
                    name,
                    email,
                    phone,
                    passwordHash,
                    requested_role
                ],
                (error, userResult) => {

                    if (error) {
                        console.log(error);
                        return res.send("Database error");
                    }

                    // Create unique staff number using AUTO_INCREMENT id
                    const staffNumber =
                        "STF" +
                        String(userResult.insertId).padStart(5, "0");

                    const updateQuery = `
                        UPDATE users
                        SET staff_number = ?
                        WHERE id = ?
                    `;

                    db.query(
                        updateQuery,
                        [
                            staffNumber,
                            userResult.insertId
                        ],
                        (error) => {

                            if (error) {
                                console.log(error);
                                return res.send("Database error");
                            }

                            res.send(
                                `Staff account submitted successfully. Your staff number is ${staffNumber}. Please wait for approval.`
                            );
                        }
                    );
                }
            );

            return;
        }

        res.send("Invalid account type");

    } catch (error) {

        console.log(error);
        res.send("Unexpected server error");

    }
};

// Login will be implemented next
exports.login = (req, res) => {
    res.send("Login coming next");
};