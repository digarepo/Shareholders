// app/db.server.ts
import dotenv from "dotenv";
import mariadb from "mariadb";

// Load environment variables
dotenv.config();

const pool = mariadb.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Abcd1234@&",
  database: process.env.DB_NAME || "shareholders_db",
  port: Number(process.env.DB_PORT) || 3306,
  connectionLimit: 5,
});

// Generic query function with proper typing
export async function query<T = unknown>(
  sql: string,
  params?: (string | number | boolean | null)[]
): Promise<T[]> {
  let conn;
  try {
    console.log('Getting database connection...');
    conn = await pool.getConnection();
    console.log('Executing query:', sql);
    console.log('With parameters:', params);
    const startTime = Date.now();
    const results: T[] = await conn.query(sql, params);
    const endTime = Date.now();
    console.log(`Query executed in ${endTime - startTime}ms`);
    console.log(`Returned ${results.length} rows`);
    return results;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  } finally {
    if (conn) {
      try {
        conn.release(); // Release connection back to pool
      } catch (e) {
        console.error("Error closing connection:", e);
      }
    }
  }
}

// Type definitions for better maintainability
export interface Shareholder {
  fn_id: string;
  name_amharic: string;
  name_english: string;
  city: string;
  subcity: string;
  wereda: string;
  house_number: string;
  phone_1: string;
  phone_2: string;
  email: string;
  share_will: number;
  nationality: string;
}

// Example usage with proper typing:
// const shareholders = await query<Shareholder>("SELECT * FROM shareholders");
