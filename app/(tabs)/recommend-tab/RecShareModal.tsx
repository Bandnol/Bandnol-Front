import { RecommendedItem, RecommendingItem } from '@/components/testdata';
import { Typography } from '@/constants/typography';
//import MaskedView from '@react-native-masked-view/masked-view';
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
        {/* <MaskedView
          style={styles.maskedView}
          maskElement={
            <Svg width="179" height="157" viewBox="0 0 179 157">
              <Path
                d="M147.353 0C166.128 16.2275 178.038 40.1926 178.115 66.957C178.256 116.002 138.611 155.875 89.5658 156.017C40.5205 156.158 0.64642 116.513 0.505258 67.4678C0.427745 40.5194 12.3628 16.3408 31.268 0H147.353Z"
                fill="black"
              />
            </Svg>
          }
        >
          <Image
            source={{ uri: recData.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        </MaskedView> */}
        {isRecommended && (
          <Text style={styles.toText}>
            To. <Text style={{ color: '#F4F4F4' }}>me</Text>
          </Text>
        )}
        <Text style={styles.titleText}> {recData.title}</Text>
        <Text style={styles.artistText}> {recData.artistName}</Text>
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

      <View style={styles.buttonGroup}>
        <View style={styles.shareButton}>
          {/* <Image
            source={require('@/assets/icons/instagram.png')}
            style={styles.shareIcon}
          /> */}
          <Text style={styles.shareText}>인스타그램으로 공유</Text>
        </View>
        <View style={styles.shareButton}>
          {/* <Image
            source={require('@/assets/icons/x.png')}
            style={styles.shareIcon}
          /> */}
          <Text style={styles.shareText}>X로 공유</Text>
        </View>
        <View style={styles.shareButton}>
          {/* <Image
            source={require('@/assets/icons/link.png')}
            style={styles.shareIcon}
          /> */}
          <Text style={styles.shareText}>링크 복사</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    margin: 0,
    width: '90%',
    alignSelf: 'center',
  },
  container: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    //gap: 8,
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
  maskedView: {
    width: 179,
    height: 157,
    overflow: 'hidden',
  },
  image: {
    width: 179,
    height: 157,
  },
  toText: {
    ...Typography.subtitle4,
    color: '#D9D9D9',
    marginTop: 19,
    marginBottom: 21,
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
    fontWeight: '400',
    marginBottom: 11,
  },
  commentBox: {
    width: '100%',
    height: 86,
    marginBottom: 11,
    justifyContent: 'center',
    alignItems: 'center',
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
    //스타일링 아직안함
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    width: '100%',
    paddingHorizontal: 12,
    gap: 12,
  },

  shareButton: {
    width: 58,
    height: 58,
    backgroundColor: '#333',
    borderRadius: 29,
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },

  shareIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },

  shareText: {
    color: '#fff',
    fontSize: 12,
  },
});
