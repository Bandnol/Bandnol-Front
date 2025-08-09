import { Typography } from '@/constants/typography';
import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import { useRef, useState } from 'react'; // ⬅️ 수정: useRef 추가

import {
  Alert, //나중에 toast로 변경하기
  Image,
  LayoutChangeEvent,
  Pressable, // ⬅️ Pressable 사용
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import Svg, { Circle } from 'react-native-svg';
import type { CalendarItem } from './RecommendCal';

import ViewShot from 'react-native-view-shot'; // ⬅️ 추가
import * as MediaLibrary from 'expo-media-library'; // ⬅️ 추가

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
  const viewShotRef = useRef<ViewShot>(null); // ⬅️ 추가

  if (!recData) return null;
  const isRecommended = 'senderNickname' in recData;

  const handleLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  const handleCopyLink = async () => {
    if (!recData) return;
    const shareUrl = `https://bandnol.app/recoms/${recData.id}`; // 예시 링크
    await Clipboard.setStringAsync(shareUrl);
    Alert.alert('링크가 복사되었습니다.');
  };

  const handleShareToX = () => {
    if (!recData) return;
    const shareUrl = `https://bandnol.app/recoms/${recData.id}`;
    const text = encodeURIComponent(
      `${recData.title} - ${recData.artistName}\n${shareUrl}`,
    );

    // X 앱 열기 (앱이 없으면 웹으로 이동)
    Linking.openURL(`twitter://post?message=${text}`).catch(() => {
      Linking.openURL(`https://twitter.com/intent/tweet?text=${text}`);
    });
  };

  // ⬅️ 추가: containerInner만 캡처해서 저장
  const handleSaveImage = async () => {
    try {
      // 권한 요청
      const perm = await MediaLibrary.requestPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('권한 필요', '사진 보관함 저장 권한을 허용해주세요.');
        return;
      }

      // ViewShot 캡처
      const uri = await viewShotRef.current?.capture?.();
      if (!uri) throw new Error('이미지 캡처에 실패했습니다.');

      // 갤러리에 저장
      const asset = await MediaLibrary.createAssetAsync(uri);
      // 없으면 앨범 생성 시도 (이미 있으면 catch로 무시)
      await MediaLibrary.createAlbumAsync('Bandnol', asset, false).catch(
        () => {},
      );
      Alert.alert('저장 완료', '갤러리에 이미지가 저장되었습니다.');
    } catch (e: any) {
      Alert.alert('저장 실패', e?.message ?? String(e));
    }
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
      <ViewShot
        ref={viewShotRef} // ⬅️ 추가
        options={{ format: 'png', quality: 1 }} // ⬅️ 추가: 고화질 PNG
        style={{ borderRadius: OUTER_RADIUS - BORDER_WIDTH }} // 시각 통일
      >
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
      </ViewShot>

      {/* 공유 버튼 그룹 */}
      <View style={styles.buttonGroup}>
        {/* ⬇️ 버튼을 Pressable로 바꾸고 onPress 연결 */}
        <Pressable style={styles.shareItem} onPress={handleSaveImage}>
          <View style={styles.shareButton}>
            <Insta />
          </View>
          <Text style={styles.shareText}>이미지 저장</Text>
        </Pressable>

        <View style={styles.shareItem}>
          <Pressable style={styles.shareButton} onPress={handleShareToX}>
            <X />
          </Pressable>
          <Text style={styles.shareText}>X로 공유</Text>
        </View>

        <View style={styles.shareItem}>
          <Pressable style={styles.shareButton} onPress={handleCopyLink}>
            <Link />
          </Pressable>
          <Text style={styles.shareText}>링크 복사</Text>
        </View>
      </View>

      {/* 닫기 버튼은 캡처 영역 바깥(= wrapper)에 둬서 이미지에 안 찍히도록 유지 */}
      <Quit
        onPress={onClose}
        style={{
          position: 'absolute',
          alignSelf: 'flex-end',
          top: 20,
          right: 20,
        }}
      />
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
    backgroundColor: '#222',
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
