import { API_URL, EXPO_PUBLIC_API_TOKEN } from '@env';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import LikeIcon from '@/assets/icons/like.svg';
import UnlikeIcon from '@/assets/icons/unlike.svg';
import CommentModal from '@/components/common/CommentModal';
import DateHeader from '@/components/common/DateHeader';
import { Typography } from '@/constants/typography';

const playButton = require('@/assets/images/play.png');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${EXPO_PUBLIC_API_TOKEN}`,
  },
});

// 최근 수신 1건 조회
const getReceivedRecommend = async () => {
  const res = await api.get(`/api/v1/recoms/received`);
  return res.data;
};

// 코멘트 조회
const getRecommendComment = async (recomsId: string) => {
  const res = await api.get(`/api/v1/recoms/${recomsId}/comments`, {
    params: { type: 'received' },
  });
  return res.data;
};

export default function ReceiveRecommend() {
  const [loading, setLoading] = useState(true);
  const [recommend, setRecommend] = useState<any>(null);

  const [recomsId, setRecomsId] = useState<string | null>(null);
  const [commentLoading, setCommentLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalProps, setModalProps] = useState({
    title: '',
    description: '',
    closeText: '',
    closeColor: '',
  });

  // API 호출 로직
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getReceivedRecommend();
        console.log('요청 URL:', `${API_URL}/api/v1/recoms/received`);
        console.log('서버 응답 상태:', res.success ? '성공' : '실패');
        console.log('서버 응답 데이터:', JSON.stringify(res.data, null, 2));
        if (res.success) {
          setRecommend(res.data);

          const rid =
            res.data?.recomsId ?? res.data?.id ?? res.data?.recoms?.id ?? null;
          setRecomsId(rid);
        } else {
          console.warn('API 응답 에러:', res.error);
        }
      } catch (e) {
        console.error('API 호출 실패:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 모달
  const openModal = async (type: 'view' | 'reply') => {
    if (type === 'view') {
      setModalProps({
        title: `From. ${recommend?.sender?.nickname ?? ''}`,
        description: '코멘트를 불러오는 중...',
        closeText: '닫기',
        closeColor: '#1F1F1F',
      });
      setIsModalVisible(true);

      if (!recomsId) {
        setModalProps((prev) => ({
          ...prev,
          description: '코멘트를 불러올 추천 ID가 없습니다.',
        }));
        return;
      }

      try {
        setCommentLoading(true);
        const res = await getRecommendComment(recomsId);
        console.log('코멘트 응답:', JSON.stringify(res, null, 2));

        if (res?.success) {
          const commentText =
            res?.data?.comment ??
            res?.data?.recomsSong?.comment ??
            '추천 이유가 없습니다.';
          setModalProps({
            title: `From. ${recommend?.sender?.nickname ?? ''}`,
            description: commentText,
            closeText: '닫기',
            closeColor: '#1F1F1F',
          });
        } else {
          setModalProps({
            title: `From. ${recommend?.sender?.nickname ?? ''}`,
            description: res?.error ?? '코멘트를 불러오지 못했습니다.',
            closeText: '닫기',
            closeColor: '#1F1F1F',
          });
        }
      } catch (e) {
        console.error('코멘트 조회 실패:', e);
        setModalProps({
          title: `From. ${recommend?.sender?.nickname ?? ''}`,
          description: '코멘트를 불러오는 중 오류가 발생했습니다.',
          closeText: '닫기',
          closeColor: '##B3B3B3',
        });
      } finally {
        setCommentLoading(false);
      }
    } else {
      setModalProps({
        title: `To. ${recommend?.sender?.nickname ?? ''}`,
        description: '답장을 작성해주세요.',
        closeText: '답장 보내기',
        closeColor: '#FB4932',
      });
      setIsModalVisible(true);
    }
  };

  if (loading) {
    return (
      <View style={[styles.overlay, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={{ uri: recommend?.recomsSong?.imgUrl }}
      style={styles.backgroundImage}
      imageStyle={{ opacity: 0.8 }}
    >
      <LinearGradient
        colors={['rgba(0,0,0,1)', 'rgba(0,0,0,0)']}
        style={{ flex: 1 }}
      >
        <View style={styles.overlay}>
          {/* 헤더 */}
          <Text style={styles.headerText}>추천 받은 곡</Text>

          {/* 날짜 */}
          <Text style={styles.dateText}>
            <DateHeader />
          </Text>

          {/* 곡 정보 */}
          <Text style={styles.songTitle}>{recommend?.recomsSong?.title}</Text>
          <Text style={styles.artist}>{recommend?.recomsSong?.artistName}</Text>

          {/* 앨범 커버 + 재생 버튼 */}
          <View style={styles.albumWrapper}>
            <Image
              source={{ uri: recommend?.recomsSong?.imgUrl }}
              style={styles.albumImage}
            />
            <Image source={playButton} style={styles.playButton} />
          </View>

          {/* 보낸 사람 */}
          <Text style={styles.fromText}>
            From.{' '}
            <Text style={styles.sender}>{recommend?.sender?.nickname}</Text>
          </Text>

          {/* 좋아요 + 싫어요 */}
          <View style={styles.likeOptions}>
            <View style={styles.likeRow}>
              <LikeIcon width={18} height={18} style={styles.like} />
              <Text style={styles.likeLabel}>좋아요</Text>
            </View>
            <Pressable>
              <View style={styles.likeRow}>
                <UnlikeIcon width={18} height={18} style={styles.unlike} />
                <Text style={styles.unlikeLabel}>별로예요</Text>
              </View>
            </Pressable>
          </View>

          {/* 버튼 */}
          <View style={styles.buttonRow}>
            <Pressable
              style={styles.confirmComment}
              onPress={() => openModal('view')}
            >
              <Text style={styles.confirmCommentText}>코멘트 확인하기</Text>
            </Pressable>
            <Pressable
              style={styles.sendReply}
              onPress={() => openModal('reply')}
            >
              <Text style={styles.sendReplyText}>답장 보내기</Text>
            </Pressable>
          </View>

          {/* 모달 */}
          <CommentModal
            visible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            title={modalProps.title}
            description={modalProps.description}
            closeText={modalProps.closeText}
            closeColor={modalProps.closeColor}
          />
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 24,
    paddingTop: 80,
    alignItems: 'center',
  },
  headerText: {
    ...Typography.subtitle1B,
    color: '#fff',
    //marginBottom: 8,
  },
  dateText: {
    ...Typography.subtitle2,
    color: '#EAEAEA',
    marginTop: 50,
    marginBottom: 40,
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
    marginBottom: 20,
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
    width: 62,
    height: 62,
    zIndex: 10,
  },
  likeOptions: {
    flexDirection: 'row',
    marginBottom: 30,
    alignItems: 'center',
  },
  likeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  like: {
    marginRight: 4,
  },
  likeLabel: {
    ...Typography.body2,
    color: '#7C7C7C',
  },
  unlikeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unlike: {
    marginRight: 4,
  },
  unlikeLabel: {
    ...Typography.body2,
    color: '#7C7C7C',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendReply: {
    width: 160,
    height: 50,
    backgroundColor: '#FB4932',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmCommentText: {
    ...Typography.subtitle3,
    color: '#121212',
  },
  sendReplyText: {
    ...Typography.subtitle3,
    color: '#FFFFFF',
  },
});
