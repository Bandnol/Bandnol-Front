import React, { useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackIcon from '@/assets/onboarding/Vector.svg';
import { useRouter } from 'expo-router';

const Component = () => {
  const router = useRouter();

  const [ampm, setAmpm] = useState('오전');
  const [hour, setHour] = useState('10');
  const [minute, setMinute] = useState('00');

  const hours = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, '0'),
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, '0'),
  );

  return (
    <SafeAreaView style={styles.parent}>
      <View style={styles.container}>
        <View style={styles.view}>
          <View style={styles.iconWrapper}>
            <View style={{ paddingLeft: 20 }}>
              <TouchableOpacity onPress={() => router.back()}>
                <BackIcon width={24} height={24} style={styles.icon} />
              </TouchableOpacity>
            </View>
            <View style={{ paddingRight: 20 }}>
              <Text style={styles.skipText}>건너뛰기</Text>
            </View>
          </View>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>추천 곡 수신 시간 설정</Text>
            <Text style={styles.description}>
              매일 추천 곡을 받을 시간을 알려주세요!{'\n'}나중에 언제든지 변경할
              수 있습니다.
            </Text>
          </View>

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

        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.push('/step4-done')}
        >
          <Text style={[styles.text21, styles.textTypo]}>다음</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  view: {
    width: '100%',
    gap: 35,
    alignItems: 'center',
    flex: 1,
  },
  iconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    width: '100%',
  },
  icon: {
    overflow: 'hidden',
  },
  skipText: {
    color: '#b3b3b3',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: -0.3,
  },
  titleWrapper: {
    paddingHorizontal: 20,
    gap: 7,
    alignSelf: 'stretch',
  },
  title: {
    fontSize: 22,
    letterSpacing: -0.5,
    lineHeight: 31,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'left',
    fontFamily: 'Pretendard',
  },
  description: {
    fontSize: 14,
    letterSpacing: -0.3,
    lineHeight: 20,
    color: '#f4f4f4',
    fontFamily: 'Pretendard',
    textAlign: 'left',
  },
  pickerWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  picker: {
    height: 200,
    width: 90,
    color: '#fff',
  },
  pickerItem: {
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
    letterSpacing: -0.45,
    lineHeight: 18 * 1.4,
  },
  btn: {
    backgroundColor: '#FB4932',
    padding: 16,
    height: 50,
    width: 335,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 30,
  },
  text21: {
    color: '#FFFFFF',
    lineHeight: 20,
    letterSpacing: -0.3,
    fontSize: 14,
    fontWeight: '600',
  },
  textTypo: {
    textAlign: 'left',
    fontFamily: 'Pretendard',
  },
});

export default Component;
