import { RecommendedItem, RecommendingItem } from '@/components/testdata';
import { Typography } from '@/constants/typography';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';

import Insta from '@/assets/icons/size_m/insta.svg';
import Link from '@/assets/icons/size_m/link.svg';
import X from '@/assets/icons/size_m/x.svg';

type RecShareModalProps = {
  visible: boolean;
  onClose: () => void;
  recData: RecommendedItem | RecommendingItem | undefined;
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function RecShareModal({
  visible,
  onClose,
  recData,
}: RecShareModalProps) {
  if (!recData) return null;

  const isRecommended = 'senderNickname' in recData;

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      backdropOpacity={0.8}
      style={styles.modal}
    >
      <View style={styles.wrapper}>
        {/* 콘텐츠 박스 */}
        <View style={styles.container}>
          <Image source={{ uri: recData.imageUrl }} style={styles.image} />

          {isRecommended && (
            <Text style={styles.toText}>
              To. <Text style={{ color: '#F4F4F4' }}>me</Text>
            </Text>
          )}
          <Text style={styles.titleText}>{recData.title}</Text>
          <Text style={styles.artistText}>{recData.artistName}</Text>

          <View style={styles.commentBox}>
            <Text style={styles.commentText}>{recData.comment}</Text>
          </View>

          <Text style={styles.fromText}>
            From.{' '}
            <Text style={{ color: '#F4F4F4' }}>
              {isRecommended ? recData.senderNickname : 'me'}
            </Text>
          </Text>
        </View>

        {/* 공유 버튼 그룹 */}
        <View style={styles.buttonGroup}>
          <View style={styles.shareItem}>
            <View style={styles.shareButton}>
              <Insta />
            </View>
            <Text style={styles.shareText}>인스타그램으로{'\n'}공유</Text>
          </View>

          <View style={styles.shareItem}>
            <View style={styles.shareButton}>
              <X />
            </View>
            <Text style={styles.shareText}>X로 공유</Text>
          </View>

          <View style={styles.shareItem}>
            <View style={styles.shareButton}>
              <Link />
            </View>
            <Text style={styles.shareText}>링크 복사</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: [
      { translateX: -(SCREEN_WIDTH * 0.45) }, // width: 90% 이므로 절반
      { translateY: -180 }, // 대략 절반 높이 보정
    ],
    width: '90%',
    height: 489,
    backgroundColor: '#222',
    borderRadius: 12,
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: '70%',
    aspectRatio: 1,

    marginBottom: 8,
  },
  toText: {
    ...Typography.subtitle4,
    color: '#D9D9D9',
    marginTop: 4,
    marginBottom: 10,
    fontWeight: '600',
  },
  titleText: {
    ...Typography.subtitle1B,
    color: '#F4F4F4',
    fontWeight: '600',
    marginBottom: 4,
  },
  artistText: {
    ...Typography.body2,
    color: '#B3B3B3',
    marginBottom: 11,
  },
  commentBox: {
    width: '100%',
    height: 86,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentText: {
    ...Typography.caption1,
    color: '#EAEAEA',
    textAlign: 'center',
  },
  fromText: {
    ...Typography.subtitle4,
    color: '#D9D9D9',
  },
  buttonGroup: {
    position: 'absolute',
    top: '80%',
    left: '50%',
    transform: [
      { translateX: -(SCREEN_WIDTH * 0.35) }, // 버튼 그룹 너비 70%
    ],
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 25,
    width: '70%',
  },
  shareItem: {
    alignItems: 'center',
    width: 80,
  },
  shareButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  shareText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
});
