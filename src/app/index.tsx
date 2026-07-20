import { StyleSheet, Text, View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';

import { AppShell } from '@/components/app-shell';
import { Card, PrimaryButton, SectionTitle, uiStyles } from '@/components/ui';
import { colors, radius, spacing } from '@/design/tokens';
import { useAppData } from '@/data/app-data';
import { focusAdvice, recommendationFor } from '@/domain/learning';

export default function HomeScreen() {
  const router = useRouter();
  const { ready, profile, items } = useAppData();
  if (!ready) return null;
  if (!profile) return <Redirect href="/intro" />;

  const recommendation = recommendationFor(items);
  return (
    <AppShell title="A little more Japanese, every day" subtitle="Notice it, use it, and make it part of your life.">
      <Card>
        <Text style={styles.kicker}>TODAY’S INVITATION</Text>
        <Text style={styles.hero}>{recommendation.title}</Text>
        <Text style={uiStyles.muted}>{recommendation.detail}</Text>
        <PrimaryButton label={recommendation.action} onPress={() => router.push('/sensei')} />
      </Card>

      <View>
        <SectionTitle>Choose your own start</SectionTitle>
        <View style={styles.actionGrid}>
          <Action label="Ask a question" detail="Translate, check, or understand" onPress={() => router.push('/sensei')} />
          <Action label="Discover" detail="From an image or text" onPress={() => router.push('/discover')} />
          <Action label="Read" detail="A short story for you" onPress={() => router.push('/read')} />
        </View>
      </View>

      <Card>
        <Text style={styles.kicker}>JOURNEY</Text>
        <Text style={uiStyles.body}>Journey Lv. 1 · {items.length * 15} XP</Text>
        <Text style={uiStyles.muted}>{focusAdvice(items.length)}</Text>
      </Card>
    </AppShell>
  );
}

function Action({ label, detail, onPress }: { label: string; detail: string; onPress: () => void }) {
  return (
    <Text accessibilityRole="button" onPress={onPress} style={styles.action}>
      {label}{'\n'}
      <Text style={styles.actionDetail}>{detail}</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  kicker: { color: colors.primary, fontSize: 12, fontWeight: '800', letterSpacing: 1.1 },
  hero: { color: colors.text, fontSize: 25, fontWeight: '700', lineHeight: 33 },
  actionGrid: { gap: spacing.sm },
  action: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md, borderWidth: StyleSheet.hairlineWidth, color: colors.text, fontSize: 16, fontWeight: '700', lineHeight: 23, padding: spacing.md },
  actionDetail: { color: colors.mutedText, fontSize: 14, fontWeight: '400' },
});
