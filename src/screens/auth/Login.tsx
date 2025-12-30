import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Layout } from '../../components/layout/Layout';
import { Colors } from '../../theme/colors';
import ff from '../../theme/fonts';
import { Metrics } from '../../theme/spacing';
import Button from '../../components/ui/Button';
import { ScreenComponentType } from '../../@types/navigation';
import { supabase } from '../../supabase/supabase';
import { TextInputField } from '../../components/ui/TextInputField';
import { useAppDispatch } from '../../store';
import { loginUser } from '../../store/slices/auth.slice';
import { CommonActions } from '@react-navigation/native';
import screenName from '../../constants/screens';

const Login: ScreenComponentType = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    response: '',
  });
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    opacity.setValue(0);
    translateY.setValue(20);
    scale.setValue(0.98);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isSignUp, opacity, translateY, scale]);

  const onEmailChange = useCallback((email: string) => {
    setFormData(prev => ({ ...prev, email }));
    setError(prev => ({ ...prev, email: '' }));
  }, []);

  const onPasswordChange = useCallback((password: string) => {
    setFormData(prev => ({ ...prev, password }));
    setError(prev => ({ ...prev, password: '' }));
  }, []);
  const onConfirmPasswordChange = useCallback((confirmPassword: string) => {
    setFormData(prev => ({ ...prev, confirmPassword }));
    setError(prev => ({ ...prev, confirmPassword: '' }));
  }, []);

  const validate = useCallback(() => {
    let valid = true;
    const errors = {
      email: '',
      password: '',
      confirmPassword: '',
      response: '',
    };

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Enter a valid email';
      valid = false;
    }

    if (!formData.password.trim()) {
      errors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      valid = false;
    }
    if (isSignUp) {
      if (formData.confirmPassword !== formData.password) {
        errors.confirmPassword =
          'Comfirm Password and Password must be at same';
        valid = false;
      }
    }

    setError(errors);
    return valid;
  }, [formData.email, formData.password, formData.confirmPassword]);

  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      setSuccess('');
    }, 5000);

    return () => clearTimeout(timer);
  }, [success]);

  const handleSubmit = useCallback(async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      let data = null;
      if (isSignUp) {
        data = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: 'myapp://login',
          },
        });
      } else {
        data = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
      }

      if (data.error) {
        setError(prev => ({
          ...prev,
          response: data.error.message || 'Something went wrong',
        }));
      } else {
        if (isSignUp) {
          setIsSignUp(false);
          // Show success
          setSuccess(
            'We’ve sent a verification link to your email. Check your inbox or spam folder.',
          );
        } else {
          setSuccess('Login successful');

          const session = data?.data?.session;
          const userData = data?.data?.user;

          if (session && userData?.email) {
            const user = {
              token: session.access_token,
              email: userData.email,
              id: userData.id,
              email_verified: !!userData.user_metadata?.email_verified,
            };
            dispatch(loginUser(user));
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: screenName.dashboard }], // target screen
              }),
            );
          }
        }
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
        });
      }
    } catch (e: any) {
      setError(prev => ({
        ...prev,
        response: e.message || 'Something went wrong',
      }));
    } finally {
      setLoading(false);
    }
  }, [validate, isSignUp, formData.email, formData.password]);

  const toggleAuthMode = useCallback(() => {
    setIsSignUp(prev => !prev);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
    });
    setError({
      email: '',
      password: '',
      confirmPassword: '',
      response: '',
    });
    setSuccess('');
  }, []);

  const animatedStyle = useMemo(
    () => ({
      opacity,
      transform: [{ translateY }, { scale }],
    }),
    [opacity, translateY, scale],
  );

  return (
    <Layout showHeader title={isSignUp ? 'Create Account' : 'Login'}>
      <Animated.View style={animatedStyle}>
        <TextInputField
          keyboardType="email-address"
          placeholder="Enter Email Address"
          value={formData.email}
          error={error.email}
          onChangeText={onEmailChange}
        />

        <TextInputField
          secureTextEntry
          placeholder="Enter Password"
          value={formData.password}
          error={error.password}
          onChangeText={onPasswordChange}
        />

        {isSignUp && (
          <TextInputField
            secureTextEntry
            placeholder="Enter Confirm Password"
            value={formData.confirmPassword}
            error={error.confirmPassword}
            onChangeText={onConfirmPasswordChange}
          />
        )}

        {error && <Text style={styles.errorText}>{error.response}</Text>}
        {success && <Text style={styles.successText}>{success}</Text>}

        <Button
          isLoading={loading}
          style={styles.button}
          onPress={handleSubmit}
        >
          {isSignUp ? 'Sign Up' : 'Login'}
        </Button>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {isSignUp ? 'Already have an account? ' : 'Don’t have an account? '}
        </Text>
        <Text style={styles.link} onPress={toggleAuthMode}>
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </Text>
      </View>
    </Layout>
  );
};

export default Login;
const styles = StyleSheet.create({
  button: {
    marginTop: Metrics.s20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Metrics.s25,
  },
  footerText: {
    fontFamily: ff.Regular,
    fontSize: Metrics.s14,
    color: Colors.textPrimary,
  },
  link: {
    fontFamily: ff.Medium,
    fontSize: Metrics.s14,
    color: Colors.primary,
  },
  errorText: {
    color: Colors.error,
    fontSize: Metrics.fs12,
    fontFamily: ff.Regular,
    marginLeft: Metrics.s5,
  },
  successText: {
    color: Colors.successDark,
    fontSize: Metrics.fs12,
    fontFamily: ff.Regular,
    marginLeft: Metrics.s5,
  },
});
