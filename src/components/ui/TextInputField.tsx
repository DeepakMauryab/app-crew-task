import React from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TextInputProps,
} from 'react-native';
import { scale, verticalScale } from '../../utils/responsive';
import { Colors } from '../../theme/colors';
import ff from '../../theme/fonts';

interface TextInputFieldProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'phone-pad' | 'numeric' | 'email-address';
  maxLength?: number;
  error?: string;
}

export const TextInputField: React.FC<TextInputFieldProps> = ({
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  maxLength,
  error,
  ...props
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textPrimary}
        keyboardType={keyboardType}
        maxLength={maxLength}
        selectionColor={Colors.primary}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: verticalScale(10),
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    fontSize: scale(16),
    fontFamily: ff.Medium,
    color: Colors.textPrimary,
    paddingVertical: verticalScale(15),
    paddingHorizontal: scale(20),
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: scale(12),
    fontFamily: ff.Regular,
    marginTop: verticalScale(5),
    marginLeft: scale(5),
  },
});
