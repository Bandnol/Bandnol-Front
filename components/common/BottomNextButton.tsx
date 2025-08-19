// components/common/BottomNextButton.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '@/constants/Colors';
import { Typography } from '@/constants/typography';

type Props = {
  onPress: () => void;
  enabled?: boolean;
  text?: string;
};

export default function BottomNextButton({ onPress, enabled = true, text = "다음" }: Props) {
  return (
    <View style={styles.bottomView}>
      <TouchableOpacity
        style={[
          styles.btn,
          enabled && { backgroundColor: Colors.palette.point },
        ]}
        onPress={onPress}
        disabled={!enabled}
      >
        <Text
          style={[
            Typography.body2,
            {
              color: enabled ? Colors.palette.white : Colors.palette.Gray400,
            },
          ]}
        >
          {text}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export const styles = StyleSheet.create({
  btn: {
    backgroundColor: Colors.palette.Gray800,
    padding: 16,
    height: 50,
    width: '100%',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomView: {
    position: 'absolute',
    bottom: 16,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 1,
  },
});
