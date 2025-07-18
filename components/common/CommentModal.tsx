import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Typography } from '@/constants/tyopography';

type CommentModalProps = {
  visible: boolean;
  onClose: () => void;
  closeText?: string;
  closeColor?: string;
  title: string;
  description: string;
};

export default function CommentModal({
  visible,
  onClose,
  title,
  description,
  closeText,
  closeColor,
}: CommentModalProps) {
  const isReply = closeText === '답장 보내기';

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.commentContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <View style={[styles.buttonContainer, { backgroundColor: closeColor }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text
              style={[
                styles.closeButtonText,
                {
                  color: isReply ? '#FFFFFF' : '#B3B3B3',
                },
              ]}
            >
              {closeText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    width: 375,
    height: 812,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentContainer: {
    height: 278,
    width: 335,
    display: 'flex',
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#333',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    // alignSelf: 'stretch',
  },
  title: {
    color: '#FFF',
    ...Typography.subtitle1B,
  },
  description: {
    width: 266,
    height: 108,
    color: '#FFF',
    ...Typography.body2,
    textAlign: 'left',
    marginTop: 20,
  },
  buttonContainer: {
    height: 50,
    width: 335,
    // backgroundColor: '#1F1F1F',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  closeButton: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  closeButtonText: {
    ...Typography.subtitle3,
  },
});
