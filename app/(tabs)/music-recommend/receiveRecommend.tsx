import { API_URL } from '@/constants/env';
import api from '@/hooks/useAxios';
import LikeIcon from '@/assets/icons/like.svg';
import UnlikeIcon from '@/assets/icons/unlike.svg';
import CommentModal from '@/components/common/CommentModal';
import DateHeader from '@/components/common/DateHeader';
import { Typography } from '@/constants/typography';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AlertIcon from '@/assets/icons/alert.svg';
import PlayIcon from '@/assets/icons/play-solid.svg';

/* 추천 ID만 추출 
   스웨거 응답상 top-level id가 recomsId 이므로 최우선으로 사용.
   곡 id(recomsSong.id)와 값이 같으면 제외 */
function extractRecomsId(d: any): string | null {
  if (!d) return null;
  const candidates = [d?.id, d?.recomsId, d?.recoms?.id].filter(
    (v) => v !== undefined && v !== null,
  );
  if (!candidates.length) return null;
  const songId = d?.recomsSong?.id ?? d?.song?.id;
  const pick = candidates.find((v) => v !== songId) ?? candidates[0];
  return pick != null ? String(pick) : null;
}

// API
async function getReceivedRecommend() {
  const res = await api.get('/api/v1/recoms/received');
  return res.data;
}
async function getRecommendComment(recomsId: string) {
  const res = await api.get(`/api/v1/recoms/${recomsId}/comments`, {
    params: { type: 'received' },
  });
  return res.data;
}
async function postRecommendReply(recomsId: string, content: string) {
  const res = await api.post(`/api/v1/recoms/${recomsId}/replies`, { content });
  return res.data;
}

async function patchLike(recomsId: string, isLiked: boolean) {
  const res = await api.patch(`/api/v1/recoms/${recomsId}/likes`, { isLiked });
  return res.data;
}

// replies 정규화: 객체 {id, content} 또는 배열 모두 지원
async function tryFetchReplies(rid: string, params?: any) {
  const { data } = await api.get(`/api/v1/recoms/${rid}/replies`, { params });
  const raw = data?.data?.replies ?? data?.replies;
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'object') return [raw];
  return [];
}

// 답장 조회
async function getMyRepliesRobust(rid: string) {
  try {
    const rcv = await tryFetchReplies(rid, { type: 'received' });
    if (rcv.length) return rcv;
  } catch (e: any) {
    if (e?.response?.status !== 404) throw e;
  }
  try {
    const sent = await tryFetchReplies(rid, { type: 'sent' });
    if (sent.length) return sent;
  } catch (e: any) {
    if (e?.response?.status !== 404) throw e;
  }
  try {
    const any = await tryFetchReplies(rid);
    if (any.length) return any;
  } catch (e: any) {
    if (e?.response?.status !== 404) throw e;
  }
  return [];
}

interface ReceiveRecommendProps {
  onReplyComplete?: () => void;
}

export default function ReceiveRecommend({
  onReplyComplete,
}: ReceiveRecommendProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [recommend, setRecommend] = useState<any>(null);
  const [recomsId, setRecomsId] = useState<string | null>(null);

  const [commentLoading, setCommentLoading] = useState(false);

  // 답장 상태
  const [hasReplied, setHasReplied] = useState(false);
  const [myReply, setMyReply] = useState<string>('');
  const [myReplyLoading, setMyReplyLoading] = useState(false);
  const justRepliedRef = useRef(false); // 방금 보냄 보호 플래그

  // 좋아요 상태 (null: 모름, true: 좋아요, false: 별로)
  const [isLiked, setIsLiked] = useState<boolean | null>(null);
  const [likeUpdating, setLikeUpdating] = useState(false);

  // 모달(읽기/입력 겸용)
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isReplyMode, setIsReplyMode] = useState(false);
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [replyText, setReplyText] = useState('');

  const [modalProps, setModalProps] = useState({
    title: '',
    description: '',
    closeText: '',
    closeColor: '',
  });

  const senderNickname = recommend?.sender?.nickname ?? '';

  // 내 답장 상태 동기화
  const hydrateMyReply = async (rid: string) => {
    try {
      setMyReplyLoading(true);
      const list = await getMyRepliesRobust(rid);
      if (list.length) {
        const content = list[0]?.content ?? '';
        setHasReplied(!!content);
        if (content) setMyReply(content);
        justRepliedRef.current = false; // 서버와 동기화 완료
      } else {
        if (!justRepliedRef.current) {
          setHasReplied(false);
          setMyReply('');
        }
      }
    } catch (e) {
      if (!justRepliedRef.current) {
        setHasReplied(false);
        setMyReply('');
      }
      console.warn('답장 조회 실패:', e);
    } finally {
      setMyReplyLoading(false);
    }
  };

  // 최초 로드
  useEffect(() => {
    (async () => {
      try {
        const res = await getReceivedRecommend();
        console.log('[GET] received →', `${API_URL}/api/v1/recoms/received`);

        if (res?.data) {
          console.log('[received raw]:', JSON.stringify(res.data, null, 2));
          try {
            console.log('[received keys]:', Object.keys(res.data || {}));
          } catch {}
        }

        if (res?.success && res.data) {
          setRecommend(res.data);
          const rid = extractRecomsId(res.data);
          console.log('[receive] recomsId (picked) =', rid, {
            recomsId: res.data?.recomsId,
            recoms_dot_id: res.data?.recoms?.id,
            top_id: res.data?.id,
            song_id: res.data?.recomsSong?.id,
          });
          setRecomsId(rid);

          // 초기 좋아요 상태 추정: 서버에서 내려주는 필드가 있으면 반영
          const initialLike = (res.data?.isLiked ?? res.data?.liked ?? null) as
            | boolean
            | null;
          if (initialLike !== null) setIsLiked(initialLike);

          if (rid) await hydrateMyReply(rid);
          else {
            setHasReplied(false);
            setMyReply('');
          }
        } else {
          console.warn('수신 데이터가 비었거나 success=false입니다.');
          setHasReplied(false);
          setMyReply('');
        }
      } catch (e) {
        console.error('API 호출 실패(수신곡):', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 좋아요/별로예요 핸들러
  const sendLike = async (value: boolean) => {
    if (!recomsId || likeUpdating) return;
    try {
      setLikeUpdating(true);
      const prev = isLiked;
      setIsLiked(value);

      const res = await patchLike(recomsId, value);
      console.log('👍 좋아요 API 응답:', res);

      if (!res?.success) {
        setIsLiked(prev ?? null);
        Alert.alert('에러', res?.error ?? '처리 중 문제가 발생했어요.');
      }
    } catch (e: any) {
      console.error('❌ 좋아요 API 에러:', e?.response?.status, e?.message);
      setIsLiked((p) => p);
      Alert.alert(
        '에러',
        e?.response?.data?.message || '네트워크 오류가 발생했어요.',
      );
    } finally {
      setLikeUpdating(false);
    }
  };

  // 답장 전송
  const handleSendReply = async (text: string) => {
    if (!recomsId) {
      Alert.alert('알림', '추천 ID가 없어 답장을 보낼 수 없습니다.');
      return;
    }
    const content = (text ?? '').trim();
    if (!content) {
      Alert.alert('알림', '답장 내용을 입력해주세요.');
      return;
    }

    try {
      setReplySubmitting(true);
      const res = await postRecommendReply(recomsId, content);

      if (res?.success) {
        // 낙관적 전환 + 짧은 지연 후 동기화
        setHasReplied(true);
        setMyReply(content);
        justRepliedRef.current = true;
        setTimeout(() => {
          hydrateMyReply(recomsId).catch(() => {});
        }, 300);

        Alert.alert('완료', '답장이 전송되었어요.', [
          {
            text: 'OK',
            onPress: () => {
              setIsModalVisible(false);
              setIsReplyMode(false);
              setReplyText('');
              // 답장 완료 후 첫 번째 스와이프 페이지로 돌아가기
              if (onReplyComplete) {
                onReplyComplete();
              } else {
                // fallback: 독립 실행 시 myRecommend로 네비게이션
                router.replace('/(tabs)/music-recommend/myRecommend');
              }
            },
          },
        ]);
      } else {
        Alert.alert('에러', res?.error ?? '답장 전송에 실패했습니다.', [
          {
            text: 'OK',
            onPress: () => {
              setIsModalVisible(false);
              setIsReplyMode(false);
            },
          },
        ]);
      }
    } catch (e: any) {
      const status = e?.response?.status;
      const serverMsg =
        e?.response?.data?.error || e?.response?.data?.message || e?.message;

      if (status === 409) {
        // 이미 보낸 상태로 처리하고 즉시 전환
        setHasReplied(true);
        justRepliedRef.current = true;
        setTimeout(() => {
          hydrateMyReply(recomsId).catch(() => {});
        }, 300);

        Alert.alert(
          '이미 답장을 보냈어요',
          serverMsg ?? '이 추천에는 답장을 한 번만 보낼 수 있어요.',
          [
            {
              text: 'OK',
              onPress: () => {
                setIsModalVisible(false);
                setIsReplyMode(false);
                setReplyText('');
              },
            },
          ],
        );
        return;
      }

      console.error('답장 전송 실패:', status, serverMsg);
      Alert.alert('에러', '답장 전송 중 오류가 발생했습니다.', [
        {
          text: 'OK',
          onPress: () => {
            setIsModalVisible(false);
            setIsReplyMode(false);
          },
        },
      ]);
    } finally {
      setReplySubmitting(false);
    }
  };

  // 모달 열기(읽기/입력)
  const openModal = async (type: 'view' | 'reply') => {
    if (type === 'view') {
      setIsReplyMode(false);
      setModalProps({
        title: `From. ${senderNickname}`,
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
        if (res?.success) {
          const commentText =
            res?.data?.comment ??
            res?.data?.recomsSong?.comment ??
            '추천 이유가 없습니다.';
          setModalProps({
            title: `From. ${senderNickname}`,
            description: commentText,
            closeText: '닫기',
            closeColor: '#1F1F1F',
          });
        } else {
          setModalProps({
            title: `From. ${senderNickname}`,
            description: res?.error ?? '코멘트를 불러오지 못했습니다.',
            closeText: '닫기',
            closeColor: '#1F1F1F',
          });
        }
      } catch (e) {
        console.error('코멘트 조회 실패:', e);
        setModalProps({
          title: `From. ${senderNickname}`,
          description: '코멘트를 불러오는 중 오류가 발생했습니다.',
          closeText: '닫기',
          closeColor: '#1F1F1F',
        });
      } finally {
        setCommentLoading(false);
      }
    } else {
      setIsReplyMode(true);
      setReplyText('');
      setModalProps({
        title: `To. ${senderNickname}`,
        description: '',
        closeText: '답장 보내기',
        closeColor: '#FB4932',
      });
      setIsModalVisible(true);
    }
  };

  // 내가 보낸 답장 보기 (즉시 표시 -> 동기화)
  const openMyReplyModal = async () => {
    if (!recomsId) return;

    // 즉시 로컬 내용으로 오픈
    setIsReplyMode(false);
    setModalProps({
      title: `To. ${senderNickname}`,
      description: myReply || '보낸 답장이 없어요.',
      closeText: '닫기',
      closeColor: '#1F1F1F',
    });
    setIsModalVisible(true);

    // 백그라운드 동기화
    try {
      const list = await getMyRepliesRobust(recomsId);
      const content = list?.[0]?.content ?? '';
      if (content && content !== myReply) {
        setMyReply(content);
        setModalProps((p) => ({ ...p, description: content }));
      }
      justRepliedRef.current = false;
    } catch {}
  };

  // UI
  if (loading) {
    return (
      <View style={[styles.overlay, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  // 좋아요 색/투명도
  const likedActive = isLiked === true;
  const dislikedActive = isLiked === false;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: recommend?.recomsSong?.imgUrl }}
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
              <Text style={styles.headerTitle}>추천 받은 곡</Text>
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
            <Text style={styles.songTitle}>{recommend?.recomsSong?.title}</Text>
            <Text style={styles.artist}>
              {recommend?.recomsSong?.artistName}
            </Text>

            {/* 앨범 커버 + 재생 버튼 */}
            <View style={styles.albumWrapper}>
              <Image
                source={{ uri: recommend?.recomsSong?.imgUrl }}
                style={styles.albumImage}
              />
              <PlayIcon width={58.1} height={58.1} />
            </View>

            {/* 보낸 사람 */}
            <Text style={styles.fromText}>
              From. <Text style={styles.sender}>{senderNickname}</Text>
            </Text>

            {/* 좋아요 + 별로예요 */}
            <View style={styles.likeOptions}>
              <Pressable
                onPress={() => sendLike(true)}
                disabled={!recomsId || likeUpdating}
              >
                <View style={styles.likeRow}>
                  <LikeIcon
                    width={18}
                    height={18}
                    style={[
                      styles.like,
                      { opacity: isLiked === true ? 1 : 0.4 },
                    ]}
                  />
                  <Text
                    style={[
                      styles.likeLabel,
                      { opacity: isLiked === true ? 1 : 0.6 },
                    ]}
                  >
                    좋아요
                  </Text>
                </View>
              </Pressable>

              <Pressable
                onPress={() => sendLike(false)}
                disabled={!recomsId || likeUpdating}
              >
                <View style={styles.likeRow}>
                  <UnlikeIcon
                    width={18}
                    height={18}
                    style={[
                      styles.unlike,
                      { opacity: isLiked === false ? 1 : 0.4 },
                    ]}
                  />
                  <Text
                    style={[
                      styles.unlikeLabel,
                      { opacity: isLiked === false ? 1 : 0.6 },
                    ]}
                  >
                    별로예요
                  </Text>
                </View>
              </Pressable>
            </View>

            {/* 버튼 */}
            <View style={styles.buttonRow}>
              <Pressable
                style={styles.confirmComment}
                onPress={() => openModal('view')}
              >
                <Text style={styles.confirmCommentText}>
                  {commentLoading ? '불러오는 중…' : '코멘트 확인하기'}
                </Text>
              </Pressable>

              {hasReplied ? (
                <Pressable style={styles.myReplyBtn} onPress={openMyReplyModal}>
                  <Text style={styles.myReplyBtnText}>내가 보낸 답장 보기</Text>
                </Pressable>
              ) : (
                <Pressable
                  style={styles.sendReply}
                  onPress={() => openModal('reply')}
                >
                  <Text style={styles.sendReplyText}>답장 보내기</Text>
                </Pressable>
              )}
            </View>

            {/* CommentModal (Alert OK로만 닫힘) */}
            <CommentModal
              visible={isModalVisible}
              onClose={() => {
                setIsModalVisible(false);
                setIsReplyMode(false);
              }}
              title={modalProps.title}
              description={modalProps.description}
              closeText={
                isReplyMode
                  ? replySubmitting
                    ? '보내는 중…'
                    : modalProps.closeText
                  : '닫기'
              }
              closeColor={isReplyMode ? '#FB4932' : '#1F1F1F'}
              editable={isReplyMode}
              inputValue={replyText}
              onChangeText={setReplyText}
              onSubmit={handleSendReply}
              submitting={replySubmitting}
            />
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  backgroundImage: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 24,
    paddingTop: 80,
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
  headerText: {
    ...Typography.subtitle1B,
    color: '#fff',
  },
  dateText: {
    ...Typography.subtitle2,
    color: '#EAEAEA',
    marginTop: 70,
    marginBottom: 50,
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
  sender: { ...Typography.body1, color: '#fff' },
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
  likeOptions: { flexDirection: 'row', marginBottom: 30, alignItems: 'center' },
  likeRow: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  like: { marginRight: 4 },
  likeLabel: { ...Typography.body2, color: '#7C7C7C' },
  unlikeRow: { flexDirection: 'row', alignItems: 'center' },
  unlike: { marginRight: 4 },
  unlikeLabel: { ...Typography.body2, color: '#7C7C7C' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  confirmComment: {
    width: 160,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellWrapper: {
    position: 'absolute',
    right: 24,
    top: 72,
  },
  sendReply: {
    width: 160,
    height: 50,
    backgroundColor: '#FB4932',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmCommentText: { ...Typography.subtitle3, color: '#121212' },
  sendReplyText: { ...Typography.subtitle3, color: '#FFFFFF' },
  myReplyBtn: {
    width: 160,
    height: 50,
    backgroundColor: '#1F1F1F',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  myReplyBtnText: { ...Typography.subtitle3, color: '#B3B3B3' },
});
