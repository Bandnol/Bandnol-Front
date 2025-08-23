import * as Notifications from 'expo-notifications';
import { Platform, DeviceEventEmitter } from 'react-native';
import Constants from 'expo-constants';
import { useEffect, useRef, useState } from 'react';
import axiosInstance from '@/hooks/useAxios';
import { useRouter } from 'expo-router';

// 앱이 포그라운드일 때 알림을 어떻게 보여줄지 제어 (alert만 표시)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// 1. 권한 요청 + Android 채널 생성 + Expo Push Token 발급
async function registerForPushAsync() {
  // 권한 요청
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    console.log('[Push] 알림 권한 거부됨');
    return null;
  }

  // Android 채널
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // Expo Push Token
  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    (Constants as any)?.easConfig?.projectId;
  const tokenData = await Notifications.getExpoPushTokenAsync(
    projectId ? { projectId } : undefined,
  );
  return tokenData.data; // e.g. ExponentPushToken[xxxxx]
}

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const token = await registerForPushAsync();
      setExpoPushToken(token);

      if (token) {
        console.log('[Push] Expo token:', token);
        // 1-1. 발급 받은 Expo Push Token을 서버에 저장 (POST /api/v1/users/expo-token)
        try {
          const res = await axiosInstance.post<any>('/api/v1/users/expo-token', { token });
          console.log('[Push] 토큰 등록 응답(POST /users/expo-token):', res.data);
        } catch (e) {
          console.log('[Push] 토큰 등록 실패:', e);
        }
      }
    })();

    // 2. 앱 포그라운드 수신: 단순 로깅 (UI 필요 시 여기서 처리)
    notificationListener.current =
      Notifications.addNotificationReceivedListener((n) => {
        console.log('[Push] 수신(포그라운드):', n.request.content);
      });

    // 3. 알림 탭(클릭) 응답 처리
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(
        async (response) => {
          const data = response.notification.request.content.data as any;
          console.log('[Push] 탭 응답 data:', data);

          // 1) 읽음 처리: /api/v1/users/notification/{notificationId}
          const notificationId = data?.notificationId ?? data?.id;
          const nType = data?.type; // 예: 'NOT_RECOMS' 등
          if (notificationId) {
            try {
              const endpoint = `/api/v1/users/notification/${encodeURIComponent(String(notificationId))}`;
              const body = nType ? JSON.stringify({ type: nType }) : undefined;
              const res = await axiosInstance.patch<any>(endpoint, body ? JSON.parse(body) : undefined);
              console.log('[Push] 읽음 처리 성공:', res.data);
              // 3-1. 읽음 처리 성공 시 알림함 새로고침 이벤트 방송
              DeviceEventEmitter.emit('NOTI_REFRESH');
            } catch (e) {
              console.log('[Push] 읽음 처리 실패:', e);
            }
          }

          // 3-2. data.link가 있으면 해당 경로로 이동, 없으면 기본 알림함으로 이동
          const link = typeof data?.link === 'string' ? data.link : undefined;
          if (link && link.startsWith('/')) {
            try {
              router.push(link);
            } catch (e) {
              console.log('[Push] 라우팅 실패, 기본 화면 이동:', e);
              router.push('/(tabs)/music-recommend/alarmCenter');
            }
          } else {
            router.push('/(tabs)/music-recommend/alarmCenter');
          }
        },
      );

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
      notificationListener.current = null;
      responseListener.current = null;
    };
  }, [router]);

  return { expoPushToken };
}
