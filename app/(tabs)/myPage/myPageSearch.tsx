import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import BookmarkIcon from '@/assets/icons/bookmark.svg';
import BookmarkFillIcon from '@/assets/icons/bookmark-fill.svg';
import DeleteIcon from '@/assets/icons/delete.svg';
import LikeIcon from '@/assets/icons/heart.svg';
import MoreIcon from '@/assets/icons/more.svg';
import SearchIcon from '@/assets/icons/search.svg';
import { Typography } from '@/constants/tyopography';

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

export default function MyPageSearch() {
  const [searchText, setSearchText] = useState('');
  const [posts, setPosts] = useState(postData);
  const [activeTab, setActiveTab] = useState<'post' | 'media' | 'bookmark'>(
    'post',
  );
  const filteredPosts = postData.filter((post) => {
    if (activeTab === 'post') return true;
    if (activeTab === 'media') return post.hasImage;
    if (activeTab === 'bookmark') return post.isBookmarked;
  });
  const handleToggleBookmark = (id: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, isBookmarked: !post.isBookmarked } : post,
      ),
    );
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.searchBarWrapper}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          // barStyle="dark-content"
        />
        {/* Search 입력창 영역 */}
        <View style={styles.searchContainer}>
          {/* 돋보기 아이콘 */}
          <SearchIcon width={24} height={24} style={styles.leftIcon} />

          {/* user: sayoxx 회색 박스 */}
          <View style={styles.userTagBox}>
            <Text style={styles.userLabel}>user:</Text>
            <Text style={styles.username}>sayoxx</Text>
          </View>

          {/* 텍스트 입력칸 */}
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            style={styles.input}
            placeholder="검색어를 입력하세요"
            placeholderTextColor="#888"
          />
          <TouchableOpacity onPress={() => setSearchText('')}>
            <DeleteIcon width={24} height={24} />
          </TouchableOpacity>
        </View>

        {/* '취소' 텍스트 */}
        <TouchableOpacity onPress={() => router.push('/(tabs)/myPage/myPage')}>
          <Text style={styles.cancelText}>취소</Text>
        </TouchableOpacity>
      </View>
      <View contentContainerStyle={styles.scrollContainer}>
        {posts.map((post, i) => (
          <View key={post.id ?? i} style={styles.postContainer}>
            {/* 1. 유저 정보 + 더보기 */}
            <View style={styles.userRow}>
              <Image
                source={require('@/assets/images/profile.png')}
                style={styles.userImage}
              />
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
                source={require('@/assets/images/dummy1.png')}
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
                style={[styles.actionText, { marginLeft: 2, marginRight: 12 }]}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  searchBarWrapper: {
    display: 'flex',
    flexDirection: 'row',
    width: 375,
    height: 71,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  searchContainer: {
    display: 'flex',
    flexDirection: 'row',
    height: 40,
    width: 293,
    alignItems: 'center',
    gap: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFF',
    flexShrink: 0,
  },
  leftIcon: {
    marginLeft: 10,
  },
  userTagBox: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 6,
    alignItems: 'center',
    backgroundColor: '#3A3A3A',
    borderRadius: 6,
  },
  userLabel: {
    color: '#FFF',
    marginRight: 4,
  },
  username: {
    fontSize: 14,
    fontWeight: 400,
    letterSpacing: -0.42,
    color: '#FFF',
    fontFamily: 'Pretendard',
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Pretendard',
    color: '#FFF',
    padding: 0,
  },
  deleteIcon: {
    marginLeft: 'auto',
    marginRight: 10,
  },
  cancelText: {
    width: 28,
    height: 22,
    ...Typography.subtitle2,
    color: '#FFF',
    marginLeft: 'auto',
  },
  scrollContainer: {
    paddingVertical: 20,
  }, // ✅ 포스트 작성 칸
  postContainer: {
    paddingVertical: 20,
    marginTop: 15.5,
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
});
