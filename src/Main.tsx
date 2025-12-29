import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import Routes from './navigation/Routes';
import { Colors } from './theme/colors';
import { Provider } from 'react-redux';
import { persistor, store } from './store';
import { PersistGate } from 'redux-persist/integration/react';
import { useEffect } from 'react';
import { Linking } from 'react-native';

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
  useEffect(() => {
    const sub = Linking.addEventListener('url', ({ url }) => {
      console.log('Deep link opened:', url);
    });

    return () => sub.remove();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer theme={MyTheme} linking={linking}>
          <Routes />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default Main;
