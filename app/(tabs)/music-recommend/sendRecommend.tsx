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

import Checkbox from '@/assets/images/checkbox.svg';
import CheckboxChecked from '@/assets/images/checkbox_checked.svg';
import DateHeader from '@/components/common/DateHeader';
import { Typography } from '@/constants/tyopography';

export default function SendRecommendPage() {
  const router = useRouter();
  const { title, artist } = useLocalSearchParams();
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSendModalVisible, setIsSendModalVisible] = useState(false);

  const handleSend = () => {
    setIsSendModalVisible(true);

    setTimeout(() => {
      setIsSendModalVisible(false);
      router.push({
        pathname: '/(tabs)/music-recommend/myRecommend',
        params: {
          title,
          artist,
        },
      });
    }, 5000);
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
            source={require('@/assets/images/album-cover.jpg')}
            style={styles.cover}
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
                  <CheckboxChecked width={24} height={24} />
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
            <Pressable onPress={() => setIsModalVisible(true)}>
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

        {/* 모달 */}
        {isModalVisible && (
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.emoji}>😝</Text>
              <Text style={styles.commentText}>
                AI가 코멘트를 작성하고 있어요 ...
              </Text>
            </View>
          </View>
        )}
        {/* 전송 버튼 눌렀을 때 모달 */}
        {isSendModalVisible && (
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.emoji}>😎</Text>
              <Text style={styles.commentText}>오늘의 곡 추천 완료</Text>
            </View>
          </View>
        )}
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
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#333',
    width: 324,
    height: 185,
  },
  emoji: {
    width: 292,
    height: 76,
    textAlign: 'center',
    color: '#333',
    fontFamily: 'Pretendard',
    fontSize: 76,
    lineHeight: 76,
    fontStyle: 'normal',
    fontWeight: '400',
    letterSpacing: -2.28,
    marginBottom: 10,
  },
  commentText: {
    width: 292,
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Pretendard',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '400',
    letterSpacing: -0.48,
  },
});
