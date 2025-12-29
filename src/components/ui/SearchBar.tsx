import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  StyleProp,
} from 'react-native';
import Icon from '../layout/Icon';
import { Metrics } from '../../theme/spacing';
import { Colors } from '../../theme/colors';
import ff from '../../theme/fonts';
import appString from '../../constants/strings';

interface SearchInputProps extends TextInputProps {
  placeholder?: string;
  onChangeText?: (text: string) => void;
  value?: string;
  style?: StyleProp<ViewStyle>;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = appString.searchWithDot,
  onChangeText,
  value = '',
  style,
  ...rest
}) => {
  const [text, setText] = useState(value);
  const clearAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

  const handleChange = (val: string) => {
    setText(val);
    onChangeText?.(val);
    Animated.timing(clearAnim, {
      toValue: val ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handleClear = () => {
    setText('');
    onChangeText?.('');
    Animated.timing(clearAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={[styles.container, style]}>
      <Icon
        name="search-outline"
        size={Metrics.ms18}
        color={Colors.primary}
        style={styles.searchIcon}
      />
      <TextInput
        {...rest}
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={text}
        onChangeText={handleChange}
      />
      <Animated.View style={[styles.clearContainer, { opacity: clearAnim }]}>
        <TouchableOpacity onPress={handleClear}>
          <Icon
            name="close-circle"
            size={Metrics.ms16}
            color={Colors.primary}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Metrics.r50,
    paddingHorizontal: Metrics.s12,
    marginHorizontal: Metrics.s15,
    marginTop: Metrics.vs15,
  },
  searchIcon: {
    marginRight: Metrics.s10,
  },
  input: {
    flex: 1,
    fontSize: Metrics.fs12,
    color: Colors.textPrimary,
    paddingVertical: Metrics.vs7,
    fontFamily: ff.Regular,
  },
  clearContainer: {
    marginLeft: Metrics.s8,
  },
});

export default SearchInput;
