import {
  createNavigationContainerRef,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import Routes from './navigation/Routes';
import { Colors } from './theme/colors';

import { useEffect } from 'react';
import { Linking } from 'react-native';
import { supabase } from './supabase/supabase';
import { logoutUser } from './store/slices/auth.slice';
import screenName from './constants/screens';
import { useAppDispatch } from './store';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.screenBgColor,
  },
};

const linking = {
  prefixes: ['myapp://'],
  config: {
    screens: {
      Login: 'login',
    },
  },
};
const Main = () => {
  const navigationRef = createNavigationContainerRef();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const sub = Linking.addEventListener('url', ({ url }) => {
      console.log('Deep link opened:', url);
    });

    return () => sub.remove();
  }, []);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        dispatch(logoutUser());

        if (navigationRef.isReady()) {
          navigationRef.reset({
            index: 0,
            routes: [{ name: screenName.login }],
          });
        }
      }
    });

    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <NavigationContainer ref={navigationRef} theme={MyTheme} linking={linking}>
      <Routes />
    </NavigationContainer>
  );
};

export default Main;
