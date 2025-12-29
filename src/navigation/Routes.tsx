import { createNativeStackNavigator } from '@react-navigation/native-stack';
import screenName from '../constants/screens';
import { IScreen } from '../@types/navigation';
import { StackAnimationTypes } from 'react-native-screens';
import Login from '../screens/auth/Login';
import Notes from '../screens/Notes';
import { useAppSelector } from '../store';

const Stack = createNativeStackNavigator();

const screens: (IScreen & { animation: StackAnimationTypes })[] = [
  {
    id: 1,
    name: screenName.login,
    screen: Login,
    animation: 'slide_from_bottom',
  },
  {
    id: 1,
    name: screenName.dashboard,
    screen: Notes,
    animation: 'slide_from_bottom',
  },
];

const StackNavigator = () => {
  const { isAuthenticated } = useAppSelector(s => s.auth);

  return (
    <Stack.Navigator
      initialRouteName={
        isAuthenticated ? screenName.dashboard : screenName.login
      }
      screenOptions={{
        headerShown: false,
      }}
    >
      {screens.map(item => (
        <Stack.Screen
          name={item.name}
          component={item.screen}
          key={item.id}
          options={{
            animation: item.animation,
          }}
        />
      ))}
    </Stack.Navigator>
  );
};

export default StackNavigator;
