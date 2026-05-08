import dotenv from 'dotenv'
import path from 'path'
import Database from 'better-sqlite3'

dotenv.config()

const DB_PATH = path.join(__dirname, '../database.sqlite')
const db = new Database(DB_PATH)

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

db.exec('DELETE FROM bookings')
db.exec('DELETE FROM experts')

const insert = db.prepare(
  'INSERT INTO experts (name, category, experience, rating, slots) VALUES (?, ?, ?, ?, ?)'
)

const experts = [
  {
    name: 'John Doe',
    category: 'Finance',
    experience: 10,
    rating: 4.5,
    slots: [
      { date: '2026-05-10', time: '10:00 AM' },
      { date: '2026-05-10', time: '2:00 PM' },
      { date: '2026-05-11', time: '11:00 AM' }
    ]
  },
  {
    name: 'Jane Smith',
    category: 'Health',
    experience: 8,
    rating: 4.8,
    slots: [
      { date: '2026-05-10', time: '9:00 AM' },
      { date: '2026-05-11', time: '1:00 PM' }
    ]
  },
  {
    name: 'Bob Wilson',
    category: 'Tech',
    experience: 12,
    rating: 4.3,
    slots: [
      { date: '2026-05-10', time: '3:00 PM' },
      { date: '2026-05-11', time: '10:00 AM' }
    ]
  }
]

const insertMany = db.transaction((items: typeof experts) => {
  for (const e of items) {
    insert.run(e.name, e.category, e.experience, e.rating, JSON.stringify(e.slots))
  }
})

insertMany(experts)

console.log('Seed data inserted')
process.exit(0)
