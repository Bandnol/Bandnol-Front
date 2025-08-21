// components/common/StatusBarHeader.tsx
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import BackIcon from '@/assets/onboarding/Vector.svg';
import { Typography } from '@/constants/typography';
import { Colors } from '@/constants/Colors';

type Props = {
  onBackPress?: () => void;
};

export default function StatusBarHeader({ onBackPress }: Props) {
  const router = useRouter();
  const handleBack = () => {
    if (onBackPress) return onBackPress();
    if (router.canGoBack()) router.back();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <BackIcon width={24} height={24} />
      </TouchableOpacity>
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  backButton: {
    width: 24,
    height: 24,
  },
  spacer: {
    width: 24,
    height: 24,
  },
});
