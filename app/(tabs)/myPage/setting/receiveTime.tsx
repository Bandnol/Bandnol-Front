import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import BackArrow from '@/assets/icons/back-arrow.svg';
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/typography';
import api from '@/store/api';

// 생년월일 문자열을 YYYY-MM-DD로 정규화 (허용: YYYYMMDD, YYYY-MM-DD, YYYY.MM.DD, YYYY/MM/DD)
const normalizeBirth = (raw?: string | null): string | null => {
  if (!raw) return null;
  const s = String(raw).trim();
  if (!s) return null;
  const digits = s.replace(/[^0-9]/g, '');
  if (digits.length !== 8) return null;
  const y = digits.slice(0, 4);
  const m = digits.slice(4, 6);
  const d = digits.slice(6, 8);
  // 간단한 유효성 검사
  const mm = Number(m),
    dd = Number(d);
  if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return null;
  return `${y}-${m}-${d}`;
};

export default function ReceiveTime() {
  const router = useRouter();
  const [user, setUser] = useState<any>({});

  // 표시용 시간 (모달에서 저장 시 갱신)
  const [displayAmpm, setDisplayAmpm] = useState<'오전' | '오후'>('오전');
  const [displayHour, setDisplayHour] = useState('10');
  const [displayMinute, setDisplayMinute] = useState('00');

  // 모달 내부 상태
  const [ampm, setAmpm] = useState<'오전' | '오후'>(displayAmpm);
  const [hour, setHour] = useState(displayHour);
  const [minute, setMinute] = useState(displayMinute);

  const [visible, setVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const userStr = await SecureStore.getItemAsync('user');
        const parsed = userStr ? JSON.parse(userStr) : {};
        setUser(parsed?.user ?? parsed ?? {});
        const initial = parsed?.recomsTime || parsed?.user?.recomsTime;
        if (initial) {
          console.log('[수신 시간] 초기 recomsTime:', initial);
          applyFromHHmm(initial);
        }
      } catch (e) {
        console.log('[수신 시간] 초기화 실패', e);
      }
    })();
  }, []);

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

  const saveTime = async () => {
    try {
      setIsSaving(true);
      // UI 적용
      setDisplayAmpm(ampm);
      setDisplayHour(hour);
      setDisplayMinute(minute);

      // 12h -> 24h (서버 전송 형식: HHmm)
      let h24 = parseInt(hour, 10);
      if (ampm === '오후' && h24 !== 12) h24 += 12;
      if (ampm === '오전' && h24 === 12) h24 = 0;
      const recomsTime = `${h24.toString().padStart(2, '0')}${minute}`;
      console.log('[수신 시간] PATCH recomsTime:', recomsTime);

      // 토큰 헤더
      const token = await SecureStore.getItemAsync('JWTToken');
      if (!token) {
        console.warn(
          '[수신 시간] JWTToken 없음: Authorization 헤더가 비게 됩니다.',
        );
      }

      const birthNorm = normalizeBirth(
        user?.birth ?? user?.user?.birth ?? null,
      );

      const payload: any = { recomsTime };
      if (birthNorm) payload.birth = birthNorm; // 서버가 birth 검증 시 함께 전달
      console.log('[수신 시간] PATCH payload:', payload);

      const res = await api.patch('/api/v1/users/me/profiles', payload, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          'Content-Type': 'application/json',
        },
      });
      console.log('[수신 시간] PATCH 응답:', res?.status, res?.data);

      // SecureStore 갱신(루트/중첩 모두 반영)
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
      setVisible(false);
    } catch (e) {
      console.error('[수신 시간] 저장 실패:', e);
      // 추가 디버깅 정보
      // @ts-ignore
      console.log('[수신 시간] error.status:', e?.response?.status);
      // @ts-ignore
      console.log('[수신 시간] error.data:', e?.response?.data);

      // 서버 메시지 추출
      // @ts-ignore
      const serverMsg = e?.response?.data?.error?.message || '';

      // BE 마이그레이션 이슈(Prisma refresh_token 컬럼 누락)일 때: 로컬에만 저장하고 닫기 (임시 워크어라운드)
      // @ts-ignore
      if (e?.response?.status === 500 && serverMsg.includes('refresh_token')) {
        console.warn(
          '[수신 시간] 서버 500(Prisma refresh_token 컬럼 누락) → 로컬 저장으로 대체',
        );
        try {
          // 12h -> 24h (서버 전송 형식: HHmm)
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
            '서버 점검 중이라 변경사항을 기기에 임시 저장했어요. 서버 복구 후 자동으로 동기화됩니다.',
          );
          setVisible(false);
          return; // 종료
        } catch {}
      }

      // 일반 에러: 모달 유지 + 메시지 표시
      Alert.alert(
        '저장 실패',
        serverMsg || '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  // HHmm 포맷에서 표시 상태로 적용
  const applyFromHHmm = (hhmm?: string) => {
    if (!hhmm) return;
    const normalized = hhmm.includes(':')
      ? hhmm
      : `${hhmm.slice(0, 2)}:${hhmm.slice(2, 4)}`;
    const [hStr, mStr] = normalized.split(':');
    const h = Math.max(0, Math.min(23, parseInt(hStr || '0', 10)));
    const isPM = h >= 12;
    const twelveHour = h % 12 === 0 ? 12 : h % 12;
    setDisplayAmpm(isPM ? '오후' : '오전');
    setDisplayHour(twelveHour.toString().padStart(2, '0'));
    setDisplayMinute((mStr || '00').padStart(2, '0'));
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.palette.Gray900,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.palette.Gray900,
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
    color: Colors.palette.Gray100,
  },
  row: {
    paddingVertical: 24,
    paddingHorizontal: 32,
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.palette.Gray600,
    flexDirection: 'row',
  },
  timeText: {
    color: Colors.palette.Gray100,
    ...Typography.body1,
  },
  linkText: {
    ...Typography.body1,
    color: Colors.palette.Gray600,
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
    fontFamily: 'Pretendard',
    fontWeight: 600,
    letterSpacing: -0.45,
    lineHeight: 18 * 1.4,
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
