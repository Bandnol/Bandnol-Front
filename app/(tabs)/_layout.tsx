import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar, View } from 'react-native';

import BottomTabBar from '../../components/common/BottomTabBar';

type TabKey = 'home' | 'artist' | 'recommend' | 'mypage' | 'setting';

<StatusBar barStyle="light-content" backgroundColor="#000" />;

export default function TabsLayout() {
  const router = useRouter();
  const segments = useSegments();

  // 현재 탭 키 추출 (예: /home, /artist → 'home', 'artist')
  const currentTab = segments[1] || 'home';

  return (
    <View style={{ flex: 1 }}>
      <Slot />
      <BottomTabBar
        currentTab={currentTab}
        onTabPress={(tab: string) => router.push(`/(tabs)/${tab}` as any)}
      />
    </View>
  );
}
