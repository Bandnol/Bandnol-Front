import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import Backarrow from '@/assets/icons/size_m/backarrow.svg';
import Gallery from '@/assets/icons/size_m/gallery.svg';
import Quit from '@/assets/icons/size_m/quit.svg';
import Friend from '@/assets/icons/size_s/friend.svg';
import Global from '@/assets/icons/size_s/global.svg';
import Private from '@/assets/icons/size_s/private.svg';
import { Typography } from '@/constants/typography';

export default function PostWrite() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [range, setRange] = useState<'public' | 'friend' | 'private'>('public');
  const [images, setImages] = useState<string[]>([]);
  const [isConfirmVisible, setConfirmVisible] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    nickname?: string;
    photo?: string | null;
  }>({});

  useEffect(() => {
    (async () => {
      try {
        const raw = await SecureStore.getItemAsync('user');
        if (!raw) return;
        const u = JSON.parse(raw);
        setUserProfile({
          nickname: u?.nickname ?? u?.name ?? '',
          photo: u?.photo ?? null,
        });
      } catch (e) {
        console.warn('[PostWrite] failed to load user from SecureStore', e);
      }
    })();
  }, []);

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 1,
      selectionLimit: 10, // 선택 수 제한 (optional)
    });

    if (!result.canceled) {
      const uris = result.assets.map((asset) => asset.uri);
      setImages(uris);
    }
  };
  // 1. 상태 텍스트 매핑
  const rangeLabel = {
    public: '전체공개',
    friend: '친구공개',
    private: '비공개',
  };

  // 2. 아이콘 매핑
  const rangeIcon = {
    public: <Global style={{ width: 18, height: 18 }} />,
    friend: <Friend style={{ width: 18, height: 18 }} />,
    private: <Private style={{ width: 18, height: 18 }} />,
  };

  // 3. 버튼 onPress 로직
  const handleToggleRange = () => {
    setRange((prev) => {
      if (prev === 'public') return 'friend';
      if (prev === 'friend') return 'private';
      return 'public';
    });
  };
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    router.push('/post');
  };
  const handleBackPress = () => {
    if (content.trim().length > 0 || images.length > 0) {
      setConfirmVisible(true); // 작성 내용 있으면 모달 띄움
    } else {
      router.back(); // 없으면 바로 나감
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleBackPress}>
          <Backarrow style={{ width: 24, height: 24 }} />
        </Pressable>
        <View style={styles.rightHeader}>
          <Pressable onPress={handleToggleRange}>
            <View style={styles.rangeButton}>
              {rangeIcon[range]}
              <Text style={styles.rangeText}>{rangeLabel[range]}</Text>
            </View>
          </Pressable>
          <Pressable onPress={handleSubmit}>
            <View style={styles.submitButton}>
              <Text style={styles.submitText}>게시</Text>
            </View>
          </Pressable>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Image
          source={
            userProfile.photo
              ? { uri: userProfile.photo }
              : require('@/assets/images/profile.png')
          }
          style={styles.profilePic}
        />
        <View style={styles.inputWrapper}>
          <View>
            <Text style={styles.nicknameText}>
              {userProfile.nickname || 'Nickname'}
            </Text>
          </View>
          <TextInput
            value={content}
            onChangeText={setContent}
            style={[styles.input]}
            placeholder="오늘의 밴놀을 기록해보세요!"
            placeholderTextColor="#7C7C7C"
            multiline
          />

          {images.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.imageScrollView}
            >
              {images.map((uri, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri }} style={styles.imagePreview} />
                  <Pressable
                    style={styles.closeButton}
                    onPress={() => handleRemoveImage(index)}
                  >
                    <Quit width={16} height={16} />
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          )}

          {images.length === 0 && (
            <Pressable onPress={pickImages}>
              <View style={styles.addMediaButton}>
                <Gallery />
                <Text style={styles.addMediaText}>미디어 추가하기 ...</Text>
              </View>
            </Pressable>
          )}
        </View>
      </View>
      {isConfirmVisible && (
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>
              현재까지 작성한 내용이 초기화되고{'\n'}처음 화면으로 돌아갑니다.
            </Text>
            <Pressable
              style={styles.modalConfirm}
              onPress={() => {
                setContent('');
                setImages([]);
                setConfirmVisible(false);
                router.back();
              }}
            >
              <Text style={styles.modalConfirmText}>확인</Text>
            </Pressable>
          </View>

          <Pressable onPress={() => setConfirmVisible(false)}>
            <Text style={styles.modalCancelText}>취소</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  rightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  rangeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#333',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  rangeText: {
    ...Typography.subtitle3,
    color: '#F4F4F4',

    fontWeight: '600',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#F4F4F4',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  submitText: {
    ...Typography.subtitle3,
    color: '#121212',
    fontWeight: '600',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 26,
    paddingVertical: 20,
    gap: 13,
  },
  profilePic: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#888', // 추후 이미지 들어갈 자리
  },
  nicknameText: {
    ...Typography.subtitle1,
    color: '#F4F4F4',
    fontWeight: '600',
    fontSize: 18,
  },
  inputWrapper: {
    gap: 8,
    flex: 1,
  },
  input: {
    ...Typography.body1,
    color: '#B3B3B3',
    marginTop: 2,
    marginBottom: 12,
    fontSize: 18,
  },
  addMediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addMediaText: {
    ...Typography.subtitle3,
    color: '#7C7C7C',
    justifyContent: 'center',
  },
  imageScrollView: {
    marginTop: 10,
    marginBottom: 20,
    paddingLeft: 2,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  imagePreview: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginRight: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 20,
    backgroundColor: '#777',
    borderRadius: 9999,
    padding: 5,
    zIndex: 1,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  modalBox: {
    backgroundColor: '#222',
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
    overflow: 'hidden',
  },
  modalText: {
    textAlign: 'center',
    color: '#F4F4F4',
    fontSize: 16,
    fontFamily: 'Pretendard',
    fontWeight: '400',
    letterSpacing: -0.48,
    lineHeight: 22,
    padding: 40,
  },
  modalConfirm: {
    backgroundColor: '#FF4D4D',
    width: '100%',
    //borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  modalConfirmText: {
    ...Typography.subtitle3,
    color: '#F4F4F4',
    fontSize: 14,
    fontWeight: '600',
  },
  modalCancelText: {
    ...Typography.subtitle3,
    paddingTop: 25,
    fontSize: 14,
    fontWeight: '600',
    color: '#F4F4F4',
    textDecorationLine: 'underline',
  },
});
