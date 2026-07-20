import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BrandMark } from '@/components/brand-mark';
import { PrimaryButton, uiStyles } from '@/components/ui';
import { colors, spacing, typography } from '@/design/tokens';

export default function IntroScreen() {
  const router = useRouter();
  return <SafeAreaView style={styles.page}><View style={styles.content}><View style={styles.hero}><BrandMark size={176}/><Text style={styles.name}>NihonGoal!</Text><Text style={styles.japanese}>日本語 · EVERYDAY</Text><Text style={styles.tagline}>Japanese for your real life.</Text><Text style={uiStyles.muted}>Notice it, use it, and make one small step today.</Text></View><View style={styles.footer}><PrimaryButton label="Start your path" onPress={() => router.push('/welcome')}/><Text style={styles.note}>Your learning, your pace.</Text></View></View></SafeAreaView>;
}
const styles = StyleSheet.create({page:{backgroundColor:colors.background,flex:1},content:{flex:1,justifyContent:'space-between',padding:spacing.xl},hero:{alignItems:'center',gap:spacing.md,marginTop:spacing.xxl},name:{color:colors.text,fontFamily:'Georgia',fontSize:46,fontWeight:'700',letterSpacing:-2},japanese:{color:colors.primary,fontSize:13,fontWeight:'800',letterSpacing:4},tagline:{color:colors.text,fontSize:24,fontWeight:'700',marginTop:spacing.lg,textAlign:'center'},footer:{gap:spacing.md},note:{color:colors.mutedText,fontSize:typography.label,textAlign:'center'}});
