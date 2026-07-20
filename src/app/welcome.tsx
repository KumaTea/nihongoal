import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, PrimaryButton, uiStyles } from '@/components/ui';
import { colors, spacing, typography } from '@/design/tokens';
import { BrandMark } from '@/components/brand-mark';
import { useAppData } from '@/data/app-data';
import { Profile } from '@/data/types';

export default function Welcome() {
  const router = useRouter(); const { completeSetup } = useAppData();
  const [language, setLanguage] = useState<Profile['supportLanguage']>('en-US');
  const [comfort, setComfort] = useState('new'); const [feedback, setFeedback] = useState<Profile['correctionIntensity']>('gentle');
  const finish = async () => { await completeSetup({ supportLanguage: language, startingComfort: comfort, correctionIntensity: feedback, furiganaMode: language === 'ja' ? 'all' : 'learning' }); router.replace('/'); };
  return <SafeAreaView style={styles.page}><ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}><View style={styles.content}><View style={styles.brandRow}><BrandMark size={54}/><View><Text style={styles.eyebrow}>NIHONGOAL!</Text><Text style={styles.title}>Set your starting point</Text></View></View><Text style={uiStyles.muted}>Three quick choices. You can change all of them later.</Text>
    <Card><Text style={styles.label}>Sensei explains in</Text><Choices values={[['en-US','English'],['zh-CN','简体中文'],['ja','やさしい日本語']]} selected={language} onSelect={(v) => setLanguage(v as Profile['supportLanguage'])}/></Card>
    <Card><Text style={styles.label}>Your starting comfort</Text><Choices values={[['new','New to Japanese'],['basics','I know some basics'],['conversation','I can hold simple conversations'],['unsure','Let Sensei find out']]} selected={comfort} onSelect={setComfort}/></Card>
    <Card><Text style={styles.label}>Correction style</Text><Choices values={[['chat','Just chat'],['gentle','Gentle corrections'],['coach','Coach me closely']]} selected={feedback} onSelect={(v) => setFeedback(v as Profile['correctionIntensity'])}/></Card>
    <PrimaryButton label="Start learning" onPress={() => void finish()} /></View></ScrollView></SafeAreaView>;
}
function Choices({ values, selected, onSelect }: { values: string[][]; selected: string; onSelect: (value: string) => void }) { return <View style={styles.choices}>{values.map(([value,label]) => <Text accessibilityRole="button" key={value} onPress={() => onSelect(value)} style={[styles.choice, selected === value && styles.selected]}>{selected === value ? '● ' : '○ '}{label}</Text>)}</View>; }
const styles = StyleSheet.create({ page:{flex:1,backgroundColor:colors.background},scrollContent:{flexGrow:1,paddingBottom:spacing.xl},content:{alignSelf:'center',gap:spacing.md,maxWidth:620,padding:spacing.lg,width:'100%'},brandRow:{alignItems:'center',flexDirection:'row',gap:spacing.md},eyebrow:{color:colors.primary,fontSize:typography.eyebrow,fontWeight:'800',letterSpacing:1.2},title:{color:colors.text,fontSize:32,fontWeight:'700',letterSpacing:-1},label:{color:colors.text,fontSize:18,fontWeight:'700'},choices:{gap:spacing.sm},choice:{color:colors.text,fontSize:16,paddingVertical:2},selected:{color:colors.primary,fontWeight:'700'} });
