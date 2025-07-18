import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import BottomTabBar from '../../components/common/BottomTabBar';

export default function HomePage() {
  const router = useRouter();

  return (
    <>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>홈 페이지</Text>
      </View>
      <BottomTabBar
        currentTab="home"
        onTabPress={(tab) => router.push({ pathname: `/${tab}` })}
      />
    </>
  );
}
