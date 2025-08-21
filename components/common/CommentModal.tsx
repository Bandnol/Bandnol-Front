import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Typography } from '@/constants/typography';

type Props = {
  visible: boolean;
  onClose: () => void;

  // 공통
  title: string; // "From. ...", "To. ..."
  closeText?: string; // 읽기: "닫기" / 입력: "답장 보내기"
  closeColor?: string; // 읽기: '#1F1F1F' / 입력: '#FB4932'

  // 읽기 전용
  description?: string;

  // 입력 모드
  editable?: boolean;
  inputValue?: string;
  onChangeText?: (t: string) => void;
  onSubmit?: (t: string) => void;
  submitting?: boolean;
};

export default function CommentModal({
  visible,
  onClose,
  title,
  description = '',
  closeText = '닫기',
  closeColor = '#1F1F1F',
  editable = false,
  inputValue = '',
  onChangeText,
  onSubmit,
  submitting = false,
}: Props) {
  const canSubmit = editable && !!inputValue.trim() && !submitting;

  const handlePrimary = () => {
    if (editable) onSubmit?.(inputValue);
    else onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={styles.backdrop}
      >
        {/* 빈 공간 터치 시 키보드 내려감 */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={styles.card}>
          {/* 상단 영역 */}
          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>

            {editable ? (
              <TextInput
                value={inputValue}
                onChangeText={onChangeText}
                placeholder="내용을 입력해 주세요"
                placeholderTextColor="#9A9A9A"
                multiline
                autoFocus
                style={styles.input}
              />
            ) : (
              <Text style={styles.description}>{description}</Text>
            )}
          </View>

          {/* 하단 버튼 */}
          <View style={[styles.footer, { backgroundColor: closeColor }]}>
            <TouchableOpacity
              style={styles.footerBtn}
              onPress={handlePrimary}
              disabled={editable && !canSubmit}
            >
              <Text style={styles.footerTxt}>
                {editable ? (submitting ? '전송중…' : closeText) : closeText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const CARD_BG = '#333';

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: 335,
    borderRadius: 10,
    overflow: 'hidden',
  },
  content: {
    minHeight: 278,
    width: '100%',
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: CARD_BG,
    alignItems: 'center',
  },
  title: {
    color: '#FFF',
    ...Typography.subtitle1B,
  },
  description: {
    width: '100%',
    color: '#FFF',
    ...Typography.body2,
    textAlign: 'left',
    marginTop: 20,
    paddingHorizontal: 10,
    lineHeight: 22,
  },
  input: {
    width: '100%',
    minHeight: 150,
    color: '#FFF',
    ...Typography.body2,
    textAlignVertical: 'top',
    marginTop: 20,
    backgroundColor: CARD_BG,
    borderRadius: 8,
    padding: 12,
  },
  footer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerBtn: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  footerTxt: {
    ...Typography.subtitle3,
    color: '#FFFFFF',
  },
});
