import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data.db');

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma('journal_mode = WAL');
    _db.pragma('foreign_keys = ON');
    initSchema(_db);
  }
  return _db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS commerces (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT    NOT NULL,
      slug        TEXT    UNIQUE NOT NULL,
      address     TEXT    DEFAULT '',
      phone       TEXT    DEFAULT '',
      ssid        TEXT    NOT NULL,
      password    TEXT    NOT NULL,
      wifi_type   TEXT    DEFAULT 'WPA',
      active      INTEGER DEFAULT 1,
      created_at  TEXT    DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS scans (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      commerce_id INTEGER NOT NULL,
      consented   INTEGER DEFAULT 0,
      ip          TEXT    DEFAULT '',
      scanned_at  TEXT    DEFAULT (datetime('now')),
      FOREIGN KEY (commerce_id) REFERENCES commerces(id) ON DELETE CASCADE
    );
  `);
}

export type Commerce = {
  id: number;
  name: string;
  slug: string;
  address: string;
  phone: string;
  ssid: string;
  password: string;
  wifi_type: string;
  active: number;
  created_at: string;
};

export type Scan = {
  id: number;
  commerce_id: number;
  consented: number;
  ip: string;
  scanned_at: string;
};
