import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import BookmarkIcon from '@/assets/icons/bookmark.svg';
import BookmarkFillIcon from '@/assets/icons/bookmark-fill.svg';
import ClipIcon from '@/assets/icons/clip.svg';
import CloseIcon from '@/assets/icons/close.svg';
import LikeIcon from '@/assets/icons/heart.svg';
import MoreIcon from '@/assets/icons/more.svg';
import SearchIcon from '@/assets/icons/search.svg';
import SettingIcon2 from '@/assets/icons/setting.svg';
import ShareIcon from '@/assets/icons/share.svg';
import WriteIcon from '@/assets/icons/write.svg';
import DummyImage from '@/assets/images/dummy1.png';
import ProfileImage from '@/assets/images/profile.png';
import { Typography } from '@/constants/typography';
import { useUserOwnId } from '@/store/userStore';
import { getUserProfile } from '@/api/user';
import { Colors } from '@/constants/Colors';

const screenWidth = Dimensions.get('window').width;

const postData = [
  {
    id: 1,
    username: 'sayoxx',
    time: '2시간',
    visibility: '전체공개',
    text: '#오늘공연 오늘 잭킹콩 7주년 공연에 다녀왔다ㅜㅜ 너무 좋았다 투트럼펫 너무 짱이다~',
    hasImage: true,
    isBookmarked: false,
    likeCount: 1423,
    bookmarkCount: 114,
  },
  {
    id: 2,
    username: 'sayoxx',
    time: '3시간',
    visibility: '비공개',
    text: '#오늘공연 오늘 공연 skrr 사커고 싶다~~',
    hasImage: false,
    isBookmarked: false,
    likeCount: 300,
    bookmarkCount: 12,
  },
];

interface AppUserProfile {
  nickname: string;
  ownId: string;
  bio: string;
  photo: string | null;
  backgroundImg: string | null;
}

export default function MyPage() {
  const router = useRouter();
  const ownId = useUserOwnId();
  const [userProfile, setUserProfile] = useState<AppUserProfile | null>(null);
  const { width: windowWidth } = useWindowDimensions();

  const fetchUserProfile = useCallback(async () => {
    if (ownId) {
      try {
        const data = await getUserProfile(ownId);
        setUserProfile(data);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    }
  }, [ownId]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
      return () => {};
    }, [fetchUserProfile]),
  );

  const [activeTab, setActiveTab] = useState<'post' | 'media' | 'bookmark'>(
    'post',
  );
  const [posts, setPosts] = useState(postData);
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);

  const handleToggleBookmark = (id: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, isBookmarked: !post.isBookmarked } : post,
      ),
    );
  };

  const filteredPosts = postData.filter((post) => {
    if (activeTab === 'post') return true;
    if (activeTab === 'media') return post.hasImage;
    if (activeTab === 'bookmark') return post.isBookmarked;
  });

  if (!userProfile) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        {/* 배경 이미지 */}
        <View
          style={[
            styles.topImage,
            {
              width: windowWidth,
              height: Math.max(160, windowWidth * 0.45),
              backgroundColor: Colors.palette.Gray900,
            },
          ]}
        >
          {userProfile.backgroundImg && (
            <ImageBackground
              source={{ uri: userProfile.backgroundImg }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
              imageStyle={styles.imageInner}
            />
          )}
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
              onPress={() => router.push('/myPage/setting/appSetting')}
              style={styles.settingButton}
            >
              <SettingIcon2 width={24} height={24} />
            </TouchableOpacity>
          </View>
        </View>
        {/* 프로필 섹션 */}
        <View style={styles.profileRow}>
          {/* 프로필 이미지 */}
          <Image
            source={
              userProfile.photo
                ? { uri: userProfile.photo }
                : require('@/assets/images/profile.png')
            }
            style={styles.profileImage}
          />

          {/* 닉네임 + 유저아이디 */}
          <View style={styles.nicknameBox}>
            <Text style={styles.nickname}>
              {userProfile.nickname || 'Nickname'}
            </Text>
            <Text style={styles.userId}>@{userProfile.ownId || 'user_id'}</Text>
          </View>

          {/* 우측 액션 (공유, 프로필 편집) */}
          <View style={styles.profileActions}>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={() => setIsShareModalVisible(true)}
            >
              <ShareIcon width={24} height={24} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/myPage/editProfile')}
              style={styles.editButton}
            >
              <Text style={styles.editButtonText}>프로필 편집</Text>
            </TouchableOpacity>
          </View>

          {/* 공유 모달 */}
          <Modal visible={isShareModalVisible} transparent animationType="fade">
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                {/* 닫기 버튼 */}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setIsShareModalVisible(false)}
                >
                  <CloseIcon width={24} height={24} />
                </TouchableOpacity>

                {/* 중앙 QR 박스 */}
                <View style={styles.qrBox}>
                  <Text style={styles.qrText}>QR</Text>
                </View>

                {/* 텍스트 */}
                <Text style={styles.textMain}>
                  {userProfile.nickname || 'Nickname'}
                </Text>
                <Text style={styles.textSub}>
                  @{userProfile.ownId || 'user_id'}
                </Text>

                {/* 복사 버튼 */}
                <TouchableOpacity style={styles.copyButton}>
                  <ClipIcon width={18} height={18} />
                  <Text style={styles.copyButtonText}>프로필 링크 복사</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
        <TouchableOpacity
          style={styles.followerRow}
          activeOpacity={0.8}
          onPress={() => router.push('/(tabs)/myPage/followPage')}
        >
          <View style={styles.followerImages}>
            <Image
              source={require('@/assets/images/profile.png')}
              style={[styles.followerImage, { marginRight: -6 }]}
            />
            <Image
              source={require('@/assets/images/profile.png')}
              style={[styles.followerImage, { marginRight: -6 }]}
            />
            <Image
              source={require('@/assets/images/profile.png')}
              style={styles.followerImage}
            />
          </View>
          <Text style={styles.followerText}>팔로워 803명</Text>
        </TouchableOpacity>
        {/* 해시태그 */}
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

        {/* 한줄소개 */}
        <Text style={styles.introText}>{userProfile.bio ?? ''}</Text>
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
          <Pressable onPress={() => router.push('/postWrite')}>
            <View style={styles.textFieldHeader}>
              <Image
                source={
                  userProfile.photo
                    ? { uri: userProfile.photo }
                    : require('@/assets/images/profile.png')
                }
                style={styles.textFieldProfile}
              />
              <View style={styles.textFieldTextWrapper}>
                <Text style={styles.textFieldName}>
                  {userProfile.nickname || 'Nickname'}
                </Text>

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
          </Pressable>
        </View>

        <View style={styles.scrollContainer}>
          {posts.map((post, i) => (
            <View key={post.id ?? i} style={styles.postContainer}>
              {/* 1. 유저 정보 + 더보기 */}
              <View style={styles.userRow}>
                <Image source={ProfileImage} style={styles.userImage} />
                <Text style={styles.username}>{post.username}</Text>
                <Text style={styles.postTime}>{post.time}</Text>
                <Text style={styles.showtext}>{post.visibility}</Text>
                <TouchableOpacity style={styles.moreButton}>
                  <MoreIcon width={18} height={18} />
                </TouchableOpacity>
              </View>

              {/* 2. 이미지 */}
              {post.hasImage && (
                <Image
                  source={DummyImage}
                  style={styles.postImage}
                  resizeMode="cover"
                />
              )}

              {/* 3. 텍스트 */}
              <Text style={styles.postText}>
                <Text style={styles.highlight}>{post.text.split(' ')[0]}</Text>{' '}
                {post.text.split(' ').slice(1).join(' ')}
              </Text>

              {/* 4. 좋아요 / 북마크 */}
              <View style={styles.actionRow}>
                <LikeIcon width={18} height={18} />
                <Text
                  style={[
                    styles.actionText,
                    { marginLeft: 2, marginRight: 12 },
                  ]}
                >
                  {post.likeCount}
                </Text>

                <TouchableOpacity onPress={() => handleToggleBookmark(post.id)}>
                  {post.isBookmarked ? (
                    <BookmarkFillIcon width={18} height={18} />
                  ) : (
                    <BookmarkIcon width={18} height={18} />
                  )}
                </TouchableOpacity>

                <Text style={[styles.actionText, { marginLeft: 2 }]}>
                  {post.bookmarkCount}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
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
    zIndex: 2,
    position: 'relative',
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
    flex: 1,
  },
  userId: {
    ...Typography.body2,
    color: '#7C7C7C',
    marginTop: 2,
  },
  profileActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  shareButton: {
    marginTop: 16,
  },
  editButton: {
    marginLeft: 20,
    marginTop: 16,
    marginRight: 20,
    minHeight: 35,
    paddingHorizontal: 14,
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
  }, // 모달 관련 스타일
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 335,
    height: 431,
    backgroundColor: '#333',
    borderRadius: 10,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  qrBox: {
    marginTop: 66,
    width: 181,
    height: 181,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrText: {
    ...Typography.h1,
    color: '#000',
  },
  textMain: {
    marginTop: 21,
    ...Typography.subtitle1B,
    color: '#FFF',
  },
  textSub: {
    marginTop: 4,
    ...Typography.body2,
    color: '#7C7C7C',
  },
  copyButton: {
    marginTop: 37,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 10,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.30)',
  },
  copyButtonText: {
    color: '#fff',
    ...Typography.caption1,
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
    marginLeft: 5.5,
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
    marginTop: 35,
    alignSelf: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: '#1F1F1F',
    paddingHorizontal: 16,
    gap: 10,
    alignSelf: 'center',
    borderRadius: 70,
    padding: 5,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: 'transparent',
    alignItems: 'center',
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
    borderRadius: 8,
    backgroundColor: '#1F1F1F',
    flexDirection: 'column',
    alignItems: 'flex-start',
    alignSelf: 'stretch', // 부모 폭을 가득 채워 좌우 여백만 유지
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
    flexWrap: 'wrap',
  },
  textFieldGuide: {
    color: '#B3B3B3',
    fontFamily: 'Pretendard',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 14,
    letterSpacing: -0.42,
    flexShrink: 1,
  }, //오늘의 밴놀을 공유해 주세요
  scrollContainer: {
    paddingVertical: 20,
  }, // ✅ 포스트 작성 칸
  postContainer: {
    paddingVertical: 20,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#555',
    paddingHorizontal: 20,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userImage: {
    width: 36,
    height: 36,
    borderRadius: 342,
    borderWidth: 0.3,
    borderColor: '#7C7C7C',
  },
  username: {
    ...Typography.subtitle3,
    color: '#fff',
  },
  postTime: {
    ...Typography.caption1,
    color: '#999',
  },
  showtext: {
    ...Typography.caption1,
    color: '#999',
  },
  moreButton: {
    marginLeft: 'auto',
  },
  postImage: {
    width: '100%',
    height: 188.438,
    marginTop: 10,
  },
  postText: {
    color: '#FFF',
    ...Typography.body2,
    marginTop: 20,
  },
  highlight: {
    ...Typography.body2,
    color: '#1976D2',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 2,
    marginTop: 10,
  },
  actionText: {
    color: '#fff',
    ...Typography.caption2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
  },
});
