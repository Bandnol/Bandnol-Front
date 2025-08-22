import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Swiper from 'react-native-swiper';

import AlertIcon from '@/assets/icons/alert.svg';
import BandnolIcon from '@/assets/icons/bandnol-logo.svg';
import CommentIcon from '@/assets/icons/comment.svg';
import ErrorIcon from '@/assets/icons/error.svg';
import PlayIcon from '@/assets/icons/play-solid.svg';
import CommentModal from '@/components/common/CommentModal';
import DateHeader from '@/components/common/DateHeader';
import TimePickerModal from '@/components/common/TimePickerModal';
import { Typography } from '@/constants/typography';
import { fetchReplyComment } from '@/api/replies';
import api from '@/hooks/useAxios';
import ReceiveRecommend from './receiveRecommend';
import { SentRecomsResponse, fetchSentRecoms } from '@/api/sentRecoms';

const defaultAlbumImage = require('@/assets/images/album-cover.jpg'); // 임시 이미지..

interface MyRecommendSwiperProps {
  title?: string;
  artist?: string;
  image?: string;
  recomsId?: string;
  comment?: string;
}

export default function MyRecommendSwiper(props?: MyRecommendSwiperProps) {
  const params = useLocalSearchParams();

  // props가 있으면 props 사용, 없으면 useLocalSearchParams 사용
  const title = props?.title || params.title;
  const artist = props?.artist || params.artist;
  const image = props?.image || params.image;
  const recomsId = props?.recomsId || params.recomsId;
  const comment = props?.comment || params.comment;
  const router = useRouter();
  const swiperRef = useRef<any>(null);
  const [timeLeft, setTimeLeft] = useState(0); // 초기값 0으로 변경
  //const [timeLeft, setTimeLeft] = useState(16); //16초로 변경
  const [isMyCommentVisible, setIsMyCommentVisible] = useState(false);
  const [isReplyCommentVisible, setIsReplyCommentVisible] = useState(false);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [replyComment, setReplyComment] = useState<string | null>(null);
  const [replySender, setReplySender] = useState<string | null>(null); // 보낸 사람 이름
  const [hasReplied, setHasReplied] = useState(false); // 답장을 보냈는지 상태
  const [isCheckingReceived, setIsCheckingReceived] = useState(true); // 받은 추천곡 확인 중인지
  // 나의 코멘트를 저장할 상태 추가
  const [myComment, setMyComment] = useState<string | null>(null);
  // 로딩 상태 관리
  const [isCommentLoading, setIsCommentLoading] = useState(false);

  const albumSource =
    typeof image === 'string' && image.length > 0
      ? { uri: image }
      : defaultAlbumImage;

  // recomsTime을 가져와서 타이머 로직을 결정
  useEffect(() => {
    const fetchRecomsData = async () => {
      try {
        const response = await fetchSentRecoms();
        const data = response.data;
        if (data && !Array.isArray(data)) {
          const recomsTime = data.sender.recomsTime;
          const now = new Date();
          const recomsHour = parseInt(recomsTime.substring(0, 2), 10);
          const recomsMinute = parseInt(recomsTime.substring(2, 4), 10);
          const recomsDate = new Date();
          recomsDate.setHours(recomsHour, recomsMinute, 0, 0);

          const timeDifferenceInSeconds =
            (recomsDate.getTime() - now.getTime()) / 1000;

          if (timeDifferenceInSeconds > 0) {
            // 추천 시간이 아직 오지 않은 경우
            setTimeLeft(Math.floor(timeDifferenceInSeconds));
            setHasReplied(false);
          } else {
            // 추천 시간이 이미 지난 경우
            setTimeLeft(16); // 16초 타이머 시작
            setHasReplied(false);
          }
        }
      } catch (error) {
        console.error('❌ recomsTime 데이터 확인 오류:', error);
        // 오류 발생 시 기본값 (예: 15초) 설정
        setTimeLeft(15);
      } finally {
        setIsCheckingReceived(false);
      }
    };

    fetchRecomsData();
  }, []);

  // 받은 추천곡이 있는지 확인
  useEffect(() => {
    const checkReceivedRecommend = async () => {
      try {
        const response = await api.get('/api/v1/recoms/received');
        console.log('📦 received recoms response:', response.data);

        if (
          response.data?.success &&
          response.data?.data &&
          !Array.isArray(response.data.data)
        ) {
          // 받은 추천곡이 있으면 바로 receiveRecommend 페이지 표시
          setHasReplied(true);
        }
      } catch (error) {
        console.error('❌ received recoms 확인 오류:', error);
      } finally {
        setIsCheckingReceived(false);
      }
    };

    checkReceivedRecommend();
  }, []);

  // 내가 보낸 코멘트 조회 로직 개선
  const fetchMyComment = useCallback(async () => {
    // recomsId 유효성 검사 강화
    const recomsIdString = Array.isArray(recomsId) ? recomsId[0] : recomsId;

    if (
      !recomsIdString ||
      typeof recomsIdString !== 'string' ||
      recomsIdString.length === 0
    ) {
      console.log('🔥 유효한 recomsId가 없습니다. 코멘트 조회를 건너뜁니다.');
      setMyComment(null);
      return;
    }

    setIsCommentLoading(true);
    try {
      // 내가 보낸 코멘트를 조회하기 위해 type=sent로 변경
      const response = await api.get(
        `/api/v1/recoms/${recomsIdString}/comments?type=sent`,
      );

      console.log('🔥 내가 보낸 코멘트 API 응답:', response.data);

      // 응답 구조에 맞게 데이터 추출
      if (response.data?.success && response.data?.data) {
        const commentData = response.data.data;
        if (commentData.comment && typeof commentData.comment === 'string') {
          setMyComment(commentData.comment);
          console.log('🔥 내가 보낸 코멘트 설정 완료:', commentData.comment);
        } else {
          setMyComment(null);
          console.log('🔥 코멘트 데이터가 없습니다.');
        }
      } else {
        setMyComment(null);
        console.log('🔥 API 응답에 문제가 있습니다.');
      }
    } catch (error) {
      console.error('🔥 내가 보낸 코멘트 조회 오류:', error);
      // 에러 상황에 따른 처리
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { status: number } };
        if (axiosError.response?.status === 404) {
          console.log('🔥 아직 보낸 코멘트가 없습니다.');
          setMyComment(null);
        } else {
          console.error('🔥 코멘트 조회 중 예상치 못한 오류 발생');
          setMyComment(null);
        }
      } else {
        console.error('🔥 코멘트 조회 중 알 수 없는 오류 발생');
        setMyComment(null);
      }
    } finally {
      setIsCommentLoading(false);
    }
  }, [recomsId]);

  // useFocusEffect를 사용하여 화면 포커스 시마다 코멘트 재조회
  useFocusEffect(
    useCallback(() => {
      // recomsId가 있을 때만 API 호출
      if (recomsId) {
        console.log('🔥 화면 포커스 - 코멘트 조회 시작');
        fetchMyComment();
      }
    }, [fetchMyComment, recomsId]),
  );

  // 추가: recomsId가 변경될 때마다 코멘트 다시 조회
  useEffect(() => {
    if (recomsId) {
      console.log('🔥 recomsId 변경됨 - 코멘트 재조회');
      fetchMyComment();
    }
  }, [recomsId, fetchMyComment]);

  // 받은 추천곡 유무와 관계없이 타이머 시작
  useEffect(() => {
    if (isCheckingReceived) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCheckingReceived]);

  // 타이머 종료 시 hasReplied 상태 변경
  useEffect(() => {
    if (!isCheckingReceived && timeLeft === 0) {
      setHasReplied(true);
    }
  }, [timeLeft, isCheckingReceived]);

  const formatTime = (sec: number) => {
    const hour = String(Math.floor(sec / 3600)).padStart(2, '0');
    const min = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
    const secRemain = String(sec % 60).padStart(2, '0');
    return `${hour}:${min}:${secRemain}`;
  };

  useEffect(() => {
    const getReply = async () => {
      try {
        const recomsIdString = Array.isArray(recomsId) ? recomsId[0] : recomsId;
        if (!recomsIdString) return;

        const reply = await fetchReplyComment(recomsIdString, 'received');
        console.log('📦 reply:', reply);

        if (reply) {
          setReplyComment(reply.content);
          setReplySender(reply.nickname);
        } else {
          setReplyComment(null);
          setReplySender(null);
        }
      } catch (error) {
        console.error('❌ replyComment API 오류:', error);
        setReplyComment(null);
        setReplySender(null);
      }
    };

    if (recomsId) {
      getReply();
    }
  }, [recomsId]);

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
          <ImageBackground
            source={albumSource}
            style={styles.backgroundImage}
            imageStyle={{ opacity: 0.9 }}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.2)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
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
                <Text style={styles.songTitle}>{title}</Text>
                <Text style={styles.artist}>{artist}</Text>

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
                    replyComment && { backgroundColor: '#F4F4F4' }, // 답장이 오면 배경 흰색
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
                      ? `${replySender} 님의 답장 확인하기`
                      : '아직 답장이 도착하지 않았어요'}
                  </Text>
                </Pressable>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* 두 번째 페이지: 답장 상태에 따라 동적 변경 */}
        {hasReplied ? (
          /* 답장을 보낸 후: 추천받은 곡 페이지 */
          <ReceiveRecommend
            onReplyComplete={() => swiperRef.current?.scrollTo(0)}
          />
        ) : (
          /* 답장을 보내기 전: 추천 도착 타이머 */
          <View style={styles.container}>
            <View style={styles.timeOverlay}>
              <View style={styles.header}>
                <Text style={styles.headerTitle}>추천 받은 곡</Text>
                <Pressable
                  onPress={() => {
                    router.push('/(tabs)/music-recommend/alarmCenter');
                  }}
                  style={styles.bellWrapper}
                >
                  <AlertIcon width={24} height={24} />
                </Pressable>
              </View>
              <Text style={styles.recommendDateText}>
                <DateHeader />
              </Text>

              {/* 원형 타이머 박스 */}
              <View style={styles.circleBox}>
                <View style={styles.BandnolLogo}>
                  <BandnolIcon width={48} height={48} />
                </View>
                <Text style={styles.countdownLabel}>
                  오늘의 추천곡 도착까지
                </Text>
                <Text style={styles.countdown}>{formatTime(timeLeft)}</Text>
              </View>

              {/* 하단 설정 버튼 */}
              <Pressable
                style={styles.settingRow}
                onPress={() => setIsTimePickerVisible(true)}
              >
                <ErrorIcon width={16} height={16} />
                <Text style={styles.setting}>추천곡 수신시간 설정</Text>
              </Pressable>
            </View>
          </View>
        )}
      </Swiper>

      <CommentModal
        visible={isMyCommentVisible}
        onClose={() => setIsMyCommentVisible(false)}
        title="MY COMMENT"
        description={myComment || ''} // myComment 상태 사용
        closeColor="#1F1F1F"
        closeText="닫기"
      />

      <CommentModal
        visible={isReplyCommentVisible}
        onClose={() => setIsReplyCommentVisible(false)}
        title={`From. ${replySender || ''}`} // senderName 적용
        description={replyComment || ''} // content 적용
        closeColor="#1F1F1F"
        closeText="닫기"
      />

      <TimePickerModal
        visible={isTimePickerVisible}
        onClose={() => setIsTimePickerVisible(false)}
        onSave={() => {
          console.log('[MyRecommend] 수신 시간 변경 완료');
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
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
    top: 72,
  },
  dateText: {
    ...Typography.subtitle2,
    color: '#EAEAEA',
    marginTop: 70,
    marginBottom: 50,
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
    borderWidth: 1.5,
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
    alignItems: 'center',
  },
  setting: {
    ...Typography.body2,
    color: '#B3B3B3',
    textDecorationLine: 'underline',
    marginLeft: 5,
  },
  activeDotStyle: {
    backgroundColor: '#fff',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
