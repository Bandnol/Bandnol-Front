// components/common/ReactivationModal.tsx
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/typography';

export type ReactivationModalProps = {
  visible: boolean;
  onConfirm: () => void;
  nickname: string;
};

const ReactivationModal: React.FC<ReactivationModalProps> = ({
  visible,
  onConfirm,
  nickname,
}) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={() => {}} // 뒤로가기 버튼 비활성화
    >
      <View style={styles.modalBackground}>
        <View style={styles.wrapper}>
          {/* 상단 텍스트 박스 */}
          <View style={styles.headerBox}>
            <Text style={styles.headerText}>
              {nickname}님, 다시 만나서 반가워요!{'\n'}계정이 재활성화되었습니다.
            </Text>
          </View>
          {/* 확인 버튼 */}
          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={onConfirm}
          >
            <Text style={styles.confirmText}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    width: 324,
    height: 144,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  headerBox: {
    width: 324,
    backgroundColor: Colors.palette.Gray700,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 40,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: Colors.palette.white,
    fontFamily: 'Pretendard',
    fontSize: 16,
    letterSpacing: -0.48,
    textAlign: 'center',
    lineHeight: 24,
  },
  confirmBtn: {
    width: 324,
    height: 50,
    backgroundColor: Colors.palette.point,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmText: {
    color: Colors.palette.white,
    ...Typography.subtitle3,
  },
});

export default ReactivationModal;