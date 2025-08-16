import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import BackArrowIcon from '@/assets/icons/back-arrow.svg';
import EditIcon from '@/assets/icons/edit.svg';
import ProfileImage from '@/assets/images/profile.png';
import { Typography } from '@/constants/typography';

export default function EditProfile() {
  const [nickname, setNickname] = useState('');
  const [intro, setIntro] = useState('');
  const [focusedField, setFocusedField] = useState<'nickname' | 'intro' | null>(
    null,
  );
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showBackgroundModal, setShowBackgroundModal] = useState(false);

  const handleGoBack = () => {
    router.push('/(tabs)/myPage/myPage');
  };

  const handleSave = () => {
    // 저장 로직이 있으면 추가하고, 이후 이동
    router.push('/(tabs)/myPage/myPage');
  };

  return (
    <ScrollView style={styles.safeArea}>
      <StatusBar
        translucent
        backgroundColor="#121212"
        barStyle="dark-content"
      />
      <View style={styles.container}>
        {/* 왼쪽: 뒤로가기 아이콘 */}
        <TouchableOpacity onPress={handleGoBack}>
          <BackArrowIcon width={24} height={24} />
        </TouchableOpacity>

        {/* 중앙: 텍스트 */}
        <Text style={styles.title}>프로필 편집</Text>

        {/* 오른쪽: 저장 텍스트 버튼 */}
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveText}>저장</Text>
        </TouchableOpacity>
      </View>
      {/* {배경 사진} */}
      <View style={styles.bgWrapper}>
        <Image
          source={require('@/assets/images/background.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.editIcon}
          onPress={() => setShowBackgroundModal(true)}
        >
          <View style={styles.editIconCircle}>
            <EditIcon width={18} height={18} />
          </View>
        </TouchableOpacity>
      </View>
      {/* {프로필 사진 수정} */}
      <View style={styles.profileImageWrapper}>
        <TouchableOpacity onPress={() => setShowProfileModal(true)}>
          <Image source={ProfileImage} style={styles.profileImage} />
        </TouchableOpacity>
      </View>
      {/* 텍스트 필드 영역 */}
      <View style={styles.textFieldWrapper}>
        {/* 첫 번째 필드 */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>닉네임</Text>
          <TextInput
            style={[
              styles.input,
              focusedField === 'nickname'
                ? styles.inputFocused
                : styles.inputBlurred,
            ]}
            value={nickname}
            onChangeText={setNickname}
            placeholder="텍스트"
            placeholderTextColor="#F4F4F4"
            onFocus={() => setFocusedField('nickname')}
            onBlur={() => setFocusedField(null)}
          />
        </View>

        {/* 두 번째 필드 */}
        <View style={[styles.inputGroup, { marginTop: 12 }]}>
          <Text style={styles.label}>소개</Text>
          <TextInput
            style={[
              styles.input,
              focusedField === 'intro'
                ? styles.inputFocused
                : styles.inputBlurred,
            ]}
            value={intro}
            onChangeText={setIntro}
            placeholder="텍스트"
            placeholderTextColor="#F4F4F4"
            onFocus={() => setFocusedField('intro')}
            onBlur={() => setFocusedField(null)}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: 375,
    height: 64,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#121212',
  },
  title: {
    ...Typography.subtitle1B,
    color: '#FFF',
    textAlign: 'center',
    flex: 1,
  },
  saveText: {
    ...Typography.subtitle1,
    color: '#FFF',
  }, //배경 만들기
  bgWrapper: {
    position: 'relative',
    width: 375,
    height: 146,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },
  editIcon: {
    position: 'absolute',
    bottom: 10,
    right: 20,
  },
  editIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageWrapper: {
    alignItems: 'center',
    marginTop: -25,
  },
  profileImage: {
    width: 76,
    height: 76,
    borderRadius: 36,
    borderWidth: 0.34,
    borderColor: '#7C7C7C',
  },
  textFieldWrapper: {
    marginTop: 22, // background image 아래 마진
    paddingHorizontal: 20,
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  }, // 텍스트 필드
  label: {
    color: '#7C7C7C',
    ...Typography.body2,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#7C7C7C',
    ...Typography.body2,
  },
  inputFocused: {
    borderColor: '#FFF',
  },
  inputBlurred: {
    borderColor: '#7C7C7C',
  },
});
