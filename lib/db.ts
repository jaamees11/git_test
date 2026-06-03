import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

declare global {
  // eslint-disable-next-line no-var
  var __solarDb: Database.Database | undefined
}

function getDb(): Database.Database {
  if (!global.__solarDb) {
    const dataDir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

    const db = new Database(path.join(dataDir, 'leads.db'))
    db.pragma('journal_mode = WAL')
    db.exec(`
      CREATE TABLE IF NOT EXISTS leads (
        id               INTEGER PRIMARY KEY AUTOINCREMENT,
        name             TEXT NOT NULL,
        phone            TEXT NOT NULL,
        email            TEXT NOT NULL,
        suburb           TEXT NOT NULL,
        owns_home        TEXT NOT NULL,
        electricity_bill TEXT NOT NULL,
        roof_type        TEXT NOT NULL,
        timeline         TEXT NOT NULL,
        interested_in_battery TEXT NOT NULL,
        message          TEXT DEFAULT '',
        score            INTEGER NOT NULL,
        grade            TEXT NOT NULL,
        created_at       TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
      )
    `)
    global.__solarDb = db
  }
  return global.__solarDb
}

export default getDb
