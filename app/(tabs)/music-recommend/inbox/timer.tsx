import { type Href, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

export default function TimerScreen() {
  const router = useRouter();
  const [left, setLeft] = useState(10); // 데모용
  const receiveAbs = '/(tabs)/music-recommend/inbox/receiveRecommend' as Href;

  useEffect(() => {
    const id = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          router.replace(receiveAbs);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [router, receiveAbs]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
      }}
    >
      <Text style={{ color: '#fff', fontSize: 16, marginBottom: 8 }}>
        오늘의 추천곡 도착까지
      </Text>
      <Text style={{ color: '#fff', fontSize: 32, fontWeight: 'bold' }}>
        00:00:{String(left).padStart(2, '0')}
      </Text>

      {/* 테스트용: 수동 이동 */}
      <Pressable
        onPress={() => router.replace(receiveAbs)}
        style={{ marginTop: 20 }}
      >
        <Text style={{ color: '#FB4932' }}>바로 보기</Text>
      </Pressable>
    </View>
  );
}
