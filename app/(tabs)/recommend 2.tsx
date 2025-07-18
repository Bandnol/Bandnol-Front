import { Text, View } from 'react-native';
import BottomTabBar from '../../components/common/BottomTabBar';

export default function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}
    >
      <Text
        style={{
          fontFamily: 'Pretendard',
          fontSize: 24,
          color: '#333',
        }}
      >
        기본 프리탠다드
      </Text>

      <Text
        style={{
          fontFamily: 'Pretendard-SemiBold',
          fontSize: 24,
          color: '#FB4932',
          marginTop: 16,
        }}
      >
        세미볼드
      </Text>

      <Text
        style={{
          fontFamily: 'Pretendard-Bold',
          fontSize: 24,
          color: '#1F1F1F',
          marginTop: 16,
        }}
      >
        볼드
      </Text>
    </View>
  );
}
