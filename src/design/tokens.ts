export const colors = {
  background: '#F7F5F0',
  surface: '#FFFDFC',
  surfaceMuted: '#ECE8DF',
  text: '#263238',
  mutedText: '#66706C',
  primary: '#3D7667',
  primaryPressed: '#2D5C50',
  primaryText: '#FFFFFF',
  border: '#D9D5CC',
  success: '#3D7667',
  warning: '#B97425',
  danger: '#B94B47',
  focus: '#6A7D52',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 24,
  pill: 999,
} as const;

export const typography = {
  eyebrow: 13,
  body: 16,
  label: 15,
  title: 30,
  display: 40,
} as const;

export const layout = {
  maxWidth: 720,
  tabBarHeight: 74,
} as const;
