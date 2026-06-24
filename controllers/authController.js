const db = require("../database/db");
const bcrypt = require("bcrypt");

// Display landing page
exports.showLanding = (req, res) => {
    res.render("landing");
};

// Display login page and pass account type
exports.showLogin = (req, res) => {
    const type = req.query.type;
    res.render("login", { type });
};

// Display signup page
exports.showSignup = (req, res) => {
    const type = req.query.type;

    // Staff accounts need hospital selection
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

    // Patients do not need hospitals list
    res.render("signup", {
        type,
        hospitals: []
    });
};

// Generate a patient number like PAT00001
function generatePatientNumber(callback) {
    const query = `SELECT id FROM patients ORDER BY id DESC LIMIT 1`;

    db.query(query, (error, results) => {
        if (error) {
            return callback(error);
        }

        const nextNumber = results[0].total + 1;
        const patientNumber = "PAT" + String(nextNumber).padStart(5, "0");

        callback(null, patientNumber);
    });
}

// Generate a staff number like STF00001
function generateStaffNumber(callback) {
    // Get the most recently created staff account
const query = `SELECT id FROM users WHERE staff_number IS NOT NULL ORDER BY id DESC LIMIT 1`;

    db.query(query, (error, results) => {
        if (error) {
            return callback(error);
        }

        const nextNumber = results[0].total + 1;
        const staffNumber = "STF" + String(nextNumber).padStart(5, "0");

        callback(null, staffNumber);
    });
}

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

    // Ensure both passwords match
    if (password !== confirm_password) {
        return res.send("Passwords do not match");
    }

    try {

        // Hash password before storing it
        const passwordHash = await bcrypt.hash(password, 10);

        // -------------------------
        // PATIENT ACCOUNT CREATION
        // -------------------------
        if (account_type === "patient") {

            const {
                birth_date,
                gender,
                blood_group,
                allergies
            } = req.body;

            generatePatientNumber((error, patientNumber) => {

                if (error) {
                    console.log(error);
                    return res.send("Database error");
                }

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
            });

            return;
        }

        // -----------------------
        // STAFF ACCOUNT CREATION
        // -----------------------
        if (account_type === "staff") {

            const {
                hospital_id,
                requested_role
            } = req.body;

            generateStaffNumber((error, staffNumber) => {

                if (error) {
                    console.log(error);
                    return res.send("Database error");
                }

                const query = `
                    INSERT INTO users (
                        hospital_id,
                        name,
                        email,
                        phone,
                        staff_number,
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
                        ?,
                        'pending',
                        ?,
                        'pending'
                    )
                `;

                db.query(
                    query,
                    [
                        hospital_id,
                        name,
                        email,
                        phone,
                        staffNumber,
                        passwordHash,
                        requested_role
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
            });

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