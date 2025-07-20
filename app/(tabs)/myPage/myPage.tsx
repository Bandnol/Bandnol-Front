import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import SearchIcon from '@/assets/icons/search.svg';
import SettingIcon2 from '@/assets/icons/setting.svg';
import ShareIcon from '@/assets/icons/share.svg';
import WriteIcon from '@/assets/icons/write.svg';
import { Typography } from '@/constants/tyopography';

const screenWidth = Dimensions.get('window').width;

export default function MyPage() {
  const [activeTab, setActiveTab] = useState<'post' | 'media' | 'bookmark'>(
    'post',
  );
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      {/* 배경 이미지 */}
      <ImageBackground
        source={require('@/assets/images/profile-background.jpg')}
        style={styles.topImage}
        resizeMode="cover"
        imageStyle={styles.imageInner}
      >
        <LinearGradient
          colors={['rgba(18,18,18,0)', '#121212']}
          style={styles.gradient}
        />

        {/* 상단 아이콘 */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.push('/myPage/myPageSearch')}
            style={styles.searchButton}
          >
            <SearchIcon width={24} height={24} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/myPage/appSetting')}
            style={styles.settingButton}
          >
            <SettingIcon2 width={24} height={24} />
          </TouchableOpacity>
        </View>
      </ImageBackground>
      {/* 프로필 섹션 */}
      <View style={styles.profileRow}>
        {/* 프로필 이미지 */}
        <Image
          source={require('@/assets/images/profile.png')}
          style={styles.profileImage}
        />

        {/* 닉네임 + 유저아이디 */}
        <View style={styles.nicknameBox}>
          <Text style={styles.nickname}>Nickname</Text>
          <Text style={styles.userId}>@user_id</Text>
        </View>

        {/* 공유 아이콘 */}
        <TouchableOpacity style={styles.shareButton}>
          <ShareIcon width={24} height={24} />
        </TouchableOpacity>

        {/* 프로필 편집 버튼 */}
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>프로필 편집</Text>
        </TouchableOpacity>
      </View>
      {/* 팔로워 섹션 */}
      <View style={styles.followerRow}>
        <View style={[styles.followerImages, { flexDirection: 'row-reverse' }]}>
          <Image
            source={require('@/assets/images/profile.png')}
            style={styles.followerImage}
          />
          <Image
            source={require('@/assets/images/profile.png')}
            style={[styles.followerImage, { marginRight: -6 }]}
          />
          <Image
            source={require('@/assets/images/profile.png')}
            style={[styles.followerImage, { marginRight: -6 }]}
          />
        </View>
        <Text style={styles.followerText}>팔로워 830명</Text>
      </View>
      <View style={styles.layoutRow}>
        <View style={styles.layoutBox}>
          <Text style={styles.layoutText}>#페퍼톤스</Text>
        </View>
        <View style={styles.layoutBox}>
          <Text style={styles.layoutText}>#공연후기</Text>
        </View>
        <View style={styles.layoutBox}>
          <Text style={styles.layoutText}>#고고학</Text>
        </View>
      </View>
      <Text style={styles.introText}>신나고 재미있게 평생...</Text>
      {/* // 버튼 레이아웃 (UI 구성용) */}
      <View style={styles.buttonWrapper}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'post' && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab('post')}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'post' && styles.activeTabText,
              ]}
            >
              포스트
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'media' && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab('media')}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'media' && styles.activeTabText,
              ]}
            >
              미디어
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'bookmark' && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab('bookmark')}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'bookmark' && styles.activeTabText,
              ]}
            >
              북마크
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.textFieldContainer}>
        {/* 프로필  + 글쓰기  */}
        <View style={styles.textFieldHeader}>
          <Image
            source={require('@/assets/images/profile.png')}
            style={styles.textFieldProfile}
          />
          <View style={styles.textFieldTextWrapper}>
            <Text style={styles.textFieldName}>sayoxx</Text>
            <View style={styles.textFieldRow}>
              <WriteIcon
                width={18}
                height={18}
                style={{ marginRight: 5, marginTop: 5 }}
              />
              <Text style={styles.textFieldGuide}>
                오늘의 밴놀을 공유해주세요!
              </Text>
            </View>
          </View>
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
  topImage: {
    width: screenWidth,
    height: 200,
  },
  imageInner: {
    height: '100%',
    width: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    zIndex: 1,
  },
  header: {
    width: '100%',
    height: 44,
    paddingHorizontal: 20,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  searchButton: {
    marginRight: 15,
  },
  settingButton: {
    marginRight: 0,
  },

  // ✅ 프로필 (이미지 + 텍스트 + 아이콘 + 버튼)
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -13, // 배경 이미지와 겹치게
    paddingLeft: 20,
  },
  profileImage: {
    width: 76,
    height: 76,
    borderRadius: 38,
  },
  nickname: {
    ...Typography.subtitle1b,
    color: '#FFF',
  },
  nicknameBox: {
    marginTop: 15,
    marginLeft: 15,
    justifyContent: 'center',
  },
  userId: {
    ...Typography.body2,
    color: '#7C7C7C',
    marginTop: 2,
  },
  shareButton: {
    marginLeft: 58,
    marginTop: 16,
  },
  editButton: {
    marginLeft: 20,
    marginTop: 13,
    width: 82,
    height: 30,
    backgroundColor: '#121212',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#7C7C7C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    ...Typography.subtitle4,
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  // ✅ 팔로워 (이클립스 세 개)
  followerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginLeft: 20,
  },
  followerImages: {
    flexDirection: 'row',
  },
  followerImage: {
    width: 21,
    height: 21,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#121212',
    backgroundColor: 'lightgray',
  },
  followerText: {
    marginLeft: 10,
    ...Typography.caption1,
    color: '#999',
  },
  // ✅ 해시태그
  layoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginLeft: 20,
    gap: 10,
  },
  layoutBox: {
    height: 27,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#333',
  },
  layoutText: {
    ...Typography.subtitle4,
    color: '#FFF',
  },
  // ✅ 한줄소개
  introText: {
    marginTop: 27,
    marginLeft: 20,
    ...Typography.body2,
    color: '#FFF',
  },
  // ✅ 버튼
  buttonWrapper: {
    marginTop: 40,
    marginLeft: 84,
    marginRight: 84,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 70,
    backgroundColor: '#1F1F1F',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: 'transparent', // 비활성 배경
  },
  activeTabButton: {
    backgroundColor: '#FFF',
  },
  tabButtonText: {
    ...Typography.subtitle3,
    color: '#FFF',
  },
  activeTabText: {
    ...Typography.subtitle3,
    color: '#000',
  },
  // ✅ 글쓰기 칸
  textFieldContainer: {
    marginTop: 22,
    marginHorizontal: 20,
    padding: 20,
    width: 355,
    borderRadius: 5,
    backgroundColor: '#1F1F1F',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  textFieldHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  textFieldProfile: {
    width: 36,
    height: 36,
    borderRadius: 9999,
    borderWidth: 0.342,
    borderColor: '#7C7C7C',
  },
  textFieldTextWrapper: {
    flexDirection: 'column',
  },
  textFieldName: {
    ...Typography.subtitle3,
    color: '#FFF',
  }, // 사요 닉네임
  textFieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textFieldGuide: {
    color: '#B3B3B3',
    fontFamily: 'Pretendard',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 14,
    letterSpacing: -0.42,
    marginTop: 8.5,
  }, //오늘의 밴놀을 공유해 주세요
});
