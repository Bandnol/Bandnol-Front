import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function SettingPage() {
  const router = useRouter();

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.text}>세팅 페이지</Text>
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
