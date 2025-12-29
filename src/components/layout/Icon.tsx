import React from 'react';
import {TextStyle} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Foundation from 'react-native-vector-icons/Foundation';

type IconType =
  | 'Ionicons'
  | 'MaterialIcons'
  | 'FontAwesome'
  | 'FontAwesome5'
  | 'Entypo'
  | 'Feather'
  | 'AntDesign'
  | 'MaterialCommunityIcons'
  | 'Octicons'
  | 'SimpleLineIcons'
  | 'EvilIcons'
  | 'Foundation';

interface IconProps {
  type?: IconType;
  name: string;
  size?: number;
  color?: string;
  style?: TextStyle;
}

const Icon: React.FC<IconProps> = ({
  type = 'Ionicons',
  name,
  size = 24,
  color = '#000',
  style,
}) => {
  const IconComponent =
    {
      Ionicons,
      MaterialIcons,
      FontAwesome,
      FontAwesome5,
      Entypo,
      Feather,
      AntDesign,
      MaterialCommunityIcons,
      Octicons,
      SimpleLineIcons,
      EvilIcons,
      Foundation,
    }[type] || Ionicons;

  return <IconComponent name={name} size={size} color={color} style={style} />;
};

export default Icon;
