import React, { useEffect, useRef, useCallback } from 'react';
import {
  Animated,
  BackHandler,
  Dimensions,
  PanResponder,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Metrics } from '../../theme/spacing';
import { Colors } from '../../theme/colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BottomSheetProps {
  visible: boolean;
  disabled?: boolean;
  onClose: () => void;
  children: React.ReactNode;
  openHeight?: number;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  children,
  openHeight = 0.5,
  disabled = false,
}) => {
  const SHEET_HEIGHT = SCREEN_HEIGHT;

  const SNAP_POINTS = {
    FULL: 0,
    HALF: SHEET_HEIGHT * (1 - openHeight),
    CLOSED: SHEET_HEIGHT,
  };

  const translateY = useRef(new Animated.Value(SNAP_POINTS.CLOSED)).current;
  const lastOffset = useRef(SNAP_POINTS.CLOSED);

  const animateTo = (toValue: number) => {
    Animated.spring(translateY, {
      toValue,
      useNativeDriver: true,
      friction: 8,
    }).start(() => {
      lastOffset.current = toValue;
    });
  };

  const showHalf = useCallback(() => animateTo(SNAP_POINTS.HALF), []);
  const showFull = useCallback(() => animateTo(SNAP_POINTS.FULL), []);
  const hideSheet = useCallback(() => {
    Animated.timing(translateY, {
      toValue: SNAP_POINTS.CLOSED,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      lastOffset.current = SNAP_POINTS.CLOSED;
      onClose();
    });
  }, [onClose]);

  useEffect(() => {
    if (!visible) return;

    const onBackPress = () => {
      if (lastOffset.current !== SNAP_POINTS.CLOSED) {
        hideSheet();
        return true;
      }
      return false;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [visible, hideSheet]);

  useEffect(() => {
    if (visible) {
      showHalf();
    }
  }, [visible, showHalf]);

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 5,
      onPanResponderMove: (_, g) => {
        const newY = Math.min(
          Math.max(SNAP_POINTS.FULL, lastOffset.current + g.dy),
          SNAP_POINTS.CLOSED,
        );
        translateY.setValue(newY);
      },
      onPanResponderRelease: (_, g) => {
        const threshold = SCREEN_HEIGHT / 6;
        const dragDown = g.dy > threshold || g.vy > 0.6;
        const dragUp = g.dy < -threshold || g.vy < -0.6;

        if (dragDown) {
          if (lastOffset.current === SNAP_POINTS.FULL) {
            showHalf();
          } else {
            hideSheet();
          }
        } else if (dragUp) {
          showFull();
        } else {
          animateTo(lastOffset.current);
        }
      },
    }),
  ).current;

  return (
    <View style={styles.wrapper} pointerEvents={visible ? 'auto' : 'none'}>
      {visible && (
        <TouchableWithoutFeedback onPress={hideSheet}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      <Animated.View
        {...(!disabled ? pan.panHandlers : {})}
        style={[
          styles.sheet,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        {!disabled && <View style={styles.handle} />}
        <View style={styles.content}>{children}</View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-end',
    zIndex: 99999,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Colors.overlay ?? 'rgba(0,0,0,0.4)',
  },
  sheet: {
    position: 'absolute',
    height: SCREEN_HEIGHT,
    width: '100%',
    backgroundColor: Colors.white ?? '#fff',
    borderTopLeftRadius: Metrics.r20,
    borderTopRightRadius: Metrics.r20,
    overflow: 'hidden',
  },
  handle: {
    width: Metrics.s60,
    height: Metrics.vs6,
    borderRadius: Metrics.r3,
    backgroundColor: Colors.gray300 ?? '#ccc',
    alignSelf: 'center',
    marginVertical: Metrics.vs10,
  },
  content: {
    flex: 1,
    paddingHorizontal: Metrics.s20,
  },
});

export default BottomSheet;
