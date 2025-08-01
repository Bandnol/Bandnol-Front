import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style = {},
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps = {}) {
  const backgroundColor =
    lightColor !== undefined
      ? lightColor
      : useThemeColor({ light: '#fff' }, 'background') || '#fff';

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
