import { useColorScheme } from 'react-native';

import { Colors } from '../constants/Colors';

export function useThemeColor(props: { light?: string; dark?: string }, colorName: keyof typeof Colors.light) {
  const theme = useColorScheme() ?? 'light';
  const tintColor = props[theme];

  if (tintColor) {
    return tintColor;
  } else {
    return Colors[theme][colorName];
  }
}
