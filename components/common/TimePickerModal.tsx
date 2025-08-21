import { Picker } from '@react-native-picker/picker';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/typography';
import api from '@/store/api';

interface TimePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSave?: () => void;
}

export default function TimePickerModal({
  visible,
  onClose,
  onSave,
}: TimePickerModalProps) {
  // 표시용 시간 (모달에서 저장 시 갱신)
  const [displayAmpm, setDisplayAmpm] = useState<'오전' | '오후'>('오전');
  const [displayHour, setDisplayHour] = useState('10');
  const [displayMinute, setDisplayMinute] = useState('00');

  // 모달 내부 상태
  const [ampm, setAmpm] = useState<'오전' | '오후'>(displayAmpm);
  const [hour, setHour] = useState(displayHour);
  const [minute, setMinute] = useState(displayMinute);

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      // 모달이 열릴 때마다 현재 저장된 시간을 불러옴
      loadCurrentTime();
    }
  }, [visible]);

  const loadCurrentTime = async () => {
    try {
      const userStr = await SecureStore.getItemAsync('user');
      const parsed = userStr ? JSON.parse(userStr) : {};
      const initial = parsed?.recomsTime || parsed?.user?.recomsTime;
      if (initial) {
        console.log(
          '[TimePickerModal] 초기 recomsTime:',
          initial,
          typeof initial,
        );
        const initialStr = String(initial);
        applyFromHHmm(initialStr);
      }
    } catch (e) {
      console.log('[TimePickerModal] 초기화 실패', e);
    }
  };

  const hours = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, '0'),
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, '0'),
  );

  const openModal = () => {
    setAmpm(displayAmpm);
    setHour(String(displayHour));
    setMinute(String(displayMinute));
  };

  // 모달이 열릴 때마다 현재 설정을 반영
  useEffect(() => {
    if (visible) {
      openModal();
    }
  }, [visible, displayAmpm, displayHour, displayMinute]);

  const saveTime = async () => {
    try {
      setIsSaving(true);

      // UI 적용
      setDisplayAmpm(ampm);
      setDisplayHour(hour);
      setDisplayMinute(minute);

      // 12h -> 24h + HHmm 포맷 (콜론 없이)
      let h24 = parseInt(hour, 10);
      if (ampm === '오후' && h24 !== 12) h24 += 12;
      if (ampm === '오전' && h24 === 12) h24 = 0;
      const recomsTime = `${h24.toString().padStart(2, '0')}${minute}`;
      console.log('[TimePickerModal] PATCH recomsTime:', recomsTime);

      // 토큰 헤더
      const token = await SecureStore.getItemAsync('JWTToken');
      if (!token) {
        console.warn('[TimePickerModal] JWTToken 없음');
      }

      const payload = { recomsTime };
      console.log('[TimePickerModal] PATCH payload:', payload);

      const res = await api.patch('/api/v1/users/me/profiles', payload, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          'Content-Type': 'application/json',
        },
      });
      console.log('[TimePickerModal] PATCH 응답:', res?.status, res?.data);

      // SecureStore 갱신
      try {
        const saved = await SecureStore.getItemAsync('user');
        if (saved) {
          const parsed = JSON.parse(saved);
          const updated = {
            ...parsed,
            recomsTime,
            user: { ...(parsed?.user ?? {}), recomsTime },
          };
          await SecureStore.setItemAsync('user', JSON.stringify(updated));
        }
      } catch {}

      onClose();
      onSave?.(); // 저장 완료 콜백
    } catch (e) {
      console.error('[TimePickerModal] 저장 실패:', e);

      // @ts-ignore
      const serverMsg = e?.response?.data?.error?.message || '';

      // BE 마이그레이션 이슈일 때 로컬 저장
      // @ts-ignore
      if (e?.response?.status === 500 && serverMsg.includes('refresh_token')) {
        console.warn('[TimePickerModal] 서버 500 → 로컬 저장으로 대체');
        try {
          let h24 = parseInt(hour, 10);
          if (ampm === '오후' && h24 !== 12) h24 += 12;
          if (ampm === '오전' && h24 === 12) h24 = 0;
          const recomsTime = `${h24.toString().padStart(2, '0')}${minute}`;

          const saved = await SecureStore.getItemAsync('user');
          if (saved) {
            const parsed = JSON.parse(saved);
            const updated = {
              ...parsed,
              recomsTime,
              user: { ...(parsed?.user ?? {}), recomsTime },
            };
            await SecureStore.setItemAsync('user', JSON.stringify(updated));
          }
          Alert.alert(
            '임시 저장',
            '서버 점검 중이라 변경사항을 기기에 임시 저장했어요.',
          );
          onClose();
          onSave?.();
          return;
        } catch {}
      }

      // 일반 에러
      Alert.alert(
        '저장 실패',
        serverMsg || '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  //HHmm 포맷에서 표시 상태로 적용
  const applyFromHHmm = (hhmm?: string | number) => {
    if (!hhmm) return;
    const hhmm_str = String(hhmm);
    const normalized = hhmm_str.includes(':')
      ? hhmm_str
      : `${hhmm_str.slice(0, 2)}:${hhmm_str.slice(2, 4)}`;
    const [hStr, mStr] = normalized.split(':');
    const h = Math.max(0, Math.min(23, parseInt(hStr || '0', 10)));
    const isPM = h >= 12;
    const twelveHour = h % 12 === 0 ? 12 : h % 12;
    setDisplayAmpm(isPM ? '오후' : '오전');
    setDisplayHour(String(twelveHour).padStart(2, '0'));
    setDisplayMinute(String(mStr || '00').padStart(2, '0'));
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalWrapper}>
          {/* 헤더 */}
          <View style={styles.headerBox}>
            <Text style={styles.headerTitle}>추천곡 수신 시간 설정</Text>
          </View>

          {/* 바디 */}
          <View style={styles.bodyBox}>
            {/* Picker 영역 */}
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

            {/* 버튼 영역 */}
            <TouchableOpacity
              style={[styles.saveBtn, isSaving && { opacity: 0.6 }]}
              onPress={isSaving ? undefined : saveTime}
              disabled={isSaving}
            >
              <Text style={styles.saveBtnText}>
                {isSaving ? '저장 중…' : '저장'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
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
    backgroundColor: Colors.palette.Gray700,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    color: Colors.palette.Gray100,
    ...Typography.subtitle3,
    textAlign: 'center',
  },
  bodyBox: {
    width: 324,
    backgroundColor: Colors.palette.Gray700,
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
  saveBtn: {
    backgroundColor: Colors.palette.point,
    padding: 16,
    height: 50,
    width: 324,
    borderBottomEndRadius: 10,
    borderBottomLeftRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    color: Colors.palette.Gray100,
    ...Typography.subtitle3,
  },
});
