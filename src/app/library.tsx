import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppShell } from '@/components/app-shell';
import { Card, PrimaryButton, uiStyles } from '@/components/ui';
import { useAppData } from '@/data/app-data';
import { LearningItem } from '@/data/types';
import { colors, radius, spacing } from '@/design/tokens';
import { FuriganaText } from '@/components/furigana-text';

type Draft = { japanese: string; reading: string; meaning: string; notes: string };
const blankDraft: Draft = { japanese: '', reading: '', meaning: '', notes: '' };

export default function Library() {
  const { items, addItem, updateItem, archiveItem, profile } = useAppData(); const router = useRouter(); const [editingId, setEditingId] = useState<string | 'new' | null>(null); const [draft, setDraft] = useState<Draft>(blankDraft); const [status, setStatus] = useState('');
  const startNew = () => { setDraft(blankDraft); setEditingId('new'); setStatus(''); };
  const startEdit = (item: LearningItem) => { setDraft({ japanese: item.japanese, reading: item.reading ?? '', meaning: item.meaning, notes: item.notes ?? '' }); setEditingId(item.id); setStatus(''); };
  const save = async () => {
    if (!draft.japanese.trim() || !draft.meaning.trim()) return setStatus('Japanese and meaning are required.');
    const changes = { kind: 'phrase' as const, japanese: draft.japanese.trim(), reading: draft.reading.trim() || null, meaning: draft.meaning.trim(), notes: draft.notes.trim() || null, state: 'seen' as const };
    if (editingId === 'new') await addItem(changes); else if (editingId) await updateItem(editingId, changes);
    setEditingId(null); setStatus(editingId === 'new' ? 'Added to your Library.' : 'Library item updated.');
  };
  const remove = async (id: string) => { await archiveItem(id); setEditingId(null); setStatus('Removed from your active Library.'); };
  return <AppShell title="Your Library" subtitle="Useful Japanese you chose to keep.">
    <PrimaryButton label="Add a phrase" onPress={startNew}/>
    {editingId ? <Editor draft={draft} onChange={setDraft} onSave={() => void save()} onCancel={() => setEditingId(null)} /> : null}
    {status ? <Text style={uiStyles.muted}>{status}</Text> : null}
    {items.length === 0 ? <Card><Text style={uiStyles.japanese}>Your Library is waiting.</Text><Text style={uiStyles.body}>Save a word or phrase from Sensei, Discover, or Read—or add one yourself.</Text><PrimaryButton label="Talk with Sensei" onPress={() => router.push('/sensei')} /></Card> : <View style={styles.list}>{items.map((item) => <Card key={item.id}><FuriganaText japanese={item.japanese} reading={item.reading} showReading={profile?.furiganaMode !== 'none'}/><Text style={uiStyles.body}>{item.meaning}</Text>{item.notes ? <Text style={uiStyles.muted}>{item.notes}</Text> : null}<Text style={styles.state}>{item.state.replace('-', ' ')}</Text><View style={styles.actions}><Text accessibilityRole="button" onPress={() => startEdit(item)} style={styles.edit}>Edit</Text><Text accessibilityRole="button" onPress={() => void remove(item.id)} style={styles.remove}>Remove</Text></View></Card>)}</View>}
  </AppShell>;
}

function Editor({ draft, onChange, onSave, onCancel }: { draft: Draft; onChange: (draft: Draft) => void; onSave: () => void; onCancel: () => void }) {
  const field = (key: keyof Draft, label: string, placeholder?: string) => <><Text style={styles.label}>{label}</Text><TextInput accessibilityLabel={label} value={draft[key]} onChangeText={(value) => onChange({ ...draft, [key]: value })} placeholder={placeholder} placeholderTextColor={colors.mutedText} style={styles.input}/></>;
  return <Card><Text style={uiStyles.japanese}>Your learning item</Text>{field('japanese', 'Japanese', '例: コーヒーをお願いします')}{field('reading', 'Reading', 'こーひー を おねがいします')}{field('meaning', 'Meaning', 'Coffee, please.')}{field('notes', 'Notes', 'Where you encountered it') }<PrimaryButton label="Save item" onPress={onSave}/><Text accessibilityRole="button" onPress={onCancel} style={styles.cancel}>Cancel</Text></Card>;
}
const styles=StyleSheet.create({list:{gap:spacing.sm},state:{color:colors.primary,fontSize:13,fontWeight:'700',textTransform:'uppercase'},actions:{flexDirection:'row',gap:spacing.lg},edit:{color:colors.primary,fontSize:15,fontWeight:'700'},remove:{color:colors.danger,fontSize:15,fontWeight:'700'},label:{color:colors.text,fontSize:14,fontWeight:'700',marginTop:spacing.sm},input:{borderColor:colors.border,borderRadius:radius.md,borderWidth:1,color:colors.text,minHeight:46,paddingHorizontal:spacing.sm},cancel:{color:colors.primary,fontSize:15,fontWeight:'700',textAlign:'center'}});
