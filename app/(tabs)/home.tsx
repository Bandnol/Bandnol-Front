import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import BottomTabBar from '../../components/common/BottomTabBar';

export default function HomePage() {
  const router = useRouter();

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.text}>홈 페이지</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
