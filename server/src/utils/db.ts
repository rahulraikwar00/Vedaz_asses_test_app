import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(__dirname, '../../database.sqlite')

let db: Database.Database

export const connectDB = () => {
  if (db) return db

  db = new Database(DB_PATH)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  db.exec(`
    CREATE TABLE IF NOT EXISTS experts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      experience INTEGER NOT NULL,
      rating REAL NOT NULL,
      slots TEXT NOT NULL
    )
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      expertId INTEGER NOT NULL,
      userName TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      date TEXT NOT NULL,
      timeSlot TEXT NOT NULL,
      notes TEXT,
      status TEXT DEFAULT 'pending',
      FOREIGN KEY(expertId) REFERENCES experts(id)
    )
  `)

  db.exec(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_booking
    ON bookings(expertId, date, timeSlot)
  `)

  console.log('SQLite connected')
  return db
}

export const getDB = () => {
  if (!db) throw new Error('DB not initialized')
  return db
}
