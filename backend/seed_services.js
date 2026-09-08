const fs = require('fs');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: './.env' });

async function seed() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_password || process.env.DB_PASSWORD, // Handle case
      database: process.env.DB_NAME,
    });

    console.log("Connected to DB.");

    const data = fs.readFileSync('../src/data/servicesData.js', 'utf-8');
    
    // Example: { title: "Website Designing", description: "...", icon: Laptop, image: "..." }
    const regex = /{ title: "([^"]+)", description: "([^"]+)", icon: ([a-zA-Z]+)(?:, image: "([^"]+)")? }/g;
    
    // id: "software-development",
    const catRegex = /id: "([^"]+)",[\s\S]*?services: \[([\s\S]*?)\]/g;
    
    let match;
    while ((match = catRegex.exec(data)) !== null) {
      const categoryId = match[1];
      const servicesBlock = match[2];
      
      let serviceMatch;
      while ((serviceMatch = regex.exec(servicesBlock)) !== null) {
        const title = serviceMatch[1];
        const description = serviceMatch[2];
        const icon = serviceMatch[3];
        const image = serviceMatch[4] || null;
        
        console.log(`Inserting: ${title} in ${categoryId}`);
        
        const [rows] = await connection.execute('SELECT id FROM services WHERE title = ?', [title]);
        if (rows.length === 0) {
          await connection.execute(
            'INSERT INTO services (title, short_description, full_description, icon, image, category_id) VALUES (?, ?, ?, ?, ?, ?)',
            [title, description, description, icon, image, categoryId]
          );
        }
      }
    }

    console.log("Seeding complete.");
    await connection.end();
  } catch (error) {
    console.error("Error during seeding:", error);
  }
}

seed();
