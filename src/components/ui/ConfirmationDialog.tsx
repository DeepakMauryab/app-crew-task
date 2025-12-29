import { Text, View } from 'react-native';
import BottomSheet from '../ui/BottomSheet';
import { Colors } from '../../theme/colors';
import { Metrics } from '../../theme/spacing';
import Button, { Variant } from '../ui/Button';
import appString from '../../constants/strings';
import ff from '../../theme/fonts';

const ConfirmationDialog = ({
  visible,
  title,
  onPositivePress,
  onNegetivePress,
  description,
  isLoading,
}: {
  visible: boolean;
  isLoading: boolean;
  title: string;
  description: string;
  onPositivePress: () => void;
  onNegetivePress?: () => void;
}) => {
  return (
    <BottomSheet
      onClose={() => onNegetivePress?.()}
      visible={visible}
      disabled
      openHeight={0.35}
    >
      <Text
        style={{
          fontSize: Metrics.fs16,
          fontFamily: ff.SemiBold,
          color: Colors.textPrimary,
          marginBottom: Metrics.vs10,
          textAlign: 'center',
          marginTop: Metrics.vs35,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: Metrics.fs14,
          fontFamily: ff.Medium,
          color: Colors.textPrimary,
          marginBottom: Metrics.vs5,
          marginTop: Metrics.vs10,
          textAlign: 'center',
        }}
      >
        {description}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: Colors.white,
          width: '100%',
          paddingVertical: Metrics.vs20,
        }}
      >
        <Button
          style={{ width: '45%' }}
          textStyle={{ fontSize: Metrics.fs13 }}
          variant={Variant.Secondary}
          onPress={onNegetivePress}
        >
          {appString.cancel}
        </Button>
        <Button
          isLoading={isLoading}
          style={{ width: '45%' }}
          onPress={onPositivePress}
          textStyle={{ fontSize: Metrics.fs13 }}
          variant={Variant.Btn}
        >
          {appString.submit}
        </Button>
      </View>
    </BottomSheet>
  );
};

export default ConfirmationDialog;
