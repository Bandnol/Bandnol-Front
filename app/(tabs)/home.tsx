// app/(tabs)/home.tsx
import { useCallback } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { routeBySentToday } from '@/api/recoms';

export default function HomeGate() {
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        await routeBySentToday((href) => {
          if (!active) return;
          router.replace(href);
        });
      })();
      return () => {
        active = false;
      };
    }, [router]),
  );

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
      }}
    >
      <ActivityIndicator />
    </View>
  );
}
