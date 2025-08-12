import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { fetchReplyComment } from '@/api/replies';
import AlertIcon from '@/assets/icons/alert.svg';
import CommentIcon from '@/assets/icons/comment.svg';
import PlayIcon from '@/assets/icons/play-solid.svg';
import CommentModal from '@/components/common/CommentModal';
import DateHeader from '@/components/common/DateHeader';
import { Typography } from '@/constants/typography';

const defaultAlbumImage = require('@/assets/images/album-cover.jpg');

// string | string[] | undefined -> string | undefined 로 단일화
const asString = (v?: string | string[]) =>
  Array.isArray(v) ? v[0] : (v ?? undefined);

export default function MyRecommend() {
  const { title, artist, image, recomsId, comment } = useLocalSearchParams<{
    title?: string | string[];
    artist?: string | string[];
    image?: string | string[];
    recomsId?: string | string[];
    comment?: string | string[];
  }>();

  const titleStr = asString(title);
  const artistStr = asString(artist);
  const imageStr = asString(image);
  const recomsIdStr = asString(recomsId);
  const commentStr = asString(comment);

  const router = useRouter();
  const swiperRef = useRef<any>(null);
  const [isMyCommentVisible, setIsMyCommentVisible] = useState(false);
  const [isReplyCommentVisible, setIsReplyCommentVisible] = useState(false);
  const [replyComment, setReplyComment] = useState<string | null>(null);
  const [replySender, setReplySender] = useState<string | null>(null);

  const albumSource =
    imageStr && imageStr.length > 0 ? { uri: imageStr } : defaultAlbumImage;

  useEffect(() => {
    const getReply = async () => {
      if (!recomsIdStr) return; // 없으면 호출 안 함
      const replyData = await fetchReplyComment(recomsIdStr, 'received'); // ✅ string 보장
      if (replyData) {
        setReplyComment(replyData.content);
        setReplySender(replyData.senderName);
      } else {
        setReplyComment(null);
        setReplySender(null);
      }
    };
    getReply();
  }, [recomsIdStr]);

  return (
    <>
      {/* 나의 추천곡 (단일 화면) */}
      <View style={styles.container}>
        <ImageBackground
          source={albumSource}
          style={styles.backgroundImage}
          imageStyle={{ opacity: 0.8 }}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.9)', 'rgba(0,0,0,0.2)']}
            style={{ flex: 1 }}
          >
            <View style={styles.overlay}>
              {/* 헤더 */}
              <View style={styles.header}>
                <Text style={styles.headerTitle}>나의 추천곡</Text>
                <Pressable
                  onPress={() =>
                    router.push('/(tabs)/music-recommend/alarmCenter')
                  }
                  style={styles.bellWrapper}
                >
                  <AlertIcon width={24} height={24} />
                </Pressable>
              </View>

              {/* 날짜 + 곡 정보 */}
              <Text style={styles.dateText}>
                <DateHeader />
              </Text>
              <Text style={styles.songTitle}>{titleStr ?? ''}</Text>
              <Text style={styles.artist}>{artistStr ?? ''}</Text>

              {/* 앨범 커버 + 재생버튼 */}
              <View style={styles.albumWrapper}>
                <Image source={albumSource} style={styles.albumImage} />
                <PlayIcon width={58.1} height={58.1} />
              </View>

              {/* 코멘트 버튼 */}
              <Pressable
                style={styles.commentButton}
                onPress={() => setIsMyCommentVisible(true)}
              >
                <CommentIcon width={16} height={14} />
                <Text style={styles.commentText}>코멘트 확인하기</Text>
              </Pressable>

              {/* 답장 상태 버튼 */}
              <Pressable
                style={[
                  styles.replyStatusButton,
                  replyComment && { backgroundColor: '#F4F4F4' },
                ]}
                onPress={() => {
                  if (replyComment) setIsReplyCommentVisible(true);
                }}
              >
                <Text
                  style={[
                    styles.replyText,
                    replyComment && { color: '#000000' },
                  ]}
                >
                  {replyComment
                    ? `${replySender ?? ''} 님의 답장 확인하기`
                    : '아직 답장이 도착하지 않았어요'}
                </Text>
              </Pressable>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>

      {/* 모달 */}
      <CommentModal
        visible={isMyCommentVisible}
        onClose={() => setIsMyCommentVisible(false)}
        title="MY COMMENT"
        description={commentStr ?? ''}
        closeColor="#1F1F1F"
        closeText="닫기"
      />
      <CommentModal
        visible={isReplyCommentVisible}
        onClose={() => setIsReplyCommentVisible(false)}
        title={replySender ? `From. ${replySender}` : 'From.'}
        description={replyComment ?? ''}
        closeColor="#1F1F1F"
        closeText="닫기"
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  backgroundImage: { ...StyleSheet.absoluteFillObject, flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    zIndex: 10,
  },
  headerTitle: {
    ...Typography.subtitle1B,
    position: 'absolute',
    textAlign: 'center',
    paddingTop: 50,
    left: 0,
    right: 0,
    color: '#fff',
  },
  bellWrapper: { position: 'absolute', right: 24, top: 72 },
  dateText: {
    ...Typography.subtitle2,
    color: '#EAEAEA',
    marginTop: 70,
    marginBottom: 50,
  },
  songTitle: { ...Typography.h1, color: '#fff', marginBottom: 6 },
  artist: { ...Typography.body1, color: '#fff', marginBottom: 30 },
  albumWrapper: {
    width: 224,
    height: 224,
    borderRadius: 200,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  albumImage: {
    width: 224,
    height: 224,
    borderRadius: 100,
    position: 'absolute',
  },
  commentButton: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  commentText: {
    ...Typography.subtitle3,
    marginLeft: 4,
    color: '#fff',
    marginBottom: 20,
  },
  replyStatusButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#555',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  replyText: { ...Typography.subtitle3, textAlign: 'center', color: '#B3B3B3' },
});
