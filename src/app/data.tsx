import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { AppShell } from '@/components/app-shell';
import { Card, PrimaryButton, uiStyles } from '@/components/ui';
import { useAppData } from '@/data/app-data';
import { exportBundleSchema } from '@/data/export-schema';
import { colors, spacing } from '@/design/tokens';

export default function DataScreen() {
  const router = useRouter(); const { importData } = useAppData(); const [raw, setRaw] = useState('');
  const restore = async (mode: 'merge' | 'replace') => {
    let candidate: unknown;
    try { candidate = JSON.parse(raw); } catch { return Alert.alert('That export is not valid', 'Check that you pasted a complete Japanese Everyday export file.'); }
    const parsed = exportBundleSchema.safeParse(candidate);
    if (!parsed.success) return Alert.alert('That export is not valid', 'Check that you pasted a Japanese Everyday export file.');
    await importData(parsed.data, mode); Alert.alert('Import complete', `${parsed.data.learningItems.length} learning items were restored.`); router.back();
  };
  return <AppShell title="Your data" subtitle="Keep your local learning record portable."><Card><Text style={uiStyles.japanese}>Import a backup</Text><Text style={uiStyles.body}>Paste the contents of a Japanese Everyday export JSON file. API tokens are never included.</Text><TextInput accessibilityLabel="Export JSON" multiline onChangeText={setRaw} placeholder="Paste export JSON here" placeholderTextColor={colors.mutedText} style={styles.input} value={raw}/><PrimaryButton label="Merge with this device" onPress={() => void restore('merge')} /><Text accessibilityRole="button" onPress={() => void restore('replace')} style={styles.replace}>Replace local learning data</Text></Card></AppShell>;
}
const styles=StyleSheet.create({input:{borderColor:colors.border,borderRadius:12,borderWidth:1,color:colors.text,minHeight:150,padding:spacing.md,textAlignVertical:'top'},replace:{color:colors.danger,fontSize:15,fontWeight:'700',paddingTop:spacing.sm,textAlign:'center'}});
