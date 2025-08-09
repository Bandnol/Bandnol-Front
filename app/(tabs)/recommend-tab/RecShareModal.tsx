import { Typography } from '@/constants/typography';
import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import { useRef, useState } from 'react'; // ⬅️ 수정: useRef 추가
// 상단 import 구역에 추가
import Share, { Social } from 'react-native-share'; // ⬅️ 인스타 스토리 공유용
import { Platform } from 'react-native'; // ⬅️ 안내용(오류 핸들링)

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

  // 기존 handleShareToX 교체
  const handleShareToX = async () => {
    try {
      if (!recData) return;

      // 1) ViewShot으로 현재 카드 캡처 (용량 줄이고 싶으면 width/quality 조정)
      const uri = await viewShotRef.current?.capture?.();
      if (!uri) throw new Error('이미지 캡처 실패');

      const shareUrl = `https://bandnol.app/recoms/${recData.id}`;
      const message = `${recData.title} - ${recData.artistName}\n${shareUrl}`;

      if (Platform.OS === 'ios') {
        // 2) iOS: X 앱에 이미지 + 텍스트로 바로 공유
        await Share.shareSingle({
          social: Social.Twitter, // ✅ iOS에서만 지원
          url: uri, // 캡처 이미지 파일 URI
          type: 'image/png', // 또는 'image/*'
          message, // 텍스트(링크 포함)
        });
      } else {
        // 3) Android: 트위터 앱에 이미지 직접 붙이기는 공식 지원 없음
        //    폴백 1) 시스템 공유 시트로 열어 사용자가 X를 선택해 붙이기
        try {
          await Share.open({
            url: uri,
            type: 'image/png',
            message,
            failOnCancel: false,
          });
        } catch {
          // 4) 폴백 2) 웹 인텐트(이미지 첨부 불가, 텍스트/링크만)
          const text = encodeURIComponent(message);
          await Linking.openURL(
            `https://twitter.com/intent/tweet?text=${text}`,
          );
        }
      }
    } catch (e: any) {
      Alert.alert('공유 실패', e?.message ?? String(e));
    }
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
  // 컴포넌트 내부, handleSaveImage 아래에 추가
  // ⬇️ 인스타 스토리 공유: ViewShot으로 캡처 → react-native-share로 열기
  const handleShareToInstagramStory = async () => {
    try {
      if (!recData) return;

      // 1) ViewShot으로 현재 카드(=containerInner 포함 영역) 캡처
      //  - format/png + quality 1로 고화질
      //  - 기본 반환은 파일 URI (예: file:///var/...) 이고, IG 스토리의 backgroundImage로 바로 사용 가능
      const uri = await viewShotRef.current?.capture?.();
      if (!uri) throw new Error('이미지 캡처 실패');

      // 2) 스토리 딥링크/출처 URL (선택)
      const deepLink = `https://bandnol.app/recoms/${recData.id}`;

      // 3) 페이스북 앱 ID (⚠️ 2023.01부터 IG Stories에 필수)
      //    실제 발급받은 Facebook App ID로 교체하세요.
      const FACEBOOK_APP_ID = 'YOUR_FB_APP_ID'; // ⬅️ TODO: 실제 앱 ID로 교체

      // 4) react-native-share: 특정 앱(IG Stories)로 바로 공유
      await Share.shareSingle({
        social: Social.InstagramStories,
        appId: FACEBOOK_APP_ID, // ⬅️ 필수
        backgroundImage: uri, // ⬅️ 방금 캡처한 이미지 전체를 배경으로
        //stickerImage: uri, // ⬅️ 스티커로 쓰고 싶으면 주석 해제
        backgroundTopColor: '#000000',
        backgroundBottomColor: '#000000',
        attributionURL: deepLink, // ⬅️ 선택: 스토리에서 출처 링크
        linkUrl: `https://bandnol.app/recoms/${recData.id}`,
        linkText: '보기',
      });
    } catch (error: any) {
      // IG 미설치, 사용자가 닫기, Expo Go 사용 등 케이스
      const msg =
        Platform.OS === 'ios'
          ? '인스타그램 앱이 설치되어 있고 Dev Client/EAS 빌드에서만 동작합니다. (Expo Go에서는 동작하지 않음)'
          : (error?.message ?? String(error));
      Alert.alert('공유 실패', msg);
    }
  };

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
        options={{ format: 'png', quality: 1, width: 300 }} // ⬅️ 추가: 고화질 PNG
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
        <Pressable
          style={styles.shareItem}
          onPress={handleShareToInstagramStory}
        >
          <View style={styles.shareButton}>
            <Insta />
          </View>
          <Text style={styles.shareText}>인스타그램으로 공유</Text>
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
