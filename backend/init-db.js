require("dotenv").config();
const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

async function initDatabase() {
  const connectionConfig = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
  };

  console.log(`Connecting to MySQL server at ${connectionConfig.host}...`);
  
  let connection;
  try {
    connection = await mysql.createConnection(connectionConfig);
    console.log("Connected to MySQL server successfully.");

    const schemaPath = path.join(__dirname, "schema.sql");
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`schema.sql not found at: ${schemaPath}`);
    }

    const sqlContent = fs.readFileSync(schemaPath, "utf8");
    
    // Split SQL file by semicolon, ignoring comments and empty lines
    const statements = sqlContent
      .split(/;\s*$/m)
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`Executing ${statements.length} SQL statements...`);

    for (let statement of statements) {
      // Basic logging of the statement being run
      const firstLine = statement.split("\n")[0];
      console.log(`Running: ${firstLine}...`);
      await connection.query(statement);
    }

    console.log("Database initialized successfully!");

    // Seed initial Super Admin user if no super_admin account exists
    const [superRows] = await connection.query("SELECT COUNT(*) as count FROM `srj_db`.`users` WHERE role = 'super_admin'");
    if (superRows[0].count === 0) {
      const superEmail = process.env.SUPERADMIN_EMAIL || "superadmin@srjglobal.com";
      const superPassword = process.env.SUPERADMIN_PASSWORD;
      
      if (superPassword) {
        const bcrypt = require("bcryptjs");
        const hash = await bcrypt.hash(superPassword, 10);
        await connection.query(
          "INSERT INTO `srj_db`.`users` (name, email, password, role, is_active) VALUES (?, ?, ?, ?, ?)",
          ["Super Admin", superEmail, hash, "super_admin", 1]
        );
        console.log(`Initialized Super Admin account for: ${superEmail}`);
      } else {
        console.log("Notice: SUPERADMIN_PASSWORD env var not provided; initial Super Admin creation deferred to manual setup or .env configuration.");
      }
    }
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initDatabase();
