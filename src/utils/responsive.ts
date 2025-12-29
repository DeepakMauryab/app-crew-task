import {Dimensions, PixelRatio} from 'react-native';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

// Reference screen dimensions (based on iPhone 13)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

/**
 * Scale horizontally based on screen width
 */
export const scale = (size: number): number =>
  (SCREEN_WIDTH / BASE_WIDTH) * size;

/**
 * Scale vertically based on screen height
 */
export const verticalScale = (size: number): number =>
  (SCREEN_HEIGHT / BASE_HEIGHT) * size;

/**
 * Moderate scale (balanced scaling, great for margins/paddings)
 */
export const moderateScale = (size: number, factor: number = 0.5): number =>
  size + (scale(size) - size) * factor;

/**
 * Normalize text size (IGNORE system font scaling)
 */
export const normalize = (size: number): number => {
  const newSize = moderateScale(size);
  const fontScale = PixelRatio.getFontScale(); // User font scale (1.0 = default)
  return Math.round(PixelRatio.roundToNearestPixel(newSize / fontScale));
};
