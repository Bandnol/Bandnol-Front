import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import BackArrowIcon from '@/assets/icons/back-arrow.svg';
import ProfileImage from '@/assets/images/profile.png';
import { Typography } from '@/constants/typography';

export default function FollowPage() {
  const [followerList, setFollowerList] = useState([
    { id: 1, name: '사요 sayo', username: '@sayoxx', isMutual: true },
    { id: 2, name: '사요 sayo', username: '@sayoxx', isMutual: false },
    { id: 3, name: '사요 sayo', username: '@sayoxx', isMutual: true },
    { id: 4, name: '사요 sayo', username: '@sayoxx', isMutual: true },
    { id: 5, name: '사요 sayo', username: '@sayoxx', isMutual: false },
    { id: 6, name: '사요 sayo', username: '@sayoxx', isMutual: true },
    { id: 7, name: '사요 sayo', username: '@sayoxx', isMutual: true },
  ]);

  const followingList = [
    { id: 1, name: '사요 sayo', username: '@sayoxx', followsMe: true },
    { id: 2, name: '사요 sayo', username: '@sayoxx', followsMe: true },
    { id: 3, name: '사요 sayo', username: '@sayoxx', followsMe: false },
    { id: 4, name: '사요 sayo', username: '@sayoxx', followsMe: false },
    { id: 5, name: '사요 sayo', username: '@sayoxx', followsMe: true },
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
            <BackArrowIcon width={24} height={24} />
          </TouchableOpacity>
          {/* 팔로잉 팔로워 버튼 */}
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

        {/* List */}
        <ScrollView contentContainerStyle={styles.listWrapper}>
          {activeTab === 'followers'
            ? followerList.map((user) => (
                <View style={styles.userBox} key={user.id}>
                  <Image source={ProfileImage} style={styles.avatar} />
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
                  <Image source={ProfileImage} style={styles.avatar} />
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
  }, //버튼 css
  tabButtonGroup: {
    flexDirection: 'row',
    marginLeft: 70,
    borderRadius: 70,
    backgroundColor: '#1F1F1F',
    overflow: 'hidden',
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#1F1F1F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#FFF',
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
  }, // 유저 목록
  listWrapper: {
    paddingTop: 10,
  },
  userBox: {
    width: 340,
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
