import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppShell } from '@/components/app-shell';
import { Card, SectionTitle, uiStyles } from '@/components/ui';
import { colors, radius, spacing } from '@/design/tokens';
import { useRouter } from 'expo-router';
import { useAppData } from '@/data/app-data';

export default function YouScreen() {
  const router = useRouter(); const { exportData } = useAppData();
  const download = async () => { const data = await exportData(); if (typeof document === 'undefined') return; const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })); const link = document.createElement('a'); link.href = url; link.download = 'japanese-everyday-export.json'; link.click(); URL.revokeObjectURL(url); };
  return (
    <AppShell title="You" subtitle="Your Japanese, your settings, your learning record.">
      <Card>
        <Text style={styles.level}>Journey Lv. 1 · 0 XP</Text>
        <Text style={uiStyles.muted}>Your Japanese ability will be a careful, evidence-based estimate—not a number assigned on day one.</Text>
      </Card>
      <View>
        <SectionTitle>Your learning space</SectionTitle>
        <View style={styles.items}>
          <MenuItem title="Library" detail="Saved words, phrases, and discoveries" onPress={() => router.push('/library')} />
          <MenuItem title="Your Japanese" detail="A developing skill picture" />
          <MenuItem title="Settings" detail="Tutor, language, furigana, AI, and data" onPress={() => router.push('/settings')} />
        </View>
      </View>
      <Card>
        <Text style={styles.notice}>Local prototype</Text>
        <Text style={uiStyles.body}>Sign-in and sync are coming later. Export and import will keep your learning data portable.</Text>
      </Card>
      <Card><Text style={styles.notice}>Your data</Text><Text style={uiStyles.body}>Your learning is stored on this device. Exports never include API tokens.</Text><Text accessibilityRole="button" onPress={() => void download()} style={styles.export}>Export my learning data</Text><Text accessibilityRole="button" onPress={() => router.push('/data')} style={styles.import}>Import a backup</Text></Card>
    </AppShell>
  );
}

function MenuItem({ title, detail, onPress }: { title: string; detail: string; onPress?: () => void }) {
  return (
    <Pressable accessibilityRole={onPress ? 'button' : undefined} disabled={!onPress} onPress={onPress} style={styles.menuItem}>
      <Text style={styles.menuTitle}>{title}</Text>
      <Text style={uiStyles.muted}>{detail}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  level: { color: colors.primary, fontSize: 19, fontWeight: '700' },
  items: { gap: spacing.sm },
  menuItem: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth, gap: spacing.xs, padding: spacing.md },
  menuTitle: { color: colors.text, fontSize: 17, fontWeight: '700' },
  notice: { color: colors.primary, fontSize: 13, fontWeight: '800', letterSpacing: 0.9 },
  export: { color: colors.primary, fontSize: 16, fontWeight: '700', marginTop: spacing.sm },
  import: { color: colors.primary, fontSize: 16, fontWeight: '700', marginTop: spacing.sm },
});
