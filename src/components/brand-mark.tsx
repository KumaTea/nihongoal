import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { StyleProp, ViewStyle } from 'react-native';

export function BrandMark({ size = 120, style }: { size?: number; style?: StyleProp<ViewStyle> }) {
  return <Svg accessibilityLabel="NihonGoal!" height={size} viewBox="0 0 512 512" width={size} style={style}>
    <Rect width="512" height="512" rx="112" fill="#F7F5F0"/>
    <Circle cx="256" cy="190" r="112" fill="#E85D4A"/>
    <Circle cx="256" cy="190" r="64" fill="#F7F5F0"/>
    <Path d="M112 388c45-34 94-50 144-50s99 16 144 50" fill="none" stroke="#263238" strokeLinecap="round" strokeWidth="34"/>
    <Path d="M176 348l80-94 80 94" fill="none" stroke="#263238" strokeLinecap="round" strokeLinejoin="round" strokeWidth="30"/>
    <Path d="M256 254v-72m0 0-32 32m32-32 32 32" fill="none" stroke="#F7F5F0" strokeLinecap="round" strokeLinejoin="round" strokeWidth="18"/>
    <Circle cx="400" cy="112" r="18" fill="#D6A329"/>
  </Svg>;
}
