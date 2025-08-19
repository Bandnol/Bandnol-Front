// components/common/StatusBarHeader.tsx
import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import BackIcon from '@/assets/onboarding/Vector.svg';

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
      <TouchableOpacity onPress={handleBack}>
        <BackIcon width={24} height={24} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
  },
});
