import { ParamListBase } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ComponentType } from 'react';

export interface IScreen<RouteName extends keyof ParamListBase = string> {
  id: number;
  name: RouteName;
  screen: ComponentType<NativeStackScreenProps<ParamListBase, RouteName>>;
  icon?: string;
  iconFocused?: string;
}

export type ScreenComponentType<
  RouteName extends keyof ParamListBase = string,
> = React.FC<NativeStackScreenProps<ParamListBase, RouteName>>;
