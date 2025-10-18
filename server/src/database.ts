import sqlite3 from 'sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

const dbPath = path.join(__dirname, '..', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Wrapper functions for database operations
const dbRun = (sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

const dbGet = (sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbAll = (sql: string, params: any[] = []): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export interface User {
  id: number;
  username: string;
  password: string;
  email?: string;
  created_at: string;
}

// Initialize database
export const initDatabase = async () => {
  await dbRun(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Check if default user exists
  const existingUser = await dbGet('SELECT * FROM users WHERE username = ?', ['Concho1']);

  if (!existingUser) {
    // Create default user with hashed password
    const hashedPassword = await bcrypt.hash('password', 10);
    await dbRun(
      'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
      ['Concho1', hashedPassword, 'admin@cchddash.com']
    );
    console.log('Default user created: Concho1');
  }
};

export const findUserByUsername = async (username: string): Promise<User | undefined> => {
  return await dbGet('SELECT * FROM users WHERE username = ?', [username]) as User | undefined;
};

export const createUser = async (username: string, password: string, email?: string): Promise<User> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await dbRun(
    'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
    [username, hashedPassword, email]
  );

  const user = await dbGet('SELECT * FROM users WHERE id = ?', [(result as any).lastID]) as User;
  return user;
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export default db;
