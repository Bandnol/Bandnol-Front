import type { IconType } from '@/components/NotificationIcon';
import NotificationIcon from '@/components/NotificationIcon';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import relativeTime from 'dayjs/plugin/relativeTime';
import { StyleSheet, Text, View } from 'react-native';

dayjs.extend(relativeTime);
dayjs.locale('ko');

type NotificationItemProps = {
  id: string;
  createdAt: string;
  type: IconType;
  isConfirmed: boolean;
  link: string;
  sender: {
    id: string;
    nickname: string;
  } | null;
  content: string | null;
};

export default function NotificationItem(props: NotificationItemProps) {
  const { id, createdAt, type, isConfirmed, link, sender, content } = props;

  let message = null;

  if (type === 'RECOMS_RECEIVED') {
    message = (
      <Text style={styles.cardDescription}>
        띵동~ 오늘의 추천곡이 도착했어요!{'\n'}지금 바로 확인해보세요.
      </Text>
    );
  } else if (type === 'RECOMS_SENT' && sender) {
    message = (
      <Text style={styles.cardDescription}>
        내가 추천한 곡이{' '}
        <Text style={{ fontWeight: 'bold' }}>{sender.nickname}</Text> 님에게
        전달됐어요.
      </Text>
    );
  } else if (type === 'NOT_RECOMS' && sender) {
    message = (
      <Text style={styles.cardDescription}>
        오늘의 추천곡을 확인해주세요.{'\n'}
        <Text style={{ fontWeight: 'bold' }}>{sender.nickname}</Text> 님이
        애타게 기다리고 있어요 ㅜ.ㅜ
      </Text>
    );
  } else if (type === 'COMMENT_ARRIVED' && sender) {
    message = (
      <Text style={styles.cardDescription}>
        띵동~ 오늘의 추천곡에 대한{'\n'}
        <Text style={{ fontWeight: 'bold' }}>{sender.nickname}</Text> 님의
        코멘트가 도착했어요!
      </Text>
    );
  } else if (type === 'ANNOUNCEMENT') {
    message = (
      <Text style={[styles.cardDescription, { width: '71%' }]}>
        <Text style={{ fontWeight: 'bold', color: '#fff' }}>{content}</Text>
      </Text>
    );
  } else if (
    type === 'SUPERFAN'
    //&& artist
  ) {
    message = (
      <Text style={styles.cardDescription}>
        대단해요! {'\n'}
        {/* <Text style={{ fontWeight: 'bold' }}>{artist}</Text> */}고구마 의
        SUPERFAN이 되었습니다.
      </Text>
    );
  } else if (
    type === 'REPORT'
    //&& reportMonth
  ) {
    message = (
      <Text style={styles.cardDescription}>
        지금 바로{'\n'}
        나의 <Text style={{ fontWeight: 'bold' }}>{/* {reportMonth} */}</Text>
        밴놀 리포트를 확인해보세요!
      </Text>
    );
  } else if (type === 'BOOKMARK' && sender) {
    message = (
      <Text style={styles.cardDescription}>
        <Text style={{ fontWeight: 'bold' }}>{sender.nickname}</Text> 님이 내
        포스트를 북마크했습니다.
      </Text>
    );
  } else if (type === 'LIKE' && sender) {
    message = (
      <Text style={styles.cardDescription}>
        <Text style={{ fontWeight: 'bold' }}>{sender.nickname}</Text> 님이 내
        포스트를 좋아합니다.
      </Text>
    );
  } else {
    // 타입 오류
    message = (
      <Text style={styles.cardDescription}>유효하지 않은 알림입니다.</Text>
    );
  }
  const time = (() => {
    if (!createdAt) return '';
    const now = dayjs();
    const created = dayjs(createdAt);
    const diffMin = now.diff(created, 'minute');
    const diffHour = now.diff(created, 'hour');
    const diffDay = now.diff(created, 'day');

    if (diffMin < 1) return '방금 전';
    if (diffHour < 1) return `${diffMin}분 전`;
    if (diffDay < 1) return `${diffHour}시간 전`;
    if (diffDay < 7) return `${diffDay}일 전`;
    return created.format('M월 D일');
  })();
  return (
    <View style={styles.card}>
      <NotificationIcon type={type} />
      <View style={styles.cardTextBox}>{message}</View>
      <Text style={styles.cardTime}>{time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F1F1F',
    borderRadius: 10,
    padding: 15,
    gap: 21,
    alignSelf: 'stretch',
  },
  cardTextBox: {
    flex: 1,
  },
  cardDescription: {
    color: '#FFF',
    fontFamily: 'Pretendard',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16.8,
    letterSpacing: -0.3,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  cardTime: {
    color: '#7C7C7C',
    fontFamily: 'Pretendard',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16.8,
    letterSpacing: -0.3,
  },
});
