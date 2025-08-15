import type { CalendarItem } from '@/app/(tabs)/recommend-tab/RecommendCal';
import Share from '@/assets/icons/size_m/share.svg';
import { Typography } from '@/constants/typography';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import RecShareModal from './RecShareModal';

type RecBottomModalProps = {
  visible: boolean;
  onClose: () => void;
  selectedDate: string | null;
  isTabRecommending?: boolean;
  songData?: CalendarItem | undefined;
  isToday?: boolean;
};

export default function RecBottomModal({
  visible,
  onClose,
  selectedDate,
  isTabRecommending,
  songData,
  isToday,
}: RecBottomModalProps) {
  const [isShareVisible, setIsShareVisible] = useState(false);
  const router = useRouter();

  if (!selectedDate || !songData) return null;

  return (
    <>
      <Modal
        isVisible={visible}
        onBackdropPress={onClose}
        style={styles.bottomModal}
        hasBackdrop={false}
        coverScreen={false}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View
              style={{
                ...styles.modalHeader,
                justifyContent: 'flex-start',
                paddingHorizontal: 0,
              }}
            >
              {isToday && (
                <View style={styles.todayContainer}>
                  <Text style={styles.todayText}>Today</Text>
                </View>
              )}
              <Text style={styles.modalDateText}>
                {dayjs(selectedDate).format('M월 D일 (dd)')}
              </Text>
            </View>

            <Pressable onPress={() => setIsShareVisible(true)}>
              <Share />
            </Pressable>
          </View>

          <View style={styles.modalRecInfo}>
            <Text style={styles.myrecText}>
              {isTabRecommending
                ? '나의 추천곡'
                : `${(songData as CalendarItem).senderNickname}의 추천곡`}
            </Text>
            <Pressable
              onPress={() => {
                // 일부 데이터는 artistId 대신 artist?.id 형태로 올 수 있음
                const rawId =
                  (songData as any)?.artistId ?? (songData as any)?.artist?.id;
                const id = rawId != null ? String(rawId).trim() : '';
                if (!id) {
                  // 아이디가 없으면 이동하지 않고 안내
                  // TODO: 필요 시 이름 기반 검색 화면으로 우회 이동 가능
                  alert('아티스트 정보를 찾을 수 없어요.');
                  return;
                }
                router.push(`/artist/${encodeURIComponent(id)}`);
              }}
              style={styles.myrecInfo}
            >
              <Image
                source={{ uri: songData.imageUrl }}
                style={{
                  width: 28,
                  height: 28,
                  padding: 4,
                  borderRadius: 2,
                  marginRight: 4,
                }}
              />

              <View style={styles.myrecSong}>
                <Text style={styles.myrecTitle}>{songData.title}</Text>
                <Text style={styles.myrecArtist}>{songData.artistName}</Text>
              </View>

              <View
                style={{
                  width: 1.955,
                  height: 27.37,
                  backgroundColor: '#FB4932',
                }}
              ></View>

              <Text style={styles.myrecComment}>{songData.comment}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <RecShareModal
        visible={isShareVisible}
        onClose={() => setIsShareVisible(false)}
        recData={songData as CalendarItem}
      />
    </>
  );
}

const styles = StyleSheet.create({
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    display: 'flex',
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexDirection: 'column',
    alignItems: 'flex-start',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#333',
  },
  modalHeader: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'flex-start',
    gap: 10,
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
  modalDateText: {
    ...Typography.subtitle1,
    color: '#fff',
    fontWeight: '700',
  },
  modalRecInfo: {
    flexDirection: 'column',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
    gap: 6,
    alignSelf: 'stretch',
    borderBottomWidth: 0.5,
    borderBottomColor: '#7C7C7C',
    backgroundColor: '#333',
  },
  myrecText: {
    ...Typography.subtitle4,
    color: '#fff',
    fontWeight: '600',
  },
  myrecInfo: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 0,
    alignItems: 'center',
    gap: 6.843,
  },
  myrecSong: {
    flexDirection: 'column',
    width: 100,
    gap: 2,
  },
  myrecTitle: {
    ...Typography.subtitle4,
    color: '#fff',
    fontWeight: '600',
  },
  myrecArtist: {
    ...Typography.subtitle4,
    color: '#fff',
    fontWeight: '400',
  },
  myrecComment: {
    ...Typography.caption2,
    color: '#fff',
    fontWeight: '400',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  todayText: {
    color: '#D9D9D9',
    textAlign: 'center',
    fontFamily: 'Pretendard',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 16.8,
    letterSpacing: -0.3,
  },
  todayContainer: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#FB4932',
    gap: 10,
  },
});
