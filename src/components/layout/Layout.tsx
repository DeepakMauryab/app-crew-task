import React from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Platform,
  Image,
  Text,
  ViewStyle,
} from 'react-native';
import { KeyboardAvoidingView, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Metrics } from '../../theme/spacing';
import { Colors } from '../../theme/colors';
import { graphics } from '../../assets';
import Button, { Variant } from '../ui/Button';
import { useNavigation } from '@react-navigation/native';
import ff from '../../theme/fonts';
import Icon from './Icon';
import appString from '../../constants/strings';

interface LayoutProps {
  children: React.ReactNode;
  headerRight?: React.ReactNode;
  footer?: React.ReactNode;
  leftNode?: React.ReactNode;
  outSideNodes?: React.ReactNode;
  title?: string;
  scrollable?: boolean;
  showHeader?: React.ReactNode | boolean;
  showFooter?: boolean;
  scrollContainer?: ViewStyle;
  onRightPress?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  title,
  scrollable = true,
  showHeader = false,
  showFooter = false,
  scrollContainer,
  onRightPress,
  headerRight,
  footer,
  leftNode,
  outSideNodes,
}) => {
  const Container = scrollable ? ScrollView : View;
  return (
    <>
      <View style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          translucent
          backgroundColor="transparent"
        />

        {/* Static background layer — prevents flickering */}
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* Background effects */}
        <Image
          source={graphics.roundBlur1}
          style={[styles.bgImage, styles.bgTopLeft]}
          resizeMode="cover"
        />
        <Image
          source={graphics.roundBlur2}
          style={[styles.bgImage, styles.bgTopRight]}
          resizeMode="cover"
        />
        <Image
          source={graphics.roundBlur3}
          style={[styles.bgImage, styles.bgBottomLeft]}
          resizeMode="cover"
        />

        {/* Stable content wrapper — fixes flicker */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {showHeader && (
            <View style={styles.header}>
              {typeof showHeader === 'boolean' ? (
                <>
                  {!!leftNode && (
                    <View
                      style={{
                        position: 'absolute',
                        left: Metrics.s10,
                        paddingTop: Metrics.vs45,
                        paddingRight: Metrics.vs20,
                      }}
                    >
                      {leftNode}
                    </View>
                  )}

                  <Text style={styles.headerTitle}>{title}</Text>
                  {headerRight && (
                    <View
                      style={{
                        position: 'absolute',
                        right: 0,
                        paddingTop: Metrics.vs45,
                        paddingRight: Metrics.vs10,
                      }}
                    >
                      {onRightPress ? (
                        <Button variant={Variant.Ghost} onPress={onRightPress}>
                          {headerRight}
                        </Button>
                      ) : (
                        headerRight
                      )}
                    </View>
                  )}
                </>
              ) : (
                showHeader
              )}
            </View>
          )}

          <Container
            contentContainerStyle={{
              ...styles.scrollContainer,
              ...scrollContainer,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </Container>

          {showFooter && (
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                © {2025} {appString.appName}
              </Text>
            </View>
          )}
          {footer && footer}
        </KeyboardAvoidingView>
      </View>
      {outSideNodes && outSideNodes}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: Metrics.s20,
    paddingVertical: Metrics.vs20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Metrics.vs40,
    paddingHorizontal: Metrics.s20,
  },
  headerTitle: {
    fontSize: Metrics.s22,
    fontFamily: ff.Medium,
    color: Colors.grayDark,
  },
  footer: {
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  bgImage: {
    position: 'absolute',
    width: 300,
    height: 300,
    opacity: 0.8,
    zIndex: 0,
  },
  bgTopLeft: {
    top: 0,
    left: 0,
    transform: [{ translateX: -150 }, { translateY: -50 }],
  },
  bgTopRight: {
    top: 0,
    right: 0,
    transform: [{ translateX: 200 }, { translateY: 100 }],
  },
  bgBottomLeft: {
    bottom: 0,
    left: 0,
    transform: [{ translateY: 150 }],
  },
  footerText: {
    color: Colors.textPrimary,
    textAlign: 'center',
  },
});
