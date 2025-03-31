const mysql = require('mysql2/promise');
const fs = require('fs').promises;

async function initDatabase() {
    let connection;
    try {
        // First create connection without database
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            multipleStatements: true
        });

        console.log('Connected to MySQL server...');

        // Read the SQL file
        const sqlFile = await fs.readFile('Normalized Schema.sql', 'utf8');

        // Execute the SQL commands
        console.log('Executing SQL commands...');
        await connection.query(sqlFile);

        console.log('Database initialization completed successfully!');

    } catch (error) {
        console.error('Error initializing database:', error);
        if (error.sqlMessage) {
            console.error('SQL Error:', error.sqlMessage);
        }
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed.');
        }
    }
}

initDatabase(); 