import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import BackArrow from '@/assets/icons/back-arrow.svg';
import { Typography } from '@/constants/tyopography';

export default function ReceiveTime() {
  const router = useRouter();

  // 표시용 시간 (모달에서 저장 시 갱신)
  const [displayAmpm, setDisplayAmpm] = useState<'오전' | '오후'>('오전');
  const [displayHour, setDisplayHour] = useState('10');
  const [displayMinute, setDisplayMinute] = useState('00');

  // 모달 내부 상태
  const [ampm, setAmpm] = useState<'오전' | '오후'>(displayAmpm);
  const [hour, setHour] = useState(displayHour);
  const [minute, setMinute] = useState(displayMinute);

  const [visible, setVisible] = useState(false);

  const hours = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, '0'),
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, '0'),
  );

  const openModal = () => {
    setAmpm(displayAmpm);
    setHour(displayHour);
    setMinute(displayMinute);
    setVisible(true);
  };

  const saveTime = () => {
    setDisplayAmpm(ampm);
    setDisplayHour(hour);
    setDisplayMinute(minute);
    // TODO: API 저장
    setVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />

        {/* Top Nav Bar */}
        <View style={styles.topNavBar}>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/myPage/setting/appSetting')}
            style={styles.backBtn}
          >
            <BackArrow width={9} height={16} />
          </TouchableOpacity>
          <Text style={styles.title}>추천곡 수신 시간</Text>
          <View style={{ width: 24, height: 24 }} />
        </View>

        <View style={styles.row}>
          <Text style={styles.timeText}>
            {displayAmpm} {displayHour}:{displayMinute}
          </Text>
          <TouchableOpacity onPress={openModal}>
            <Text style={styles.linkText}>변경</Text>
          </TouchableOpacity>
        </View>

        {/* Modal */}
        <Modal
          transparent
          animationType="fade"
          visible={visible}
          onRequestClose={() => setVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalWrapper}>
              {/* 1) 헤더 컨테이너 */}
              <View style={styles.headerBox}>
                <Text style={styles.headerTitle}>추천곡 수신 시간 설정</Text>
              </View>

              {/* 2) 바디 컨테이너 */}
              <View style={styles.bodyBox}>
                {/* Picker 영역 */}
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={ampm}
                    onValueChange={(v) => setAmpm(v)}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                  >
                    <Picker.Item label="오전" value="오전" />
                    <Picker.Item label="오후" value="오후" />
                  </Picker>

                  <Picker
                    selectedValue={hour}
                    onValueChange={(v) => setHour(v)}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                  >
                    {hours.map((h) => (
                      <Picker.Item key={h} label={h} value={h} />
                    ))}
                  </Picker>

                  <Picker
                    selectedValue={minute}
                    onValueChange={(v) => setMinute(v)}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                  >
                    {minutes.map((m) => (
                      <Picker.Item key={m} label={m} value={m} />
                    ))}
                  </Picker>
                </View>

                {/* 버튼 영역 */}
                <TouchableOpacity style={styles.saveBtn} onPress={saveTime}>
                  <Text style={styles.saveBtnText}>저장</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  topNavBar: {
    width: '100%',
    height: 62,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  backBtn: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    ...Typography.subtitle1B,
    color: '#F4F4F4',
  },
  row: {
    paddingVertical: 24,
    paddingHorizontal: 32,
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    borderBottomWidth: 0.5,
    borderBottomColor: '#555',
    flexDirection: 'row',
  },
  timeText: {
    color: '#F4F4F4',
    ...Typography.body1,
  },
  linkText: {
    ...Typography.body1,
    color: '#555',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
  }, // ---- 모달 시작 -----
  modalBackground: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalWrapper: {
    width: 324,
    height: 288,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  headerBox: {
    width: 324,
    backgroundColor: '#333',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    color: '#F4F4F4',
    ...Typography.subtitle3,
    textAlign: 'center',
  },
  bodyBox: {
    width: 324,
    backgroundColor: '#333',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  pickerWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  picker: {
    height: 140,
    width: 80,
    color: '#333',
  },
  pickerItem: {
    fontSize: 18,
    fontFamily: 'Pretendard',
    fontWeight: 600,
    letterSpacing: -0.45,
    lineHeight: 18 * 1.4,
  },

  saveBtn: {
    backgroundColor: '#FB4932',
    padding: 16,
    height: 50,
    width: 324,
    borderBottomEndRadius: 10,
    borderBottomLeftRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    color: '#F4F4F4',
    ...Typography.subtitle3,
  },
});
