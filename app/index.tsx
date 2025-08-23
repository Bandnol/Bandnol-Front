import { useRouter } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    async function checkLogin() {
      let token = await AsyncStorage.getItem('accessToken');
      if (!token) token = await AsyncStorage.getItem('token');

      let profileString = await AsyncStorage.getItem('profile');
      if (!profileString) profileString = await AsyncStorage.getItem('user');
      let profile = null;
      try {
        profile = profileString ? JSON.parse(profileString) : null;
      } catch {
        profile = null;
      }

      if (isMounted) {
        if (token && profile && (profile.name || profile.nickname)) {
          router.replace('/(tabs)/home');
        } else {
          router.replace('/(auth)/splash');
        }
      }
    }

    checkLogin();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>로딩 중...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  text: {
    fontSize: 16,
    color: '#000000',
  },
});
