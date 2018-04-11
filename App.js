
import { AppLoading, Asset, Font } from 'expo';
import React from 'react';
import { Platform, StatusBar, StyleSheet, View, AsyncStorage } from 'react-native';
import { NavigationProvider, StackNavigation } from '@expo/ex-navigation';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Parse from 'parse/react-native';
import I18n from './js/i18n/i18n';

import customNavigationContext from './js/navigation/customNavigationContext';
import ParseConstants from "./js/parse/ParseConstants";

function cacheImages(images) {
  return images.map(image => Asset.fromModule(image).downloadAsync());
}

export default class App extends React.Component {
  state = {
    isReady: false,
  };

  componentDidMount() {
    this._initializeStateAsync().then();
  }

  _initializeStateAsync = async () => {
    try {
      if (Platform.OS === 'ios') {
        await Promise.all([Font.loadAsync(Ionicons.font)]);
      } else {
        await Promise.all([Font.loadAsync(Ionicons.font), Font.loadAsync(MaterialIcons.font)]);
      }

      // Init I18n
      await I18n.initAsync();

      await this._initializeParse();

    } catch (e) {
      // ..
    } finally {
      this.setState({ isReady: true });
    }
  };

  _initializeParse = async () => {
    Parse.setAsyncStorage(AsyncStorage);
    Parse.initialize(ParseConstants.appId);
    Parse.serverURL = ParseConstants.serverURL;
    Parse.User.enableUnsafeCurrentUser();
  };

  render() {
    if (!this.state.isReady) {
      return (<AppLoading />);
    }

    return (
      <View style={styles.container}>
        <ActionSheetProvider>
          <NavigationProvider context={customNavigationContext}>
            {this.state.isReady && <StackNavigation id="root" initialRoute="rootNavigation" />}
          </NavigationProvider>
        </ActionSheetProvider>

        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        {Platform.OS === 'android' && <View style={styles.statusBarUnderlay} />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.2)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});