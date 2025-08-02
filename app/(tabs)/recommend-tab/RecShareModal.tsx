import { Typography } from '@/constants/typography';
import { useState } from 'react';
import { Image, LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import Svg, { Circle } from 'react-native-svg';
import type { CalendarItem } from './RecommendCal';

import Insta from '@/assets/icons/size_m/insta.svg';
import Link from '@/assets/icons/size_m/link.svg';
import Quit from '@/assets/icons/size_m/quit.svg';
import X from '@/assets/icons/size_m/x.svg';

type RecShareModalProps = {
  visible: boolean;
  onClose: () => void;
  recData: CalendarItem | undefined;
};

export default function RecShareModal({
  visible,
  onClose,
  recData,
}: RecShareModalProps) {
  const [containerWidth, setContainerWidth] = useState(0);

  if (!recData) return null;
  const isRecommended = 'senderNickname' in recData;

  const handleLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  const circleSize = containerWidth * 0.28;
  const bigCircleSize = containerWidth * 0.52;

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      backdropOpacity={0.8}
      style={styles.modal}
    >
      {/* 테두리 wrapper */}
      <View style={styles.containerWrapper}>
        <View style={styles.containerInner} onLayout={handleLayout}>
          {containerWidth > 0 && (
            <View
              style={{
                position: 'relative',
                width: containerWidth,
                alignItems: 'center',
              }}
            >
              <Image
                source={{ uri: recData.imageUrl }}
                style={{
                  width: containerWidth * 1.1,
                  aspectRatio: 1,
                  borderRadius: 9999,
                  marginTop: -containerWidth * 0.43,
                  marginBottom: 8,
                }}
                resizeMode="cover"
              />

              <Svg
                width={circleSize}
                height={circleSize}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: [
                    { translateX: -circleSize / 2 },
                    { translateY: -circleSize / 0.9 - 10 },
                  ],
                  zIndex: 2,
                }}
              >
                <Circle cx="50%" cy="50%" r="50%" fill="#1F1F1F" />
              </Svg>

              <Svg
                width={bigCircleSize}
                height={bigCircleSize}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: [
                    { translateX: -bigCircleSize / 2 },
                    { translateY: -bigCircleSize / 1.22 - 16 },
                  ],
                  zIndex: 1,
                }}
              >
                <Circle
                  cx="50%"
                  cy="50%"
                  r="50%"
                  fill="black"
                  fillOpacity={0.4}
                />
              </Svg>
            </View>
          )}

          <Quit
            onPress={onClose}
            style={{
              position: 'absolute',
              alignSelf: 'flex-end',
              top: 20,
              right: 20,
            }}
          />

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
    </Modal>
  );
}
const BORDER_WIDTH = 5;
const OUTER_RADIUS = 20;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerWrapper: {
    width: 335,
    height: 489,
    backgroundColor: '#222', // border color
    padding: BORDER_WIDTH,
    borderRadius: OUTER_RADIUS,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerInner: {
    width: 319,
    height: 480,
    flex: 1,
    backgroundColor: '#222',
    borderRadius: OUTER_RADIUS - BORDER_WIDTH,
    borderColor: '#7C7C7C',
    borderWidth: 1,
    alignItems: 'center',
    padding: 20,
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
    marginTop: 20,
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
    lineHeight: 18,
  },
});
