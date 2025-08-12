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
    Authorization: `Bearer ${EXPO_PUBLIC_API_TOKEN}`, // .env에 있는 토큰
  },
});

const getReceivedRecommend = async () => {
  const res = await api.get(`/api/v1/recoms/received`);
  return res.data; // { success, data, error }
};

export default function ReceiveRecommend() {
  const [loading, setLoading] = useState(true);
  const [recommend, setRecommend] = useState<any>(null);

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
        console.log('success?', res?.success, 'type:', typeof res?.data);
        console.log('요청 URL:', `${API_URL}/api/v1/recoms/received`);
        console.log('서버 응답 상태:', res.success ? '성공' : '실패');
        console.log('서버 응답 데이터:', JSON.stringify(res.data, null, 2));
        if (res.success) {
          setRecommend(res.data);
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
  const openModal = (type: 'view' | 'reply') => {
    setModalProps({
      title:
        type === 'view'
          ? `From. ${recommend?.sender?.nickname}`
          : `To. ${recommend?.sender?.nickname}`,
      description:
        type === 'view'
          ? recommend?.recomsSong?.comment || '추천 이유가 없습니다.'
          : '답장을 작성해주세요.',
      closeText: type === 'view' ? '닫기' : '답장 보내기',
      closeColor: type === 'view' ? '#1F1F1F' : '#FB4932',
    });
    setIsModalVisible(true);
    {
      /*
    if (type === 'view') {
      setModalProps({
        title: 'From. noshel',
        description:
          '요즘 제가 푹 빠진 밴드 고고학입니다... 파도는 라이브가 진짜 최고인 것 같아요. 후반부로 갈수록 휘몰아치는 악기들이 예술입니다 ㅜㅜ 고고학 다른 곡도 진짜 좋으니까 꼭 들어보세요... 완전 추천합니다!',
        closeText: '닫기',
        closeColor: '#1F1F1F',
      });
    } else {
      setModalProps({
        title: 'To. noshel',
        description:
          '와 미쳤다... 바로 제 플리에 저장합니다 ;; 노래 너무 좋아요 ㅜㅜㅜ',
        closeText: '답장 보내기',
        closeColor: '#FB4932',
      });
    }
    setIsModalVisible(true);
    */
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
