import { View } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import BottomTabBar from '../../components/common/BottomTabBar';

type TabKey = 'home' | 'artist' | 'recommend' | 'mypage' | 'setting';

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
        onTabPress={(tab: TabKey) => router.push(`/${tab}`)}
      />
    </View>
  );
}
