import {Dimensions} from 'react-native';
import {
  scale,
  verticalScale,
  moderateScale,
  normalize,
} from '../utils/responsive';

export const {width, height} = Dimensions.get('window');

/**
 * Generate numeric scale values (1–100)
 */
const numbers = Array.from({length: 300}, (_, i) => i + 1);

/**
 * Spacing object — provides horizontal (s), vertical (vs), and moderate (ms) spacing.
 * Example: Spacing.s8 → horizontal spacing; Spacing.vs12 → vertical spacing.
 */
export const Spacing = numbers.reduce((acc, num) => {
  acc[`s${num}`] = scale(num);
  acc[`vs${num}`] = verticalScale(num);
  acc[`ms${num}`] = moderateScale(num);
  return acc;
}, {} as Record<string, number>);

/**
 * Font sizes — normalized text scaling based on screen size.
 * Example: FontSize.fs14 → responsive font size.
 */
export const FontSize = numbers.reduce((acc, num) => {
  acc[`fs${num}`] = normalize(num);
  return acc;
}, {} as Record<string, number>);

/**
 * Radius — for consistent rounded corners.
 * Example: Radius.r8 → border radius.
 */
export const Radius = numbers.reduce((acc, num) => {
  acc[`r${num}`] = moderateScale(num);
  return acc;
}, {} as Record<string, number>);

/**
 * Complete metrics object for easy import
 */
export const Metrics = {
  ...Spacing,
  ...FontSize,
  ...Radius,
};
