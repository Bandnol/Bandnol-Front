import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import { withLayoutContext } from 'expo-router';
import { Pressable, View } from 'react-native';

const { Navigator } = createMaterialTopTabNavigator();
const MaterialTopTabs = withLayoutContext(Navigator);

// 2-dot 커스텀 탭바 (하단 중앙)
function TwoDotTabBar({ state, navigation }: MaterialTopTabBarProps) {
  const idx = state.index;
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        zIndex: 50,
      }}
    >
      <Pressable
        hitSlop={10}
        onPress={() => navigation.navigate(state.routes[0].name)}
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: idx === 0 ? '#fff' : '#444',
        }}
      />
      <Pressable
        hitSlop={10}
        onPress={() => navigation.navigate(state.routes[1].name)}
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: idx === 1 ? '#fff' : '#444',
        }}
      />
    </View>
  );
}

export default function MusicRecommendTabsLayout() {
  return (
    <MaterialTopTabs
      screenOptions={{
        swipeEnabled: true,
        lazy: true,
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: 'transparent', elevation: 0 },
        tabBarIndicatorStyle: { height: 0 }, // 기본 인디케이터 숨김
      }}
      tabBar={(p) => <TwoDotTabBar {...p} />}
    />
  );
}
