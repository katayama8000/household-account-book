import React from "react";
import type { FC, ReactNode } from "react";
import { Dimensions, StyleSheet, type ViewStyle, Alert } from "react-native";
import {
  PanGestureHandler,
  type PanGestureHandlerGestureEvent,
  type PanGestureHandlerProps,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

interface Props extends Pick<PanGestureHandlerProps, "simultaneousHandlers"> {
  children: ReactNode;
  backView?: ReactNode;
  onPress?: () => void;
  onSwipeLeft?: () => void;
  style?: ViewStyle;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = -SCREEN_WIDTH * 0.2;

export const SwiperView: FC<Props> = ({ children, backView, onPress, onSwipeLeft, simultaneousHandlers, style }) => {
  const translateX = useSharedValue(0);

  const handleSwipeLeft = () => {
    Alert.alert(
      "削除確認",
      "このアイテムを削除してもよろしいですか？",
      [
        {
          text: "いいえ",
          onPress: () => {
            translateX.value = withTiming(0);
          },
          style: "cancel",
        },
        {
          text: "はい",
          onPress: () => onSwipeLeft?.(),
        },
      ],
      { cancelable: false },
    );
  };

  const panGesture = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onActive: (event) => {
      translateX.value = Math.max(-128, Math.min(0, event.translationX));
    },
    onEnd: () => {
      const shouldBeDismissed = translateX.value < SWIPE_THRESHOLD;
      if (shouldBeDismissed) {
        translateX.value = withTiming(-SCREEN_WIDTH);
        runOnJS(handleSwipeLeft)();
      } else {
        translateX.value = withTiming(0);
      }
    },
  });

  const facadeStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
    ],
  }));

  return (
    <Animated.View style={[styles.container, style]} onTouchEnd={() => onPress?.()}>
      {backView && <Animated.View style={styles.backView}>{backView}</Animated.View>}
      <PanGestureHandler simultaneousHandlers={simultaneousHandlers} onGestureEvent={panGesture}>
        <Animated.View style={[styles.content, facadeStyle]}>{children}</Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  backView: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    width: "100%",
  },
});
