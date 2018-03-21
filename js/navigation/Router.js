/* @flow */

import { createRouter } from '@expo/ex-navigation';

export default createRouter(
  () => ({
    home: () => require('../screens/HomeScreen').default,
    rootNavigation: () => require('./RootNavigation').default,
  }),
  { ignoreSerializableWarnings: true }
);
