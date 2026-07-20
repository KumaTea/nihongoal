import DexieCore, { Table } from 'dexie';
import { ExportBundle, LearningItem, Profile } from './types';
import { createId } from './id';

type ItemRow = LearningItem & { archivedAt?: string };
type EvidenceRow = { id: string; itemId: string; eventType: string; confidence: number; contextType: string; occurredAt: string };
class JapaneseEverydayDatabase extends DexieCore {
  profile!: Table<Profile>;
  learningItems!: Table<ItemRow>;
  evidence!: Table<EvidenceRow>;
  settings!: Table<{ key: string; value: string }>;
  constructor() { super('japanese-everyday'); this.version(1).stores({ profile: 'id', learningItems: 'id, japanese, updatedAt, archivedAt', evidence: 'id, itemId, occurredAt' }); this.version(2).stores({ profile: 'id', learningItems: 'id, japanese, updatedAt, archivedAt', evidence: 'id, itemId, occurredAt', settings: 'key' }); }
}
const db = new JapaneseEverydayDatabase();

export async function getProfile() { return (await db.profile.get('local')) ?? null; }
export async function saveProfile(input: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>) {
  const now = new Date().toISOString(); const existing = await getProfile(); const profile: Profile = { id: 'local', ...input, createdAt: existing?.createdAt ?? now, updatedAt: now };
  await db.profile.put(profile); return profile;
}
export async function listItems() { return db.learningItems.filter((item) => !item.archivedAt).reverse().sortBy('updatedAt'); }
export async function getItem(id: string) { return (await db.learningItems.get(id)) ?? null; }
export async function createItem(item: Omit<LearningItem, 'id' | 'createdAt' | 'updatedAt'>) {
  const now = new Date().toISOString(); const result: LearningItem = { id: createId(), ...item, createdAt: now, updatedAt: now }; await db.transaction('rw', db.learningItems, db.evidence, async () => { await db.learningItems.put(result); await db.evidence.put({ id: createId(), itemId: result.id, eventType: 'attempted', confidence: 1, contextType: 'conversation', occurredAt: now }); }); return result;
}
export async function updateItem(id: string, changes: Partial<Omit<LearningItem, 'id' | 'createdAt' | 'updatedAt'>>) {
  const existing = await getItem(id); if (!existing) throw new Error('Learning item not found.');
  const result = { ...existing, ...changes, id, createdAt: existing.createdAt, updatedAt: new Date().toISOString() };
  await db.learningItems.put(result); return result;
}
export async function archiveItem(id: string) {
  const existing = await db.learningItems.get(id); if (!existing) return;
  await db.learningItems.put({ ...existing, archivedAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
}
export async function exportBundle(): Promise<ExportBundle> { return { formatVersion: 1, exportedAt: new Date().toISOString(), profile: await getProfile(), learningItems: await listItems() }; }
export async function importBundle(bundle: ExportBundle, mode: 'merge' | 'replace') {
  if (mode === 'replace') await db.transaction('rw', db.profile, db.learningItems, async () => { await db.profile.clear(); await db.learningItems.clear(); });
  if (bundle.profile) await db.profile.put(bundle.profile);
  await db.learningItems.bulkPut(bundle.learningItems);
}
export async function getSetting(key: string) { return (await db.settings.get(key))?.value ?? null; }
export async function setSetting(key: string, value: string) { await db.settings.put({ key, value }); }
