/* @flow */

import { createRouter } from '@expo/ex-navigation';

export default createRouter(
  () => ({
    home: () => require('../screens/HomeScreen').default,
    profile: () => require('../screens/ProfileScreen').default,
    signIn: () => require('../screens/SignInScreen').default,
    signUp: () => require('../screens/SignUpScreen').default,
    modal: () => require('../screens/ModalScreen').default,
    rootNavigation: () => require('./RootNavigation').default,
  }),
  { ignoreSerializableWarnings: true }
);
