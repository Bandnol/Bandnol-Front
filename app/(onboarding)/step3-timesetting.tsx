import BackIcon from '@/assets/onboarding/Vector.svg';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/typography';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    <SafeAreaView style={styles.viewBg}>
      <View style={styles.view}>
        <View style={styles.statusBarLayout}>
          <View>
            <TouchableOpacity onPress={() => router.back()}>
              <BackIcon width={24} height={24} style={styles.icon} />
            </TouchableOpacity>
          </View>
          <View>
            <Text style={styles.skipText}>건너뛰기</Text>
          </View>
        </View>

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

        <View style={styles.bottomView}>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: Colors.palette.point }]}
            onPress={() => router.push('/step4-done')}
          >
            <Text style={[Typography.body2, { color: Colors.palette.white }]}>
              다음
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  viewBg: {
    backgroundColor: Colors.palette.Gray900,
    flex: 1,
  },
  statusBarLayout: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 10,
  },
  bottomView: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 1,
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
  },
  btn: {
    backgroundColor: Colors.palette.Gray800,
    padding: 16,
    height: 50,
    width: '100%',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Component;
