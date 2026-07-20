import * as SQLite from 'expo-sqlite';

import { ExportBundle, LearningItem, Profile } from './types';
import { createId } from './id';

let databasePromise: Promise<SQLite.SQLiteDatabase> | undefined;

async function database() {
  databasePromise ??= SQLite.openDatabaseAsync('japanese-everyday.db');
  const db = await databasePromise;
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS profile (id TEXT PRIMARY KEY NOT NULL, support_language TEXT NOT NULL, starting_comfort TEXT NOT NULL, correction_intensity TEXT NOT NULL, furigana_mode TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS learning_items (id TEXT PRIMARY KEY NOT NULL, kind TEXT NOT NULL, japanese TEXT NOT NULL, reading TEXT, meaning TEXT NOT NULL, notes TEXT, state TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, archived_at TEXT);
    CREATE TABLE IF NOT EXISTS learning_evidence (id TEXT PRIMARY KEY NOT NULL, item_id TEXT NOT NULL, event_type TEXT NOT NULL, confidence REAL NOT NULL, context_type TEXT NOT NULL, occurred_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL);
    CREATE INDEX IF NOT EXISTS learning_items_updated ON learning_items(updated_at);
  `);
  return db;
}

const toProfile = (row: any): Profile => ({ id: 'local', supportLanguage: row.support_language, startingComfort: row.starting_comfort, correctionIntensity: row.correction_intensity, furiganaMode: row.furigana_mode, createdAt: row.created_at, updatedAt: row.updated_at });
const toItem = (row: any): LearningItem => ({ id: row.id, kind: row.kind, japanese: row.japanese, reading: row.reading, meaning: row.meaning, notes: row.notes, state: row.state, createdAt: row.created_at, updatedAt: row.updated_at });

export async function getProfile() { const db = await database(); const row = await db.getFirstAsync<any>('SELECT * FROM profile WHERE id = ?', 'local'); return row ? toProfile(row) : null; }
export async function saveProfile(input: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>) {
  const db = await database(); const now = new Date().toISOString(); const existing = await getProfile();
  await db.runAsync('INSERT OR REPLACE INTO profile (id, support_language, starting_comfort, correction_intensity, furigana_mode, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)', 'local', input.supportLanguage, input.startingComfort, input.correctionIntensity, input.furiganaMode, existing?.createdAt ?? now, now);
  return (await getProfile())!;
}
export async function listItems() { const db = await database(); return (await db.getAllAsync<any>('SELECT * FROM learning_items WHERE archived_at IS NULL ORDER BY updated_at DESC')).map(toItem); }
export async function getItem(id: string) { const db = await database(); const row = await db.getFirstAsync<any>('SELECT * FROM learning_items WHERE id = ?', id); return row ? toItem(row) : null; }
export async function createItem(item: Omit<LearningItem, 'id' | 'createdAt' | 'updatedAt'>) {
  const db = await database(); const now = new Date().toISOString(); const id = createId();
  await db.runAsync('INSERT INTO learning_items (id, kind, japanese, reading, meaning, notes, state, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', id, item.kind, item.japanese, item.reading, item.meaning, item.notes, item.state, now, now);
  await db.runAsync('INSERT INTO learning_evidence (id, item_id, event_type, confidence, context_type, occurred_at) VALUES (?, ?, ?, ?, ?, ?)', createId(), id, 'attempted', 1, 'conversation', now);
  return (await getItem(id))!;
}
export async function updateItem(id: string, changes: Partial<Omit<LearningItem, 'id' | 'createdAt' | 'updatedAt'>>) {
  const existing = await getItem(id); if (!existing) throw new Error('Learning item not found.');
  const db = await database(); const next = { ...existing, ...changes, id, createdAt: existing.createdAt, updatedAt: new Date().toISOString() };
  await db.runAsync('UPDATE learning_items SET kind = ?, japanese = ?, reading = ?, meaning = ?, notes = ?, state = ?, updated_at = ? WHERE id = ?', next.kind, next.japanese, next.reading, next.meaning, next.notes, next.state, next.updatedAt, id);
  return next;
}
export async function archiveItem(id: string) {
  const db = await database(); const now = new Date().toISOString();
  await db.runAsync('UPDATE learning_items SET archived_at = ?, updated_at = ? WHERE id = ?', now, now, id);
}
export async function exportBundle(): Promise<ExportBundle> { return { formatVersion: 1, exportedAt: new Date().toISOString(), profile: await getProfile(), learningItems: await listItems() }; }
export async function importBundle(bundle: ExportBundle, mode: 'merge' | 'replace') {
  const db = await database(); if (mode === 'replace') await db.execAsync('DELETE FROM learning_items; DELETE FROM profile;');
  if (bundle.profile) await saveProfile({ supportLanguage: bundle.profile.supportLanguage, startingComfort: bundle.profile.startingComfort, correctionIntensity: bundle.profile.correctionIntensity, furiganaMode: bundle.profile.furiganaMode });
  for (const item of bundle.learningItems) await db.runAsync('INSERT OR REPLACE INTO learning_items (id, kind, japanese, reading, meaning, notes, state, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', item.id, item.kind, item.japanese, item.reading, item.meaning, item.notes, item.state, item.createdAt, item.updatedAt);
}
export async function getSetting(key: string) { const db = await database(); const row = await db.getFirstAsync<any>('SELECT value FROM settings WHERE key = ?', key); return row?.value ?? null; }
export async function setSetting(key: string, value: string) { const db = await database(); await db.runAsync('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', key, value); }
