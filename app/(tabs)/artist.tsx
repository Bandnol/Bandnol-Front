import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import BottomTabBar from '../../components/common/BottomTabBar';

export default function ArtistPage() {
  const router = useRouter();

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.text}>아티스트 페이지</Text>
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
