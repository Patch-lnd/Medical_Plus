CREATE TABLE hospitals (

    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    city VARCHAR(100),

    phone VARCHAR(20),

    email VARCHAR(100),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

/* 
    Table users

    Cette table contient TOUS les comptes :

    Super Admin
    Admin
    Doctor
    Nurse
    Receptionist
    Patient
    Pending Staff
 */
 CREATE TABLE users (

    id INT AUTO_INCREMENT PRIMARY KEY,

    hospital_id INT NULL,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(100) UNIQUE,

    phone VARCHAR(20) UNIQUE NOT NULL,

    staff_number VARCHAR(20) UNIQUE NULL,

    password_hash VARCHAR(255) NOT NULL,

    role ENUM(
        'super_admin',
        'admin',
        'doctor',
        'nurse',
        'receptionist',
        'patient',
        'pending'
    ) NOT NULL,

    requested_role ENUM(
        'doctor',
        'nurse',
        'receptionist'
    ) NULL,

    status ENUM(
        'pending',
        'approved',
        'rejected',
        'suspended'
    ) DEFAULT 'pending',

    approved_by INT NULL,

    must_change_password BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (hospital_id)
        REFERENCES hospitals(id),

    FOREIGN KEY (approved_by)
        REFERENCES users(id)

);

CREATE TABLE patients (

    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    patient_number VARCHAR(20) UNIQUE NOT NULL,

    birth_date DATE,

    gender ENUM(
        'male',
        'female'
    ),

    blood_group VARCHAR(5),

    allergies TEXT,

    emergency_contact_name VARCHAR(100),

    emergency_contact_phone VARCHAR(20),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)

);

CREATE TABLE consultations (

    id INT AUTO_INCREMENT PRIMARY KEY,

    patient_id INT NOT NULL,

    doctor_id INT NOT NULL,

    hospital_id INT NOT NULL,

    status ENUM(
        'pending',
        'completed',
        'cancelled'
    ) DEFAULT 'pending',

    consultation_date DATETIME
        DEFAULT CURRENT_TIMESTAMP,

    weight DECIMAL(5,2),

    height DECIMAL(5,2),

    temperature DECIMAL(4,2),

    blood_pressure VARCHAR(20),

    symptoms TEXT,

    diagnosis TEXT,

    analysis_results TEXT,

    treatment TEXT,

    notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (patient_id)
        REFERENCES patients(id),

    FOREIGN KEY (doctor_id)
        REFERENCES users(id),

    FOREIGN KEY (hospital_id)
        REFERENCES hospitals(id)

);

CREATE TABLE password_reset_tokens (

    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    token VARCHAR(255) NOT NULL,

    expires_at DATETIME NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)

);

/* Premier Super Admin */

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
    'System Administrator',
    'admin@hospital.com',
    '670000000',
    'HASH_BCRYPT_ICI',
    'super_admin',
    'approved'
);

INSERT INTO hospitals (name, city, phone, email)
VALUES
(
    'Hopital Central de Yaounde',
    'Yaounde',
    '222230040',
    'contact@hcy.cm'
),
(
    'Hopital General de Yaounde',
    'Yaounde',
    '222211900',
    'contact@hgy.cm'
),
(
    'Hopital Gyneco-Obstetrique et Pediatrique',
    'Yaounde',
    '222317300',
    'contact@hgopy.cm'
),
(
    'Centre Hospitalier Universitaire de Yaounde',
    'Yaounde',
    '222310000',
    'contact@chuy.cm'
),
(
    'Hopital Jamot',
    'Yaounde',
    '222230800',
    'contact@jamot.cm'
);

/* Architecture de Hierarchie des Roles */

/* SUPER ADMIN 
    Créer hôpitaux
    Valider staff
    Modifier tous les rôles
    Gérer tous les hôpitaux
 */

/* ADMIN  
    Valider staff de son hôpital
    Modifier staff de son hôpital
    Gérer patients de son hôpital
*/

/* DOCTOR
    Rechercher patients
    Créer consultations
    Modifier consultations
    Finaliser résultats 
 */

/* NURSE 
    Voir patients
    Voir consultations
    Ajouter observations
*/

/* Réceptioniste
    Créer patient
    Modifier patient
    Donner mot de passe temporaire
 */

/* Patient
    Voir son dossier
    Voir ses consultations
    Changer son mot de passe  
 */