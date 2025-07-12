import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ModalPopupProps {
  visible: boolean;
  emoji: string;
  text: string;
  duration?: number;
  onClose?: () => void;
}

export default function ModalPopup({
  visible,
  emoji,
  text,
  duration,
  onClose,
}: ModalPopupProps) {
  useEffect(() => {
    if (visible && duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  if (!visible) return null;

  return (
    <View style={styles.modalBackground}>
      <View style={styles.modalContainer}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.commentText}>{text}</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#333',
    width: 324,
    height: 185,
  },
  emoji: {
    width: 292,
    height: 76,
    textAlign: 'center',
    color: '#333',
    fontFamily: 'Pretendard',
    fontSize: 76,
    lineHeight: 76,
    fontStyle: 'normal',
    fontWeight: '400',
    letterSpacing: -2.28,
    marginBottom: 10,
  },
  commentText: {
    width: 292,
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Pretendard',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '400',
    letterSpacing: -0.48,
  },
});
