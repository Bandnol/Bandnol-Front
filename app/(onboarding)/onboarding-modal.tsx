import * as React from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Modal1Props = {
  onConfirm: () => void;
  onCancel: () => void;
};

const OnboardingModal = ({ onConfirm, onCancel }: Modal1Props) => {
  return (
    <SafeAreaView style={styles.modal}>
      <View style={styles.view}>
        <View style={styles.messageIcon}>
          <View style={styles.wrapper}>
            <Text style={styles.text}>
              {`현재까지 작성한 내용이 초기화되고\n처음 화면으로 돌아갑니다.`}
            </Text>
          </View>
          <TouchableOpacity style={styles.btn} onPress={onConfirm}>
            <Text style={[styles.text1, styles.textTypo]}>확인</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={onCancel}>
          <Text style={[styles.text2, styles.textTypo]}>취소</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
  },
  textTypo: {
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: -0.3,
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Pretendard',
  },
  text: {
    width: 292,
    fontSize: 16,
    letterSpacing: -0.5,
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Pretendard',
  },
  wrapper: {
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
    elevation: 1,
    shadowOpacity: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 40,
    alignItems: 'center',
  },
  text1: {
    textAlign: 'left',
  },
  btn: {
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    backgroundColor: '#fb4932',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageIcon: {
    alignSelf: 'stretch',
  },
  text2: {
    textDecorationLine: 'underline',
    textAlign: 'center',
    alignSelf: 'stretch',
  },
  view: {
    width: '100%',
    gap: 25,
    alignItems: 'center',
    flex: 1,
  },
});

export default OnboardingModal;
