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

import DateHeader from '@/components/common/DateHeader';
import { Typography } from '@/constants/tyopography';

export default function SendRecommendPage() {
  const router = useRouter();
  const { title, artist } = useLocalSearchParams();
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);

  const handleSend = () => {
    router.push({
      pathname: '/(tabs)/music-recommend/myRecommend',
      params: {
        title,
        artist,
      },
    });
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
            <View style={styles.checkboxRow}>
              <Text style={styles.checkbox}>
                <Image
                  source={require('@/assets/images/checkbox.png')}
                  style={{ width: 24, height: 24 }}
                />
              </Text>
              <Text style={styles.checkboxLabel}>익명으로 보내기</Text>
            </View>
            <Pressable>
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
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendText}>전송</Text>
        </TouchableOpacity>
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
