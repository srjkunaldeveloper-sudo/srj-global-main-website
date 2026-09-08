require('dotenv').config();
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "srj_db",
  waitForConnections: true,
  connectionLimit: 10,
});

async function checkAndCreate() {
  try {
    const promisePool = pool.promise();
    
    // Jobs table
    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        experience VARCHAR(100) NOT NULL,
        type VARCHAR(100) NOT NULL,
        salary VARCHAR(100) NOT NULL,
        category VARCHAR(100) NOT NULL,
        tags TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    
    // Job applications table
    await promisePool.query(`
      CREATE TABLE IF NOT EXISTS job_applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        job_title VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log("Tables 'jobs' and 'job_applications' checked/created successfully.");
  } catch (error) {
    console.error("Error checking/creating tables:", error);
  } finally {
    pool.end();
  }
}

checkAndCreate();
