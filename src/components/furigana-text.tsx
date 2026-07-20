import { StyleProp, StyleSheet, Text, TextStyle, View } from 'react-native';
import { colors } from '@/design/tokens';

type Props = { japanese: string; reading?: string | null; showReading?: boolean; style?: StyleProp<TextStyle> };

// A portable ruby-like stack. Native Text has no shared ruby implementation,
// so this keeps the kana visibly above the Japanese across web, iOS, and Android.
export function FuriganaText({ japanese, reading, showReading = true, style }: Props) {
  return <View style={styles.wrap}>{showReading && reading ? <Text style={styles.reading}>{reading}</Text> : null}<Text style={[styles.japanese, style]}>{japanese}</Text></View>;
}
const styles = StyleSheet.create({ wrap:{alignSelf:'flex-start',gap:0},reading:{color:colors.mutedText,fontSize:12,lineHeight:16,marginLeft:2},japanese:{color:colors.text,fontSize:23,fontWeight:'700',lineHeight:32} });
