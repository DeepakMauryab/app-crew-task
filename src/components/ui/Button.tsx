import React, {useRef} from 'react';
import {
  ActivityIndicator,
  TouchableWithoutFeedback,
  Animated,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {Metrics} from '../../theme/spacing';
import ff from '../../theme/fonts';
import {Colors} from '../../theme/colors';

export enum Variant {
  Btn = 'Btn',
  Link = 'Link',
  Secondary = 'Secondary',
  Ghost = 'Ghost',
  Outlined = 'Outlined',
}

export interface IButton {
  children?: React.ReactNode;
  isLoading?: boolean;
  variant?: Variant;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  loaderColor?: string;
  title?: string;
  loadingText?: string;
  noText?: boolean;
}

const Button: React.FC<IButton> = ({
  children,
  isLoading = false,
  variant = Variant.Btn,
  onPress,
  disabled = false,
  style,
  textStyle,
  loaderColor = '#fff',
  noText = false,
  loadingText = 'Processing...',
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 20,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 4,
    }).start();
  };

  const variantStyles = {
    [Variant.Btn]: {
      backgroundColor: Colors.primary,
      color: Colors.white,
      paddingVertical: Metrics.s10,
      paddingHorizontal: Metrics.vs16,
      // ...(disabled
      //   ? {} // no shadow
      //   : {
      //       shadowColor: Colors.primary,
      //       shadowOffset: {width: 0, height: Metrics.s10},
      //       shadowOpacity: 1,
      //       shadowRadius: Metrics.s16,
      //       elevation: 8,
      //     }),
    },
    [Variant.Link]: {
      backgroundColor: 'transparent',
      color: Colors.primary,
    },
    [Variant.Secondary]: {
      backgroundColor: '#f3f4f6',
      color: Colors.textPrimary,
    },
    [Variant.Ghost]: {
      backgroundColor: 'transparent',
      color: Colors.textPrimary,
      paddingVertical: 0,
      paddingHorizontal: 0,
    },
    [Variant.Outlined]: {
      backgroundColor: 'transparent',
      color: Colors.primary,
      borderWidth: 1,
      borderColor: Colors.primary,
    },
  }[variant];

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || isLoading}>
      <Animated.View
        style={[
          buttonStyle.button,
          {
            transform: [{scale}],
            opacity: disabled || isLoading ? 0.6 : 1,
          },
          variantStyles,
          style,
        ]}>
        {isLoading && (
          <ActivityIndicator
            color={loaderColor}
            style={{marginRight: noText ? 0 : 8}}
          />
        )}

        {!noText &&
          (typeof children === 'string' || typeof children === 'number' ? (
            <Text
              style={[
                buttonStyle.text,
                {color: variantStyles.color},
                textStyle,
              ]}>
              {isLoading ? loadingText : children}
            </Text>
          ) : isLoading ? (
            <Text
              style={[
                buttonStyle.text,
                {color: variantStyles.color},
                textStyle,
              ]}>
              {loadingText}
            </Text>
          ) : (
            children
          ))}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export const buttonStyle = StyleSheet.create({
  button: {
    borderRadius: Metrics.s10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: ff.Medium,
    fontSize: Metrics.fs16,
  },
});

export default Button;
