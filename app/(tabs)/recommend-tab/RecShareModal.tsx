import Logo from '@/assets/icons/logo.svg';
import Insta from '@/assets/icons/size_m/insta.svg';
import Link from '@/assets/icons/size_m/link.svg';
import Quit from '@/assets/icons/size_m/quit.svg';
import X from '@/assets/icons/size_m/x.svg';
import { Typography } from '@/constants/typography';
import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import { useRef } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Modal from 'react-native-modal';

import Share, { Social } from 'react-native-share';


import Svg, { Circle } from 'react-native-svg';
import ViewShot from 'react-native-view-shot';
import type { CalendarItem } from './RecommendCal';

type RecShareModalProps = {
  visible: boolean;
  onClose: () => void;
  recData: CalendarItem | undefined;
  isTabRecommending?: boolean; //false면 From.@@@ & To.me 다 있고 true면 From.me만 있음
};
const { width: screenWidth } = Dimensions.get('window');
let scale = 1;

if (screenWidth < 415) {
  scale = screenWidth / 415;
}
export default function RecShareModal({
  visible,
  onClose,
  recData,
  isTabRecommending = true, // 기본값 true로 설정
}: RecShareModalProps) {
  const viewShotRefInsta = useRef<ViewShot>(null);
  const viewShotRefX = useRef<ViewShot>(null);
  const viewShotRefBg = useRef<ViewShot>(null);
  if (!recData) return null;

  const handleCopyLink = async () => {
    if (!recData) return;
    const shareUrl = `https://bandnol.app/recoms/${recData.id}`; // 예시 링크
    await Clipboard.setStringAsync(shareUrl);
    Alert.alert('링크가 복사되었습니다.');
  };
  const handleShareToInstagramStory = async () => {
    if (Platform.OS === 'ios') {
      try {
        if (!recData) return;
        const stickerUri = await viewShotRefInsta.current?.capture?.();
        if (!stickerUri) throw new Error('이미지 캡처 실패');

        const backgroundUri = await viewShotRefBg.current?.capture?.();
        if (!backgroundUri) throw new Error('배경 이미지 캡처 실패');

        await Share.shareSingle({
          social: Social.InstagramStories,
          appId: 'YOUR_FB_APP_ID',
          backgroundImage: backgroundUri,
          stickerImage: stickerUri,
          backgroundTopColor: '#000000',
          backgroundBottomColor: '#000000',
        });
      } catch (error: any) {
        Linking.openURL('itms-apps://itunes.apple.com/app/id389801252');
      }
    } else {
      try {
        if (!recData) return;
        const { isInstalled } = await Share.isPackageInstalled(
          'com.instagram.android',
        );
        if (!isInstalled) {
          await Linking.openURL(
            'https://play.google.com/store/apps/details?id=com.instagram.android',
          );
          return;
        }
        const stickerUri = await viewShotRefInsta.current?.capture?.();
        if (!stickerUri) throw new Error('이미지 캡처 실패');

        const backgroundUri = await viewShotRefBg.current?.capture?.();
        if (!backgroundUri) throw new Error('배경 이미지 캡처 실패');

        await Share.shareSingle({
          social: Social.InstagramStories,
          appId: 'YOUR_FB_APP_ID',
          backgroundImage: backgroundUri,
          stickerImage: stickerUri,
          backgroundTopColor: '#000000',
          backgroundBottomColor: '#000000',
        });
      } catch (error: any) {
        Linking.openURL(
          'https://play.google.com/store/apps/details?id=com.instagram.android&hl=ko&pli=1',
        );
      }
    }
  };

  const handleShareToX = () => {
    if (!recData) return;
    const shareUrl = `https://bandnol.app/recoms/${recData.id}`;
    const text = encodeURIComponent(
      `${recData.title} - ${recData.artistName}\n${shareUrl}`,
    );

    Linking.openURL(`twitter://post?message=${text}`).catch(() => {
      Linking.openURL(`https://twitter.com/intent/tweet?text=${text}`);
    });
  };

  return (
    <>
      <View style={screenWidth < 410 && { transform: [{ scale }] }}>
        <Modal
          isVisible={visible}
          onBackdropPress={onClose}
          backdropOpacity={0.8}
          style={styles.modal}
        >
          <ViewShot
            ref={viewShotRefInsta}
            options={{ format: 'png', quality: 1, width: 300 }}
            style={{ borderRadius: 15 }}
          >
            <View style={styles.containerWrapper}>
              <View style={styles.containerInner}>
                <View
                  style={{
                    width: 355,
                    marginTop: -140,
                    alignItems: 'center',
                  }}
                >
                  <Image
                    source={{ uri: recData.imageUrl }}
                    style={{
                      width: '100%',
                      aspectRatio: 1,
                      borderRadius: 9999,
                      marginBottom: 8,
                    }}
                    resizeMode="cover"
                  />

                  <Svg
                    width={88}
                    height={88}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: [{ translateX: -44 }, { translateY: -44 }],
                      zIndex: 2,
                    }}
                  >
                    <Circle cx="50%" cy="50%" r="50%" fill="#1F1F1F" />
                  </Svg>

                  <Svg
                    width={178}
                    height={178}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: [{ translateX: -89 }, { translateY: -89 }],
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

                {/* To. me — 말줄임 적용 (혹시 닉네임 길어질 대비) */}
                {!isTabRecommending && (
                  <Text
                    style={styles.toText}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    To. <Text style={{ color: '#F4F4F4' }}>me</Text>
                  </Text>
                )}

                {/* 제목 — 1줄 고정, ... */}
                <Text
                  style={styles.titleText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {recData.title}
                </Text>

                {/* 아티스트 — 1줄 고정, ... */}
                <Text
                  style={styles.artistText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {recData.artistName}
                </Text>

                {/* 코멘트 — 3줄 제한, ... */}
                <View style={styles.commentBox}>
                  <Text
                    style={styles.commentText}
                    numberOfLines={6}
                    ellipsizeMode="tail"
                  >
                    {recData.comment}
                  </Text>
                </View>

                {/* From. XXX — 1줄, ... (닉네임 길이 대비) */}
                <Text
                  style={styles.fromText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  From.{' '}
                  <Text style={{ color: '#F4F4F4' }}>
                    {!isTabRecommending ? recData.senderNickname : 'me'}
                  </Text>
                </Text>

                <View style={styles.logoContainer}>
                  <Logo width={26.964} height={20.298} />
                </View>
              </View>
              <Quit
                onPress={onClose}
                style={{
                  position: 'absolute',
                  alignSelf: 'flex-end',
                  top: 15,
                  right: 15,
                }}
              />
            </View>
          </ViewShot>

          <View style={styles.buttonGroup}>
            <Pressable
              style={styles.shareItem}
              onPress={handleShareToInstagramStory}
            >
              <View style={styles.shareButton}>
                <Insta />
              </View>
              <Text style={styles.shareText}>인스타그램으로 {'\n'} 공유</Text>
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
        </Modal>
      </View>

      {/* 캡쳐용 ViewShot */}
      <View
        pointerEvents="none"
        collapsable={false}
        style={{ position: 'absolute', zIndex: 99, left: -10000, top: -10000 }}
      >
        <ViewShot ref={viewShotRefBg} options={{ format: 'png', quality: 1 }}>
          <Image
            source={{ uri: recData.imageUrl }}
            style={{ width: 1080, height: 1920 }}
            resizeMode="cover"
          />
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: 'rgba(0,0,0,0.75)',
            }}
          />
        </ViewShot>

        <ViewShot
          ref={viewShotRefX}
          options={{ format: 'png', quality: 1, width: 357, height: 187 }}
          style={{
            borderRadius: 16,
          }}
        >
          <View style={styles.XcontainerWrapper}>
            <View style={styles.XcontainerInner}>
              <View style={styles.XLeft}>
                {/* 커버 이미지 */}
                <Image
                  source={{ uri: recData.imageUrl }}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: 220,
                    height: 220,
                    borderRadius: 110,
                    transform: [{ translateX: -110 }, { translateY: -110 }],
                  }}
                  resizeMode="cover"
                />

                {/* 반투명 큰 원 */}
                <Svg
                  width={113}
                  height={113}
                  style={{
                    position: 'absolute',
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

                {/* 중앙 작은 원 (이미 57로 축소됨) */}
                <Svg
                  width={57}
                  height={57}
                  style={{
                    position: 'absolute',
                  }}
                >
                  <Circle cx="50%" cy="50%" r="50%" fill="#1F1F1F" />
                </Svg>
              </View>

              <View style={styles.XRight}>
                {/* To. me — 1줄, ... */}
                {!isTabRecommending && (
                  <Text
                    style={styles.XtoText}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    To. <Text style={{ color: '#F4F4F4' }}>me</Text>
                  </Text>
                )}

                {/* 제목 — 1줄, ... */}
                <Text
                  style={styles.XtitleText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {recData.title}
                </Text>

                {/* 아티스트 — 1줄, ... */}
                <Text
                  style={styles.XartistText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {recData.artistName}
                </Text>

                {/* 코멘트 — 2줄, ... */}
                <View style={styles.XcommentBox}>
                  <Text
                    style={styles.XcommentText}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {recData.comment}
                  </Text>
                </View>

                {/* From. XXX — 1줄, ... */}
                <Text
                  style={styles.XfromText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  From.{' '}
                  <Text style={{ color: '#F4F4F4' }}>
                    {!isTabRecommending ? recData.senderNickname : 'me'}
                  </Text>
                </Text>
              </View>

              <View style={styles.XlogoContainer}>
                <Logo width={16.86} height={12} />
              </View>
            </View>
          </View>
        </ViewShot>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  containerWrapper: {
    width: 335,
    height: 489,
    backgroundColor: '#333',
    padding: 5,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerInner: {
    width: 319,
    height: 440,
    flex: 1,
    backgroundColor: '#333',
    transform: [{ translateY: -3 }],
    borderRadius: 15,
    borderColor: '#7C7C7C',
    borderWidth: 1,
    alignItems: 'center',
    padding: 20,
  },
  toText: {
    ...Typography.subtitle4,
    color: '#D9D9D9',
    marginTop: 19,
    marginBottom: 10,
    fontWeight: '600',
  },
  titleText: {
    ...Typography.subtitle1B,
    color: '#F4F4F4',
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  artistText: {
    ...Typography.body2,
    color: '#B3B3B3',
    marginBottom: 11,
  },
  commentBox: {
    width: '100%',
    flex: 1,
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
    marginTop: 'auto',
  },
  buttonGroup: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    width: '70%',
  },
  shareItem: {
    alignItems: 'center',
    width: 90,
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
  logoContainer: {
    position: 'absolute',
    bottom: -1,
    right: -0.98,
    height: 29.838,
    width: 46.469,
    flexShrink: 0,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,

    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: '#7C7C7C',
    borderLeftColor: '#7C7C7C',

    borderBottomWidth: -3,
    borderRightWidth: -3,
    borderBottomColor: '#333',
    borderRightColor: '#333',

    backgroundColor: '#333',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
  },
  XcontainerWrapper: {
    width: 357,
    height: 187,
    backgroundColor: '#333',
    padding: 5,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  XcontainerInner: {
    width: 344,
    height: 178,
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 15,
    borderColor: '#7C7C7C',
    borderWidth: 1,
    alignItems: 'center',
    padding: 20,
    flexDirection: 'row',
    gap: 12,
  },
  XLeft: {
    width: 130,
    left: -50,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  XRight: {
    flex: 1,
    paddingTop: 14,
    paddingBottom: 14,
    paddingRight: 16,
  },

  XtoText: {
    ...Typography.subtitle4,
    color: '#D9D9D9',
    marginBottom: 13,
    fontWeight: '600',
    height: 17,
  },
  XtitleText: {
    ...Typography.subtitle1B,
    color: '#F4F4F4',
    fontWeight: '600',
    height: 24,
    marginBottom: 4,
    flexShrink: 0,
  },
  XartistText: {
    ...Typography.body2,
    height: 20,
    color: '#B3B3B3',
    marginBottom: 11,
  },
  XcommentBox: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  XcommentText: {
    ...Typography.caption2,
    height: 28,
    color: '#EAEAEA',
    textAlign: 'left',
  },
  XfromText: {
    ...Typography.subtitle4,
    color: '#D9D9D9',
  },
  XlogoContainer: {
    position: 'absolute',
    top: -1,
    right: -1,
    height: 17,
    width: 22,
    flexShrink: 0,

    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,

    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#7C7C7C',
    backgroundColor: '#333', //추후에 보더 추가 필요

    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
