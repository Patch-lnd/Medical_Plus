CREATE TABLE users(
    id INT AUTO_INCREMENT PRIMARY KEY, 
    role ENUM(
        'admin',
        'doctor',
        'nurse',
        'receptionist',
        'patient'
    ) NOT NULL, 
    email VARCHAR(100) UNIQUE, 
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE patients(
    id INT AUTO_INCREMENT PRIMARY KEY, 
    user_id INT NOT NULL,
    patient_number VARCHAR(20) UNIQUE NOT NULL, 
    phone VARCHAR(20),
    first_name VARCHAR(100) NOT NULL, 
    last_name VARCHAR(100) NOT NULL, 
    gender ENUM(
        'male',
        'female'
    )NOT NULL, 
    birtht_date DATE, 
    blood_group VARCHAR(5),
    allergies TEXT,
    created_at TIMESTAMP DEFAULT CURRENT TIMSTAMP,
    FOREIGN KEY(user_id) REFERENCES user(id)
);

CREATE TABLE consultations(
    id INT AUTO_INCREMEMNT PRIMARY KEY,
    patient_id INT NOT NULL, 
    doctor_id INT NOT NULL, 
    consultation_date DATETIME DEFAULT CURRENT_TIMESTAMP, 
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    temperature DECIMAL(4,2),
    blood_presure VARCHAR(20);
    symptoms TEXT, 
    diagnosis TEXT,
    analysis_results TEXT, 
    treatement TEXT, 
    notes TEXT, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY(doctor_id) REFERENCES users(id)
);