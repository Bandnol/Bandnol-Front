import { Pressable, StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';

import type { FilterProps } from '@/app/(tabs)/post';
import Unchecked from '@/assets/icons/checkbox.svg';
import Checked from '@/assets/icons/checkbox-checked.svg';
import Quit from '@/assets/icons/size_m/quit.svg';
import { Typography } from '@/constants/typography';

export default function PostFilterModal({
  visible,
  onClose,
  mediaPostOnly,
  sortOrder,
  range,
  setMediaPostOnly,
  setSortOrder,
  setRange,
}: FilterProps) {
  return (
    <>
      <Modal
        isVisible={visible}
        onBackdropPress={onClose}
        style={styles.bottomModal}
        hasBackdrop={false}
        coverScreen={false}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
              필터
            </Text>
            <Pressable onPress={onClose}>
              <Quit />
            </Pressable>
          </View>
          <View style={[styles.filterSection, { gap: 10 }]}>
            <Text style={styles.label}>미디어 포스트만 보기</Text>

            <Pressable
              onPress={() => setMediaPostOnly(!mediaPostOnly)}
              style={{ paddingVertical: 5 }}
            >
              {mediaPostOnly ? (
                <Checked width={24} height={24} />
              ) : (
                <Unchecked width={24} height={24} />
              )}
            </Pressable>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.label}>정렬</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {['popular', 'latest'].map((type) => (
                <Pressable
                  key={type}
                  onPress={() => setSortOrder(type as 'popular' | 'latest')}
                  style={[
                    styles.button,
                    sortOrder === type && styles.selectedButton,
                  ]}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      sortOrder === type && styles.selectedButtonText,
                    ]}
                  >
                    {type === 'popular' ? '인기순' : '최신순'}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.label}>범위</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {['all', 'following', 'mutualFollowing'].map((type) => (
                <Pressable
                  key={type}
                  onPress={() =>
                    setRange(type as 'all' | 'following' | 'mutualFollowing')
                  }
                  style={[
                    styles.button,
                    range === type && styles.selectedButton,
                  ]}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      range === type && styles.selectedButtonText,
                    ]}
                  >
                    {type === 'all'
                      ? '전체'
                      : type === 'following'
                        ? '팔로잉'
                        : '맞팔로우'}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    display: 'flex',
    width: '100%',
    paddingVertical: 40,
    paddingHorizontal: 16,
    flexDirection: 'column',
    gap: 20,
    alignItems: 'flex-start',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#1F1F1F',
  },
  modalHeader: {
    flexDirection: 'row',
    //paddingTop: 20,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
    gap: 10,
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
  filterSection: {
    alignContent: 'flex-start',
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 20,
    alignItems: 'center',
  },
  label: {
    ...Typography.subtitle3,
    color: '#fff',
    fontWeight: '600',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#333',
    borderRadius: 20,
  },
  selectedButton: {
    backgroundColor: '#F4F4F4',
  },
  buttonText: {
    ...Typography.subtitle4,
    color: '#B3B3B3',
  },
  selectedButtonText: {
    ...Typography.subtitle4,
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
});
