// components/common/ConfirmModal.tsx
import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/typography';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type ConfirmModalProps = {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  headerText: string; // 상단 박스 텍스트 (\n 가능)
  confirmText?: string; // 기본: 확인
  cancelText?: string; // 기본: 취소
  variant?: 'logout' | 'withdraw'; // 두 레이아웃 중 선택
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  onConfirm,
  onCancel,
  headerText,
  confirmText = '확인',
  cancelText = '취소',
  variant = 'logout',
}) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.modalBackground}>
        {variant === 'logout' ? (
          <View style={styles.logoutWrapper}>
            {/* 상단 텍스트 박스 */}
            <View style={styles.logoutHeaderBox}>
              <Text style={styles.logoutHeaderText}>{headerText}</Text>
            </View>
            {/* 확인 버튼 */}
            <TouchableOpacity
              style={styles.logoutConfirmBtn}
              onPress={onConfirm}
            >
              <Text style={styles.logoutConfirmText}>{confirmText}</Text>
            </TouchableOpacity>
            {/* 취소 텍스트 */}
            <TouchableOpacity
              style={styles.logoutCancelWrapper}
              onPress={onCancel}
            >
              <Text style={styles.logoutCancelText}>{cancelText}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.withdrawWrapper}>
            {/* 상단 텍스트 박스 */}
            <View style={styles.withdrawHeaderBox}>
              <Text style={styles.withdrawHeaderText}>{headerText}</Text>
            </View>
            {/* 확인 버튼 */}
            <TouchableOpacity
              style={styles.logoutConfirmBtn}
              onPress={onConfirm}
            >
              <Text style={styles.logoutConfirmText}>{confirmText}</Text>
            </TouchableOpacity>
            {/* 취소 텍스트 */}
            <TouchableOpacity
              style={styles.logoutCancelWrapper}
              onPress={onCancel}
            >
              <Text style={styles.logoutCancelText}>{cancelText}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // logout variant
  logoutWrapper: {
    width: 324,
    height: 194,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logoutHeaderBox: {
    width: 324,
    backgroundColor: Colors.palette.Gray700,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 40,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutHeaderText: {
    color: Colors.palette.white,
    fontFamily: 'Pretendard',
    fontSize: 16,
    letterSpacing: -0.48,
    textAlign: 'center',
  },
  logoutConfirmBtn: {
    width: 324,
    height: 50,
    backgroundColor: Colors.palette.point,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutConfirmText: {
    color: Colors.palette.white,
    ...Typography.subtitle3,
  },
  logoutCancelWrapper: {
    marginTop: 25,
  },
  logoutCancelText: {
    ...Typography.subtitle3,
    color: Colors.palette.white,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
  },
  // withdraw variant
  withdrawWrapper: {
    width: 324,
    height: 251,
    alignItems: 'center',
  },
  withdrawHeaderBox: {
    width: 324,
    paddingHorizontal: 16,
    paddingVertical: 40,
    backgroundColor: Colors.palette.Gray700,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
  },
  withdrawHeaderText: {
    color: Colors.palette.Gray100,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '400' as any,
    letterSpacing: -0.48,
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
  },
});

export default ConfirmModal;
