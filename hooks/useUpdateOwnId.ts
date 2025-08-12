import api from '@/store/api';
import * as SecureStore from 'expo-secure-store';
import { useCallback } from 'react';
import { Alert } from 'react-native';

type Options = {
  onSuccess?: (ownId: string) => void;
};

export function useUpdateOwnId() {
  const update = useCallback(async (ownId: string, opts?: Options) => {
    const nextOwnId = (ownId ?? '').trim();
    if (!nextOwnId) return;

    try {
      const token = await SecureStore.getItemAsync('JWTToken');
      if (!token) {
        Alert.alert(
          '로그인이 필요해요',
          '세션이 만료되었거나 로그인 정보가 없어요. 다시 로그인해 주세요.',
        );
        return;
      }

      // 서버가 전체 필드를 요구하는 경우 대비: SecureStore에서 있으면 함께 전달
      let fallbackNickname: string | undefined;
      let fallbackGender: string | undefined;
      let fallbackBirth: string | undefined;
      try {
        const savedUser = await SecureStore.getItemAsync('user');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          const userObj = parsed?.user ?? parsed ?? {};
          fallbackNickname = userObj?.nickname || undefined;
          fallbackGender = userObj?.gender || undefined;
          fallbackBirth = userObj?.birth || undefined;
        }
      } catch {}

      const payloadBody: any = { ownId: nextOwnId };
      if (fallbackNickname) payloadBody.nickname = fallbackNickname;
      if (fallbackGender) payloadBody.gender = fallbackGender;
      if (fallbackBirth) payloadBody.birth = fallbackBirth;

      console.log('[useUpdateOwnId] PATCH payload:', payloadBody);

      const res = await api.patch('/api/v1/users/me/profiles', payloadBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = res?.data;
      const payload = data?.data ?? data;

      if (data?.success) {
        const serverOwnId = payload?.ownId ?? payload?.user?.ownId ?? nextOwnId;

        // SecureStore('user') 동기화
        try {
          const saved = await SecureStore.getItemAsync('user');
          if (saved) {
            const parsed = JSON.parse(saved);
            const userObj = parsed?.user ?? parsed ?? {};
            const updated = {
              ...parsed,
              user: {
                ...userObj,
                ownId: serverOwnId,
              },
            };
            await SecureStore.setItemAsync('user', JSON.stringify(updated));
          }
        } catch (e) {
          console.log('[useUpdateOwnId] user(ownId) 동기화 실패(무시 가능)');
        }

        opts?.onSuccess?.(serverOwnId);
        Alert.alert('완료', '아이디가 수정되었습니다!');
        return;
      }

      const code = data?.error?.code;
      const message = data?.error?.message;
      if (code === 'T1201') {
        Alert.alert('세션 만료', '토큰을 확인해 주세요. 다시 로그인해 주세요.');
        return;
      }
      if (code === 'E1300') {
        Alert.alert(
          '수정할 데이터 없음',
          '변경된 내용이 없어요. 값을 수정한 뒤 다시 시도해 주세요.',
        );
        return;
      }
      Alert.alert('수정 실패', message || '알 수 없는 오류가 발생했어요.');
    } catch (error: any) {
      console.error('[useUpdateOwnId] 에러:', error);
      console.log('[useUpdateOwnId] status:', error?.response?.status);
      console.log('[useUpdateOwnId] data:', error?.response?.data);

      const status = error?.response?.status;
      const code = error?.response?.data?.error?.code;
      const message = error?.response?.data?.error?.message;

      if (status === 401 || code === 'T1201') {
        Alert.alert('세션 만료', '토큰을 확인해 주세요. 다시 로그인해 주세요.');
        return;
      }
      if (status === 404 || code === 'E1300') {
        Alert.alert(
          '수정할 데이터 없음',
          '변경된 내용이 없어요. 값을 수정한 뒤 다시 시도해 주세요.',
        );
        return;
      }
      Alert.alert(
        '네트워크 오류',
        '일시적인 문제일 수 있어요. 잠시 후 다시 시도해 주세요.',
      );
    }
  }, []);

  return update;
}
