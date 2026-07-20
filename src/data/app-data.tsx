import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { archiveItem, createItem, exportBundle, getProfile, getSetting, importBundle, listItems, saveProfile, setSetting, updateItem } from './database';
import { ExportBundle, LearningItem, Profile } from './types';
import { ConnectionProfile } from '@/ai/types';

type ItemInput = Omit<LearningItem, 'id' | 'createdAt' | 'updatedAt'>;
type AppData = { ready: boolean; profile: Profile | null; items: LearningItem[]; connection: ConnectionProfile | null; completeSetup: (profile: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>; saveConnection: (connection: ConnectionProfile) => Promise<void>; addItem: (item: ItemInput) => Promise<void>; updateItem: (id: string, changes: Partial<ItemInput>) => Promise<void>; archiveItem: (id: string) => Promise<void>; refresh: () => Promise<void>; exportData: typeof exportBundle; importData: (data: ExportBundle, mode: 'merge' | 'replace') => Promise<void> };
const Context = createContext<AppData | null>(null);
export function AppDataProvider({ children }: PropsWithChildren) {
  const [ready, setReady] = useState(false); const [profile, setProfile] = useState<Profile | null>(null); const [items, setItems] = useState<LearningItem[]>([]); const [connection, setConnection] = useState<ConnectionProfile | null>(null);
  const refresh = async () => { setProfile(await getProfile()); setItems(await listItems()); const raw = await getSetting('connection'); setConnection(raw ? JSON.parse(raw) : null); setReady(true); };
  useEffect(() => {
    // This initial hydration bridges the external SQLite store into React state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, []);
  const value = useMemo(() => ({ ready, profile, items, connection, refresh, exportData: exportBundle, saveConnection: async (next: ConnectionProfile) => { await setSetting('connection', JSON.stringify(next)); setConnection(next); }, addItem: async (item: ItemInput) => { await createItem(item); setItems(await listItems()); }, updateItem: async (id: string, changes: Partial<ItemInput>) => { await updateItem(id, changes); setItems(await listItems()); }, archiveItem: async (id: string) => { await archiveItem(id); setItems(await listItems()); }, importData: async (data: ExportBundle, mode: 'merge' | 'replace') => { await importBundle(data, mode); await refresh(); }, completeSetup: async (next: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>) => { setProfile(await saveProfile(next)); setItems(await listItems()); } }), [ready, profile, items, connection]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useAppData() { const value = useContext(Context); if (!value) throw new Error('AppDataProvider is required'); return value; }
