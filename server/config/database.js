import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dotenv from 'dotenv';
dotenv.config();


// Function to create and return a SQLite database connection
async function createConnection() {
  const db = await open({
    filename: './packets.db',
    driver: sqlite3.Database
  });
  return db;
}

// Export the connection function
const dbConnection = createConnection();
export default dbConnection;