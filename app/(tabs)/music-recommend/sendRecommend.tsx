import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { fetchAIComment } from '@/api/aiRecommend';
import { postReplyAsRecoms } from '@/api/postReplyAsRecoms';
import Checkboxchecked from '@/assets/icons/checkbox-checked.svg';
import Checkbox from '@/assets/icons/checkbox.svg';
import DateHeader from '@/components/common/DateHeader';
import ModalPopup from '@/components/common/ModalPopup';
import { Typography } from '@/constants/typography';

export default function SendRecommendPage() {
  const router = useRouter();
  const { title, artist, image, recomsId } = useLocalSearchParams();
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSendModalVisible, setIsSendModalVisible] = useState(false);

  console.log('🎵 추천 정보:', { title, artist, image, recomsId });

  const handleGenerateComment = async () => {
    setIsModalVisible(true);

    if (!title || !artist) return;

    try {
      const res = await fetchAIComment(title as string, artist as string);

      if (res?.success && res.data) {
        setComment(res.data);
      } else {
        console.warn('AI 코멘트 생성 실패');
      }
    } catch (e) {
      console.error('AI COMMENT 오류:', e);
    } finally {
      setIsModalVisible(false);
    }
  }; // ai 코멘트 api

  const handleSend = async () => {
    if (isSendModalVisible) {
      console.warn('⚠️ 이미 전송 중입니다.');
      return;
    }

    if (!comment.trim() || !recomsId) return;

    setIsSendModalVisible(true);

    try {
      const res = await postReplyAsRecoms(
        recomsId,
        comment,
        isAnonymous,
        title as string,
        artist as string,
      );

      if (res.success) {
        setTimeout(() => {
          setIsSendModalVisible(false);
          router.push({
            pathname: '/(tabs)/music-recommend/myRecommend',
            params: {
              title,
              artist,
              image,
              recomsId,
              comment,
            },
          });
        }, 2000);
      } else if (res.error?.response?.status === 409) {
        alert('이미 이 추천에 답장한 적이 있어요!');
        setIsSendModalVisible(false);
      } else {
        alert('답장 전송에 실패했어요. 다시 시도해주세요.');
        setIsSendModalVisible(false);
      }
    } catch (err) {
      console.error('❌ 댓글 전송 중 에러:', err);
      setIsSendModalVisible(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backArrow}>
            <Image
              source={require('@/assets/images/backarrow.png')}
              style={{ width: 24, height: 24 }}
            />
          </Pressable>
          <Text style={styles.headerTitle}>추천곡 보내기</Text>
        </View>

        {/* 날짜 */}
        <Text style={styles.date}>
          <DateHeader />
        </Text>

        {/* 추천 곡 카드 */}
        <View style={styles.card}>
          <Image
            source={
              image
                ? { uri: image as string }
                : require('@/assets/images/album-cover.jpg')
            }
            style={styles.cover}
            resizeMode="cover"
          />
          <View style={styles.songInfo}>
            <Text style={styles.songTitle}>{title}</Text>
            <Text style={styles.artist}>{artist}</Text>
          </View>
        </View>

        {/* 코멘트 입력 */}
        <View style={styles.commentBox}>
          <Text style={styles.commentLabel}>MY COMMENT</Text>
          <TextInput
            placeholder="COMMENT를 작성하세요..."
            placeholderTextColor="#7C7C7C"
            value={comment}
            onChangeText={setComment}
            multiline
            style={styles.commentInput}
          />
          <View style={styles.commentOptions}>
            <TouchableOpacity
              onPress={() => setIsAnonymous(!isAnonymous)}
              style={styles.checkboxRow}
              activeOpacity={0.8}
            >
              <View style={styles.checkbox}>
                {isAnonymous ? (
                  <Checkboxchecked width={24} height={24} />
                ) : (
                  <Checkbox width={24} height={24} />
                )}
              </View>
              <Text
                style={[
                  styles.checkboxLabel,
                  { color: isAnonymous ? '#FFFFFF' : '#7C7C7C' },
                ]}
              >
                익명으로 보내기
              </Text>
            </TouchableOpacity>
            <Pressable onPress={handleGenerateComment}>
              <View style={styles.aiCommentRow}>
                <Text style={styles.aiComment}>
                  <Image
                    source={require('@/assets/images/ai-comment.png')}
                    style={{ width: 21, height: 21 }}
                  />
                </Text>
                <Text style={styles.aiCommentLabel}>AI COMMENT</Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* 전송 버튼 */}
        <TouchableOpacity
          style={[
            styles.sendButton,
            comment.trim() ? { backgroundColor: '#FB4932' } : {},
          ]}
          onPress={handleSend}
        >
          <Text style={styles.sendText}>전송</Text>
        </TouchableOpacity>

        {/* 공용 모달 컴포넌트 사용 */}
        <ModalPopup
          visible={isModalVisible}
          emoji="😝"
          text="AI가 코멘트를 작성하고 있어요 ..."
          duration={2}
          onClose={() => setIsModalVisible(false)}
        />

        <ModalPopup
          visible={isSendModalVisible}
          emoji="😎"
          text="오늘의 곡 추천 완료"
          duration={3}
          onClose={() => setIsSendModalVisible(false)}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  backArrow: {
    position: 'absolute',
    left: 0,
    padding: 8,
  },
  headerTitle: {
    ...Typography.subtitle1B,
    textAlign: 'center',
    fontWeight: 'semibold',
    color: '#fff',
  },
  date: {
    ...Typography.body1,
    textAlign: 'center',
    color: '#B3B3B3',
    marginBottom: 30,
  },
  card: {
    width: '100%',
    height: 118,
    flexDirection: 'row',
    backgroundColor: '#1F1F1F',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginBottom: 19,
  },
  cover: {
    width: 78,
    height: 78,
    borderRadius: 5,
    marginRight: 27,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    ...Typography.subtitle1B,
    color: '#fff',
    marginBottom: 6,
  },
  artist: {
    ...Typography.body1,
    color: '#fff',
    fontSize: 14,
  },
  commentBox: {
    width: '100%',
    height: 333,
    backgroundColor: '#1F1F1F',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  commentLabel: {
    ...Typography.body1,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  commentInput: {
    ...Typography.body2,
    minHeight: 210,
    color: '#fff',
    padding: 8,
    backgroundColor: '#1F1F1F',
    marginBottom: 20,
  },
  commentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 4,
  },
  checkboxLabel: {
    ...Typography.body2,
    color: '#7C7C7C',
  },
  aiCommentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiComment: {
    marginRight: 4,
  },
  aiCommentLabel: {
    ...Typography.body2,
    color: '#7C7C7C',
    marginRight: 4,
  },
  sendButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#1F1F1F',
    paddingVertical: 17,
    borderRadius: 10,
    alignItems: 'center',
  },
  sendText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
