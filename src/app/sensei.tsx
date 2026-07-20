import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { AppShell } from '@/components/app-shell';
import { Card, PrimaryButton, uiStyles } from '@/components/ui';
import { useAppData } from '@/data/app-data';
import { itemFromReply, TutorReply, xpForFirstSavedPhrase } from '@/domain/learning';
import { liveTutorCandidate } from '@/ai/openai-compatible';
import { useRouter } from 'expo-router';
import { colors, radius, spacing } from '@/design/tokens';
import { FuriganaText } from '@/components/furigana-text';

export default function SenseiScreen() {
  const { addItem, items, connection, profile } = useAppData(); const router = useRouter(); const [message, setMessage] = useState(''); const [reply, setReply] = useState<TutorReply | null>(null); const [saved, setSaved] = useState(false); const [xp, setXp] = useState(0); const [status, setStatus] = useState('');
  const send = async (value = message) => { if (!value.trim()) return; if (!connection || connection.token.includes('FillYour')) return setStatus('Set up a text AI connection in Settings before talking with Sensei.'); setStatus('Sensei is thinking…'); setMessage(''); setSaved(false); try { setReply(await liveTutorCandidate(connection, value)); setStatus(''); } catch (error) { setStatus(error instanceof Error ? error.message : 'Sensei could not respond.'); } };
  const save = async () => { if (!reply || saved) return; await addItem(itemFromReply(reply)); setSaved(true); setXp(xpForFirstSavedPhrase(items.length)); };
  return <AppShell title="Sensei" subtitle="A warm tutor for the Japanese that matters to you."><Card><Text style={styles.agentName}>せんせい</Text><Text style={uiStyles.body}>こんにちは。What made you want to learn Japanese? You can answer in English, Chinese, Japanese, or a mix.</Text><View style={styles.chips}>{['Anime', 'Travel', 'Food', 'Work'].map((value) => <Text accessibilityRole="button" key={value} onPress={() => send(value)} style={styles.chip}>{value}</Text>)}</View></Card>
    {reply ? <Card><Text style={uiStyles.body}>{reply.text}</Text><FuriganaText japanese={reply.japanese} reading={reply.reading} showReading={profile?.furiganaMode !== 'none'}/><Text style={uiStyles.body}>{reply.meaning}</Text><Text style={styles.practice}>{reply.practice}</Text><PrimaryButton label={saved ? `Saved · +${xp} XP` : 'Save this phrase'} onPress={() => void save()} /></Card> : null}
    <View style={styles.composer}><TextInput accessibilityLabel="Message Sensei" onChangeText={setMessage} onSubmitEditing={() => send()} placeholder="Tell Sensei why you want to learn" placeholderTextColor={colors.mutedText} style={styles.input} value={message}/><PrimaryButton label="Send" onPress={() => send()} /></View>
    <Text accessibilityRole="button" onPress={() => router.push('/settings')} style={styles.settings}>Configure Sensei’s AI connection</Text>{status ? <Text style={uiStyles.muted}>{status}</Text> : null}</AppShell>;
}
const styles=StyleSheet.create({agentName:{color:colors.primary,fontSize:28,fontWeight:'700'},chips:{flexDirection:'row',flexWrap:'wrap',gap:spacing.sm},chip:{backgroundColor:colors.surfaceMuted,borderRadius:radius.pill,color:colors.text,fontSize:14,paddingHorizontal:spacing.md,paddingVertical:spacing.sm},practice:{color:colors.primary,fontSize:15,fontWeight:'700'},composer:{gap:spacing.sm},input:{backgroundColor:colors.surface,borderColor:colors.border,borderRadius:radius.md,borderWidth:StyleSheet.hairlineWidth,color:colors.text,fontSize:15,minHeight:54,paddingHorizontal:spacing.md},settings:{color:colors.primary,fontSize:16,fontWeight:'700'}});
