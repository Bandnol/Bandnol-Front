import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Swiper from 'react-native-swiper';

import AlertIcon from '@/assets/icons/alert.svg';
import BandnolIcon from '@/assets/icons/bandnol-logo.svg';
import CommentIcon from '@/assets/icons/comment.svg';
import ErrorIcon from '@/assets/icons/error.svg';
import PlayIcon from '@/assets/icons/play-solid.svg';
import CommentModal from '@/components/common/CommentModal';
import DateHeader from '@/components/common/DateHeader';
import { Typography } from '@/constants/tyopography';

const albumImage = require('@/assets/images/album-cover.jpg');

export default function MyRecommendSwiper() {
  const { title = '방학을 기다리던 날들', artist = '문없는집' } =
    useLocalSearchParams();
  const router = useRouter();
  const swiperRef = useRef<any>(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isMyCommentVisible, setIsMyCommentVisible] = useState(false);
  const [isReplyCommentVisible, setIsReplyCommentVisible] = useState(false);

  // 타이머 시작
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 100000000000); // 작업하기 위해 잠깐 바꿔 둠

    return () => clearInterval(timer);
  }, []);

  // 타이머 종료 시 페이지 이동
  useEffect(() => {
    if (timeLeft === 0) {
      router.replace({
        pathname: '/(tabs)/music-recommend/receiveRecommend',
        params: { title, artist },
      });
    }
  }, [timeLeft]);

  const formatTime = (sec: number) => {
    const min = String(Math.floor(sec / 60)).padStart(2, '0');
    const secRemain = String(sec % 60).padStart(2, '0');
    return `00:${min}:${secRemain}`;
  };

  return (
    <>
      <Swiper
        loop={false}
        showsPagination={true}
        dotStyle={{ backgroundColor: '#444' }}
        activeDotStyle={{ backgroundColor: '#fff' }}
        ref={swiperRef}
      >
        {/* 나의 추천곡 */}
        <View style={styles.container}>
          <Image source={albumImage} style={styles.backgroundImage} />
          <View style={styles.overlay}>
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

            <Text style={styles.dateText}>
              <DateHeader />
            </Text>
            <Text style={styles.songTitle}>{title}</Text>
            <Text style={styles.artist}>{artist}</Text>

            <View style={styles.albumWrapper}>
              <Image source={albumImage} style={styles.albumImage} />
              <PlayIcon width={58.1} height={58.1} />
            </View>

            <Pressable
              style={styles.commentButton}
              onPress={() => setIsMyCommentVisible(true)}
            >
              <CommentIcon width={16} height={14.37} />
              <Text style={styles.commentText}>코멘트 확인하기</Text>
            </Pressable>

            <Pressable
              style={styles.replyStatusButton}
              onPress={() => setIsReplyCommentVisible(true)}
            >
              <Text style={styles.replyText}>
                아직 답장이 도착하지 않았어요
              </Text>
            </Pressable>
          </View>
        </View>
        {/* 추천 도착 타이머 */}
        <View style={styles.container}>
          <View style={styles.timeOverlay}>
            <Text style={styles.recommendHeaderTitle}>추천 받은 곡</Text>
            <Text style={styles.recommendDateText}>
              <DateHeader />
            </Text>
            <View style={styles.circleBox}>
              <View style={styles.BandnolLogo}>
                <BandnolIcon width={48} height={48} />
              </View>
              <Text style={styles.countdownLabel}>오늘의 추천곡 도착까지</Text>
              <Text style={styles.countdown}>{formatTime(timeLeft)}</Text>
            </View>
            <View style={styles.settingRow}>
              <ErrorIcon width={16} height={16} />
              <Text style={styles.setting}>추천곡 수신시간 설정</Text>
            </View>
          </View>
        </View>
      </Swiper>
      <CommentModal
        visible={isMyCommentVisible}
        onClose={() => setIsMyCommentVisible(false)}
        title="MY COMMENT"
        description="여름에 참 잘 어울리는 노래입니다~ 같은 앨범 수록곡도 다 너무 좋아서 요즘 듣기 딱이에요! 추천합니다 ㅎㅎ"
      />

      <CommentModal
        visible={isReplyCommentVisible}
        onClose={() => setIsReplyCommentVisible(false)}
        title="From. 훈심이"
        description="와 노래 좋아요 좋은 노래 알아갑니다!! 감사합니다~~"
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeOverlay: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 140,
    backgroundColor: '#000',
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
  recommendHeaderTitle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 69,
    zIndex: 10,
    ...Typography.subtitle1B,
    textAlign: 'center',
    color: '#fff',
  },
  bellWrapper: {
    position: 'absolute',
    right: 24,
    top: 82,
  },
  bellIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  dateText: {
    ...Typography.subtitle2,
    color: '#EAEAEA',
    marginTop: 70,
    marginBottom: 20,
  },
  recommendDateText: {
    ...Typography.subtitle2,
    color: '#EAEAEA',
    marginTop: 0,
    marginBottom: 100,
  },
  songTitle: {
    ...Typography.h1,
    color: '#fff',
    marginBottom: 6,
  },
  artist: {
    ...Typography.body1,
    color: '#fff',
    marginBottom: 30,
  },
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
  playButton: { zIndex: 10 },
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
    backgroundColor: '#555555',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  replyText: {
    ...Typography.subtitle3,
    textAlign: 'center',
    color: '#B3B3B3',
  },
  circleBox: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 200,
    width: 224,
    height: 224,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  BandnolLogo: {
    marginBottom: 25,
  },
  countdownLabel: {
    ...Typography.subtitle1,
    color: '#fff',
    marginBottom: 6,
  },
  countdown: {
    ...Typography.h1,
    color: '#fff',
    marginTop: 4,
  },
  settingRow: {
    flexDirection: 'row',
  },
  setting: {
    ...Typography.body2,
    color: '#B3B3B3',
    textDecorationLine: 'underline',
    marginLeft: 5,
  },
});
