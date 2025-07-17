import type { IconType } from '@/components/NotificationIcon';
import NotificationIcon from '@/components/NotificationIcon';
import { Typography } from '@/constants/tyopography';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { StyleSheet, Text, View } from 'react-native';

type NotificationItemProps = {
  nickname?: string;
  artist?: string;
  date?: string;
  dayOfWeek?: string;
  timeStart?: string;
  timeEnd?: string;
  reportMonth?: string;
  time: string;
  type: IconType;
};

export default function NotificationItem(props: NotificationItemProps) {
  const {
    type,
    time,
    nickname,
    artist,
    reportMonth,
    date,
    dayOfWeek,
    timeStart,
    timeEnd,
  } = props;

  let message = null;

  if (type === 'songReceived') {
    message = (
      <Text style={styles.cardDescription}>
        띵동~ 오늘의 추천곡이 도착했어요!{'\n'}지금 바로 확인해보세요.
      </Text>
    );
  } else if (type === 'songSent' && nickname) {
    message = (
      <Text style={styles.cardDescription}>
        내가 추천한 곡이 <Text style={{ fontWeight: 'bold' }}>{nickname}</Text>{' '}
        님에게 전달됐어요.
      </Text>
    );
  } else if (type === 'songUnread' && nickname) {
    message = (
      <Text style={styles.cardDescription}>
        오늘의 추천곡을 확인해주세요.{'\n'}
        <Text style={{ fontWeight: 'bold' }}>{nickname}</Text> 님이 애타게
        기다리고 있어요 ㅜ.ㅜ
      </Text>
    );
  } else if (type === 'comment' && nickname) {
    message = (
      <Text style={styles.cardDescription}>
        띵동~ 오늘의 추천곡에 대한{'\n'}
        <Text style={{ fontWeight: 'bold' }}>{nickname}</Text> 님의 코멘트가
        도착했어요!
      </Text>
    );
  } else if (type === 'announcement' && date && timeStart && timeEnd) {
    const dateStr = dayjs(date).locale('ko').format('M월 D일 dddd');
    message = (
      <Text style={styles.cardDescription}>
        <Text style={{ fontWeight: 'bold', color: '#fff' }}>
          {dateStr} {timeStart} ~ {timeEnd}
        </Text>
        {'\n'}밴놀 서비스 점검이 진행됩니다.
      </Text>
    );
  } else if (type === 'superfan' && artist) {
    message = (
      <Text style={styles.cardDescription}>
        대단해요! {'\n'}
        <Text style={{ fontWeight: 'bold' }}>{artist}</Text>의 SUPERFAN이
        되었습니다.
      </Text>
    );
  } else if (type === 'report' && reportMonth) {
    message = (
      <Text style={styles.cardDescription}>
        지금 바로{'\n'}
        나의 <Text style={{ fontWeight: 'bold' }}>{reportMonth}</Text> 밴놀
        리포트를 확인해보세요!
      </Text>
    );
  } else if (type === 'bookmark' && nickname) {
    message = (
      <Text style={styles.cardDescription}>
        <Text style={{ fontWeight: 'bold' }}>{nickname}</Text> 님이 내 포스트를
        북마크했습니다.
      </Text>
    );
  } else if (type === 'like' && nickname) {
    message = (
      <Text style={styles.cardDescription}>
        <Text style={{ fontWeight: 'bold' }}>{nickname}</Text> 님이 내 포스트를
        좋아합니다.
      </Text>
    );
  } else {
    // 타입 오류
    message = (
      <Text style={styles.cardDescription}>유효하지 않은 알림입니다.</Text>
    );
  }

  return (
    <View style={styles.card}>
      <NotificationIcon type={type} />
      <View style={styles.cardTextBox}>{message}</View>
      <Text style={styles.cardTime}>{time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  backArrow: {
    padding: 8,
    marginRight: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  backIcon: {
    color: '#fff',
    width: 24,
  },
  headerTitle: {
    alignItems: 'center',
    justifyContent: 'center',
    ...Typography.subtitle1B,
    textAlign: 'center',
    color: '#fff',
  },
  list: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 14,
    gap: 12,
  },
  cardIcon: {
    fontSize: 20,
  },
  cardTextBox: {
    flex: 1,
  },
  cardTitle: {
    ...Typography.caption1,
    color: '#fff',
  },
  cardDescription: {
    ...Typography.caption1,
    color: '#fff',
    marginTop: 2,
  },
  cardTime: {
    ...Typography.caption1,
    color: '#7C7C7C',
  },
});
