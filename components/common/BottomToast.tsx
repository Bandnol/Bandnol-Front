import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

type BottomToastProps = {
  visible: boolean;
  message: string;
  duration?: number;
  onRequestClose?: () => void;
  onHidden?: () => void;
  containerStyle?: ViewStyle;
  leftIcon?: React.ReactNode;
  bottomOffset?: number;
};

export default function BottomToast({
  visible,
  message,
  duration = 1500,
  onRequestClose,
  onHidden,
  containerStyle,
  leftIcon,
  bottomOffset = 84,
}: BottomToastProps) {
  const translateY = useRef(new Animated.Value(80)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 180,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 160,
          useNativeDriver: true,
        }),
      ]).start();

      if (duration > 0) {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          onRequestClose?.();
        }, duration);
      }
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 80,
          duration: 180,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 160,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) onHidden?.();
      });
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible, duration, onRequestClose, onHidden, translateY, opacity]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.toastWrap,
        containerStyle,
        { bottom: bottomOffset, transform: [{ translateY }], opacity },
      ]}
    >
      <View style={styles.toast}>
        <View style={styles.row}>
          {leftIcon ? <View style={styles.iconBox}>{leftIcon}</View> : null}
          <Text style={styles.toastText}>{message}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toastWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 20,
    alignItems: 'center',
  },
  toast: {
    backgroundColor: '#333',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
    maxWidth: '92%',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { marginRight: 8 },
  toastText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
