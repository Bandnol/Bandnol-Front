import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import BackArrow from '@/assets/icons/back-arrow.svg';
import { Typography } from '@/constants/typography';
import axiosInstance from '@/hooks/useAxios';

export default function AppSetting() {
  const router = useRouter();

  type Noti = {
    id?: string;
    title?: string;
    message?: string;
    body?: string;
    type?: string;
    createdAt?: string;
    [k: string]: any;
  };

  const [notis, setNotis] = React.useState<Noti[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [errorText, setErrorText] = React.useState<string>('');

  React.useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setErrorText('');
      try {
        const res = await axiosInstance.get<{
          success: boolean;
          data: { data: Noti[]; hasNext?: boolean; nextCursor?: string } | null;
          error: any;
        }>(`/api/v1/users/me/notification`);
        const list = res?.data?.data?.data || [];
        setNotis(list);
        console.log('[알림] 조회 성공:', res.data);
      } catch (error: any) {
        const msg = error?.message || String(error);
        console.log('[알림] 조회 예외:', msg);
        setErrorText('알림을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

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
            onPress={() => router.push('/(tabs)/myPage/myPage')}
            style={styles.backBtn}
          >
            <BackArrow width={9} height={16} />
          </TouchableOpacity>
          <Text style={styles.title}>설정</Text>
          {/* 자리를 맞추기 위한 더미 View */}
          <View style={{ width: 24, height: 24 }} />
        </View>

        {/* List - 개별 router.push */}
        <View style={styles.listWrapper}>
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => router.push('/myPage/setting/userInfo')}
          >
            <Text style={styles.itemText}>회원 정보</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.listItem}
            onPress={() => router.push('/myPage/setting/interestedArtists')}
          >
            <Text style={styles.itemText}>관심 아티스트 설정</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.listItem}
            onPress={() => router.push('/myPage/setting/receiveTime')}
          >
            <Text style={styles.itemText}>추천곡 수신 시간</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.listItem}
            onPress={() => router.push('/myPage/setting/notification')}
          >
            <Text style={styles.itemText}>알림</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.listItem}
            onPress={() => router.push('/myPage/setting/termsOfService')}
          >
            <Text style={styles.itemText}>이용약관</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.listItem}
            onPress={() =>
              router.push({
                pathname: '/(auth)/inquiry',
                params: { returnTo: '/(tabs)/myPage/setting/appSetting' },
              })
            }
          >
            <Text style={styles.itemText}>문의하기</Text>
          </TouchableOpacity>
        </View>
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
  listWrapper: {
    width: '100%',
  },
  listItem: {
    paddingVertical: 24,
    paddingHorizontal: 32,
    alignItems: 'center',
    alignSelf: 'stretch',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#555',
  },
  itemText: {
    color: '#FFFFFF',
    alignSelf: 'flex-start',
    ...Typography.body1,
  },
  sectionTitle: {
    color: '#F4F4F4',
    ...Typography.subtitle2B,
  },
  errorText: {
    color: '#FF6B6B',
    ...Typography.body2,
    marginTop: 12,
  },
  emptyText: {
    color: '#7C7C7C',
    ...Typography.body2,
    textAlign: 'center',
    marginTop: 16,
  },
  notiItem: {
    backgroundColor: '#121212',
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  notiTitle: {
    color: '#F4F4F4',
    ...Typography.subtitle3,
    marginBottom: 4,
  },
  notiBody: {
    color: '#CFCFCF',
    ...Typography.body2,
    marginBottom: 6,
  },
  notiTime: {
    color: '#7C7C7C',
    ...Typography.caption,
  },
});
