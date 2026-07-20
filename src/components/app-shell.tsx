import { PropsWithChildren } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Href, usePathname, useRouter } from 'expo-router';

import { colors, layout, radius, spacing, typography } from '@/design/tokens';

type AppShellProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
}>;

const tabs: { href: Href; label: string; icon: string }[] = [
  { href: '/', label: 'Home', icon: '⌂' },
  { href: '/sensei', label: 'Sensei', icon: '◉' },
  { href: '/discover', label: 'Discover', icon: '⌑' },
  { href: '/read', label: 'Read', icon: '▤' },
  { href: '/you', label: 'You', icon: '◌' },
];

export function AppShell({ children, title, subtitle }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.page}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.eyebrow}>NIHONGOAL! · 日本語</Text>
            <Text accessibilityRole="header" style={styles.title}>
              {title}
            </Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
          {children}
        </ScrollView>
        <View accessibilityRole="tablist" style={styles.tabBar}>
          {tabs.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Pressable
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                accessibilityLabel={tab.label}
                key={tab.label}
                onPress={() => router.replace(tab.href)}
                style={({ pressed }) => [styles.tab, active && styles.activeTab, pressed && styles.pressed]}>
                <Text style={[styles.tabIcon, active && styles.activeTabText]}>{tab.icon}</Text>
                <Text style={[styles.tabLabel, active && styles.activeTabText]}>{tab.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  page: { flex: 1, alignSelf: 'center', backgroundColor: colors.background, maxWidth: layout.maxWidth, width: '100%' },
  scrollContent: { gap: spacing.lg, padding: spacing.lg, paddingBottom: layout.tabBarHeight + spacing.xl },
  header: { gap: spacing.xs },
  eyebrow: { color: colors.primary, fontSize: typography.eyebrow, fontWeight: '700', letterSpacing: 1.2 },
  title: { color: colors.text, fontSize: typography.title, fontWeight: '700', letterSpacing: -0.6 },
  subtitle: { color: colors.mutedText, fontSize: typography.body, lineHeight: 24 },
  tabBar: { backgroundColor: colors.surface, borderColor: colors.border, borderTopWidth: StyleSheet.hairlineWidth, bottom: 0, flexDirection: 'row', left: 0, minHeight: layout.tabBarHeight, paddingHorizontal: spacing.sm, paddingVertical: spacing.sm, position: 'absolute', right: 0 },
  tab: { alignItems: 'center', borderRadius: radius.md, flex: 1, gap: 2, justifyContent: 'center' },
  activeTab: { backgroundColor: colors.surfaceMuted },
  tabIcon: { color: colors.mutedText, fontSize: 19, lineHeight: 20 },
  tabLabel: { color: colors.mutedText, fontSize: 11, fontWeight: '600' },
  activeTabText: { color: colors.primary },
  pressed: { opacity: 0.68 },
});
