import { useLocalSearchParams } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import LikeIcon from '@/assets/icons/like.svg';
import PlayIcon from '@/assets/icons/play-solid.svg';
import UnlikeIcon from '@/assets/icons/unlike.svg';
import DateHeader from '@/components/common/DateHeader';
import { Typography } from '@/constants/tyopography';

const albumImage = require('@/assets/images/album-cover.jpg');

export default function ReceiveRecommend() {
  const {
    title = '파도',
    artist = '고고학',
    sender = '익명의 사자',
  } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerText}>추천 받은 곡</Text>
      </View>

      {/* 날짜 */}
      <Text style={styles.dateText}>
        <DateHeader />
      </Text>

      {/* 곡 정보 */}
      <Text style={styles.songTitle}>{title}</Text>
      <Text style={styles.artist}>{artist}</Text>
      <View style={styles.albumWrapper}>
        <Image source={albumImage} style={styles.albumImage} />
        <PlayIcon width={58.1} height={58.1} />
      </View>
      <Text style={styles.fromText}>
        From. <Text style={styles.sender}>{sender}</Text>
      </Text>

      {/* 버튼 */}
      <View style={styles.likeOptions}>
        <View style={styles.likeRow}>
          <Text style={styles.like}>
            <LikeIcon width={18.56} height={18} />
          </Text>
          <Text style={styles.likeLabel}>좋아요</Text>
        </View>
        <Pressable>
          <View style={styles.unlikeRow}>
            <Text style={styles.unlike}>
              <UnlikeIcon width={18.56} height={18} />
            </Text>
            <Text style={styles.unlikeLabel}>별로예요</Text>
          </View>
        </Pressable>
      </View>
      <View style={styles.buttonRow}>
        <Pressable style={styles.confirmComment}>
          <Text style={styles.confirmCommentText}>코멘트 확인하기</Text>
        </Pressable>
        <Pressable style={styles.sendReply}>
          <Text style={styles.sendReplyText}>답장 보내기</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  header: {
    marginBottom: 4,
  },
  headerText: {
    alignItems: 'center',
    justifyContent: 'center',
    ...Typography.subtitle1B,
    textAlign: 'center',
    color: '#fff',
  },
  dateText: {
    ...Typography.subtitle2,
    color: '#EAEAEA',
    marginTop: 50,
    marginBottom: 30,
  },
  songTitle: {
    ...Typography.h1,
    color: '#fff',
    marginBottom: 6,
  },
  artist: {
    ...Typography.body1,
    color: '#FFFFFF',
    marginBottom: 30,
  },
  fromText: {
    ...Typography.body1,
    color: '#D9D9D9',
    marginBottom: 10,
  },
  sender: {
    ...Typography.body1,
    color: '#fff',
  },
  albumWrapper: {
    width: 224,
    height: 224,
    borderRadius: 200,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  albumImage: {
    width: 224,
    height: 224,
    borderRadius: 100,
    position: 'absolute',
  },
  playButton: {
    zIndex: 10,
  },
  likeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  likeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  like: {
    marginRight: 4,
  },
  likeLabel: {
    ...Typography.body2,
    color: '#7C7C7C',
    marginRight: 15,
  },
  unlikeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unlike: {
    marginRight: 4,
    marginLeft: 15,
  },
  unlikeLabel: {
    ...Typography.body2,
    color: '#7C7C7C',
    marginRight: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  confirmComment: {
    width: 160,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sendReply: {
    width: 160,
    height: 50,
    backgroundColor: '#FB4932',
    borderRadius: 10,
    paddingVertical: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confirmCommentText: {
    ...Typography.subtitle3,
    color: '#121212',
    paddingVertical: 4,
  },
  sendReplyText: {
    ...Typography.subtitle3,
    color: '#FFFFFF',
    paddingVertical: 4,
  },
});
