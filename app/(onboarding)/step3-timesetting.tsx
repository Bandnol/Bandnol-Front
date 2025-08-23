import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BottomNextButton from '@/components/common/BottomNextButton';
import StatusBarHeader from '@/components/common/StatusBarHeader';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/typography';
import api from '@/store/api';

const Component = () => {
  const router = useRouter();

  const [ampm, setAmpm] = useState('오전');
  const [hour, setHour] = useState('10');
  const [minute, setMinute] = useState('00');
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    (async () => {
      const userStr = await SecureStore.getItemAsync('user');
      setUser(userStr ? JSON.parse(userStr) : {});
    })();
  }, []);

  const hours = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, '0'),
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, '0'),
  );

  const handleNext = async () => {
    try {
      // 24시간 형식 변환
      let hour24 = parseInt(hour, 10);
      if (ampm === '오후' && hour24 !== 12) {
        hour24 += 12;
      }
      if (ampm === '오전' && hour24 === 12) {
        hour24 = 0;
      }
      const recomsTime = `${hour24.toString().padStart(2, '0')}${minute}`;

      const token = await SecureStore.getItemAsync('JWTToken');
      console.log('추천곡 시간 PATCH:', recomsTime);
      await api.patch(
        '/api/v1/users/me/profiles',
        {
          ownId: user.ownId,
          nickname: user.nickname,
          gender: user.gender,
          birth: user.birth,
          recomsTime,
          bio: user.bio || '',
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        },
      );

      router.push('/step4-done');
    } catch (error) {
      console.error('추천곡 시간 설정 실패:', error);
    }
  };

  return (
    <SafeAreaView style={styles.viewBg}>
      <View style={styles.view}>
        <StatusBarHeader />

        <View style={{ paddingHorizontal: 20, alignSelf: 'stretch' }}>
          <Text style={[styles.text1, styles.textTitleMargin]}>
            추천 곡 수신 시간 설정
          </Text>
          <View style={{ height: 7 }} />
          <Text style={styles.text2}>
            {`매일 추천 곡을 받을 시간을 알려주세요!
나중에 언제든지 변경할 수 있습니다.`}
          </Text>
        </View>
        <View style={{ height: 27 }} />
        <View style={styles.view}>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={ampm}
              onValueChange={(itemValue) => setAmpm(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="오전" value="오전" />
              <Picker.Item label="오후" value="오후" />
            </Picker>
            <Picker
              selectedValue={hour}
              onValueChange={(itemValue) => setHour(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              {hours.map((h) => (
                <Picker.Item key={h} label={h} value={h} />
              ))}
            </Picker>
            <Picker
              selectedValue={minute}
              onValueChange={(itemValue) => setMinute(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              {minutes.map((m) => (
                <Picker.Item key={m} label={m} value={m} />
              ))}
            </Picker>
          </View>
        </View>

        <BottomNextButton onPress={handleNext} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  viewBg: {
    backgroundColor: Colors.palette.Gray900,
    flex: 1,
  },
  view: {
    width: '100%',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    overflow: 'hidden',
  },
  skipText: {
    ...Typography.caption1,
    color: Colors.palette.Gray400,
  },
  text1: {
    ...Typography.h1,
    color: Colors.palette.Gray100,
    alignSelf: 'stretch',
  },
  text2: {
    ...Typography.body2,
    color: Colors.palette.Gray100,
  },
  textTitleMargin: {
    marginTop: 22,
  },
  pickerWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  picker: {
    height: 200,
    width: 90,
    color: Colors.palette.white,
  },
  pickerItem: {
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    letterSpacing: -0.45,
    lineHeight: 18 * 1.4,
    color: Colors.palette.Gray100,
  },
});

export default Component;
