import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Frame from '../assets/onboarding/star_gray.svg';
import Ellipse from '../assets/onboarding/Ellipse 1.svg';

const Group1 = () => {
  return (
    <SafeAreaView style={styles.parent}>
      <View style={styles.view}>
        <Ellipse style={[styles.child, styles.itemLayout]} />
        <Frame style={[styles.item, styles.itemLayout]} />
        <Text style={styles.text}>가수명</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  itemLayout: {
    maxHeight: '100%',
    overflow: 'hidden',
    maxWidth: '100%',
    position: 'absolute',
  },
  child: {
    height: '68%',
    width: '94.44%',
    top: '0%',
    right: '2.78%',
    bottom: '32%',
    left: '2.78%',
    zIndex: 1,
  },
  item: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    zIndex: 10,
  },
  text: {
    top: '80%',
    left: '0%',
    fontSize: 14,
    letterSpacing: -0.3,
    lineHeight: 20,
    fontFamily: 'Pretendard',
    color: '#fff',
    textAlign: 'center',
    position: 'absolute',
    width: '100%',
    zIndex: 1,
  },
  view: {
    height: 100,
    width: '100%',
    flex: 1,
  },
});

export default Group1;
