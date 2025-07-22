import { RecommendedItem, RecommendingItem } from '@/components/testdata';
import { StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';

type RecShareModalProps = {
  visible: boolean;
  onClose: () => void;
  recData: RecommendedItem | RecommendingItem | undefined;
};

export default function RecShareModal({
  visible,
  onClose,
  recData,
}: RecShareModalProps) {
  if (!recData) return null;

  const isRecommended = 'senderNickname' in recData;

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      style={styles.modal}
      backdropOpacity={0.4}
    >
      <View style={styles.container}>
        {isRecommended && <Text style={styles.text}>To. me</Text>}
        <Text style={styles.text}> {recData.title}</Text>
        <Text style={styles.text}> {recData.artistName}</Text>
        <Text style={styles.text}> {recData.comment}</Text>
        <Text style={styles.text}>
          From. {isRecommended ? recData.senderNickname : 'me'}
        </Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    margin: 0,
  },
  container: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
});
