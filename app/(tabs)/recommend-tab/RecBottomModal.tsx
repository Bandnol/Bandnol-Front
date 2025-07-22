import Share from '@/assets/icons/size_m/share.svg';
import { RecommendedItem, RecommendingItem } from '@/components/testdata';
import { Typography } from '@/constants/tyopography';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import RecShareModal from './RecShareModal';

type RecBottomModalProps = {
  visible: boolean;
  onClose: () => void;
  selectedDate: string | null;
  isTabRecommending?: boolean;
  songData: RecommendingItem | RecommendedItem | undefined;
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
                {dayjs(selectedDate).format(' M월 D일 (dd)')}
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
                : `${(songData as RecommendedItem).senderNickname}의 추천곡`}
            </Text>

            <View style={styles.myrecInfo}>
              <Image
                source={{ uri: songData.imageUrl }}
                style={{ width: 36, height: 36, padding: 4 }}
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
            </View>
          </View>
        </View>
      </Modal>

      <RecShareModal
        visible={isShareVisible}
        onClose={() => setIsShareVisible(false)}
        recData={songData as RecommendedItem | RecommendingItem}
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
    textAlign: 'left',
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
    paddingHorizontal: 3.91,
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
