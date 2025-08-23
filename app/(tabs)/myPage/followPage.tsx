import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import BackArrowIcon from '@/assets/icons/back-arrow.svg';
import ProfileImage from '@/assets/images/profile.png';
import { Typography } from '@/constants/typography';

import P1 from '@/assets/images/followerdummy/profile1.jpg';
import P2 from '@/assets/images/followerdummy/profile2.jpg';
import P3 from '@/assets/images/followerdummy/profile3.jpg';
import P4 from '@/assets/images/followerdummy/profile4.jpg';
import P5 from '@/assets/images/followerdummy/profile5.jpg';
import P6 from '@/assets/images/followerdummy/profile6.jpg';
import P7 from '@/assets/images/followerdummy/profile7.jpg';
import P8 from '@/assets/images/followerdummy/profile8.jpg';
import P9 from '@/assets/images/followerdummy/profile9.jpg';

const AVATARS = [P1, P2, P3, P4, P5, P6, P7, P8, P9];

const pickAvatarById = (id: number, offset = 0) => {
  const idx = (id + offset) % AVATARS.length;
  return AVATARS[idx];
};

export default function FollowPage() {
  const [followerList, setFollowerList] = useState([
    { id: 1, name: '사요 sayo', username: '@sayoxx', isMutual: true },
    { id: 2, name: '징니 jing', username: '@jingni', isMutual: false },
    { id: 3, name: '이즈 izz', username: '@ddaiz', isMutual: true },
    { id: 4, name: '낑깡 Kaang', username: '@KkingKang', isMutual: true },
    { id: 5, name: '리예 leeyeah', username: '@leeyes', isMutual: false },
    { id: 6, name: '오즈 Oooz', username: '@0ozO0z', isMutual: true },
    { id: 7, name: '보현 bobo', username: '@hyunb', isMutual: true },
    { id: 8, name: '무니 mooney', username: '@moonmoon', isMutual: true },
    { id: 9, name: '깡다 kangda', username: '@kkak2ng', isMutual: true },
  ]);

  const followingList = [
    { id: 1, name: '사요 sayo', username: '@sayoxx', followsMe: true },
    { id: 5, name: '리예 leeyeah', username: '@leeyes', followsMe: true },
    { id: 7, name: '보현 bobo', username: '@hyunb', followsMe: false },
    { id: 9, name: '깡다 kangda', username: '@kkak2ng', followsMe: false },
    { id: 2, name: '징니 jing', username: '@jingni', followsMe: true },
  ];
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>(
    'followers',
  );

  const handleBack = () => {
    router.back();
  };

  const handleFollowToggle = (id: number) => {
    setFollowerList((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, isMutual: !user.isMutual } : user,
      ),
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* TopBar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={handleBack}>
            <BackArrowIcon width={22} height={18} />
          </TouchableOpacity>
          {/* 팔로잉 팔로워 버튼 */}
          <View style={styles.tabWrapper}>
            <View style={styles.tabButtonGroup}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  styles.tabButtonLeft,
                  activeTab === 'followers' && styles.tabButtonActive,
                ]}
                onPress={() => setActiveTab('followers')}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'followers' && styles.tabTextActive,
                  ]}
                >
                  팔로워
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.tabButton,
                  styles.tabButtonRight,
                  activeTab === 'following' && styles.tabButtonActive,
                ]}
                onPress={() => setActiveTab('following')}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'following' && styles.tabTextActive,
                  ]}
                >
                  팔로잉
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ width: 22 }} />
        </View>

        {/* List */}
        <ScrollView contentContainerStyle={styles.listWrapper}>
          {activeTab === 'followers'
            ? followerList.map((user) => (
                <View style={styles.userBox} key={user.id}>
                  <Image
                    source={pickAvatarById(user.id)}
                    style={styles.avatar}
                  />
                  <View style={styles.userInfo}>
                    <Text style={styles.name}>{user.name}</Text>
                    <Text style={styles.username}>{user.username}</Text>
                  </View>
                  <TouchableOpacity
                    style={
                      user.isMutual
                        ? styles.followingButton
                        : styles.mutualButton
                    }
                    onPress={() => handleFollowToggle(user.id)}
                  >
                    <Text
                      style={
                        user.isMutual ? styles.followingText : styles.mutualText
                      }
                    >
                      {user.isMutual ? '팔로잉' : '맞팔로우'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))
            : followingList.map((user) => (
                <View style={styles.userBox} key={user.id}>
                  <Image
                    source={pickAvatarById(user.id)}
                    style={styles.avatar}
                  />
                  <View style={styles.userInfo}>
                    <Text style={styles.name}>{user.name}</Text>
                    <Text style={styles.username}>{user.username}</Text>
                    {user.followsMe === true && (
                      <Text style={styles.subtext}>나를 팔로우합니다</Text>
                    )}
                  </View>
                  <View style={styles.followingBox}>
                    <Text style={styles.followButtonText}>팔로잉</Text>
                  </View>
                </View>
              ))}
        </ScrollView>
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
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  }, //버튼 css
  tabWrapper: {
    flex: 1,
    alignItems: 'center', // 중앙 정렬 핵심!
  },
  tabButtonGroup: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#1F1F1F',
    borderRadius: 70,
  },
  tabButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    gap: 10,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  tabButtonActive: {
    backgroundColor: '#F4F4F4',
  },
  tabButtonLeft: {
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  tabButtonRight: {
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  tabText: {
    color: '#7C7C7C',
    ...Typography.subtitle3,
  },
  tabTextActive: {
    color: '#121212',
    ...Typography.subtitle3,
  },
  listWrapper: {
    paddingTop: 10,
    alignItems: 'center',
  },
  userBox: {
    width: '103%',
    height: 50,
    backgroundColor: '#121212',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 3412,
    borderWidth: 0.342,
    borderColor: '#7C7C7C',
  },
  userInfo: {
    marginLeft: 10,
    flex: 1,
    flexDirection: 'row',
  },
  name: {
    color: '#FFF',
    ...Typography.subtitle3,
  },
  username: {
    color: '#7C7C7C',
    ...Typography.body2,
    marginLeft: 4,
  },
  subtext: {
    color: '#7C7C7C',
    ...Typography.caption2,
    marginLeft: 10,
  },
  followingButton: {
    backgroundColor: '#121212',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#7C7C7C',
  },
  mutualButton: {
    backgroundColor: '#F4F4F4',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  followingText: {
    color: '#DDD',
    fontSize: 12,
    fontFamily: 'Pretendard',
    letterSpacing: -0.36,
    fontWeight: 400,
  },
  mutualText: {
    color: '#121212',
    fontSize: 12,
    fontFamily: 'Pretendard',
    letterSpacing: -0.36,
    fontWeight: 400,
  },
  followingBox: {
    backgroundColor: '#121212',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#7C7C7C',
  },
  followButtonText: {
    fontSize: 12,
    fontFamily: 'Pretendard',
    letterSpacing: -0.36,
    fontWeight: 400,
    color: '#FFF',
  },
});
