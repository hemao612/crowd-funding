/* @flow */
import React from 'react';
import {
  NativeModules,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  findNodeHandle,
  DeviceEventEmitter,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { withNavigation } from '@expo/ex-navigation';
import I18n from '../i18n/i18n'
import Parse from 'parse/react-native'

import ProfileUnauthenticated from '../components/ProfileUnauthenticated';
import Events from "../constants/Events";

export default class ProfileScreen extends React.Component {
  static route = {
    navigationBar: {
      title(params) {
        if (params.username) {
          return params.username;
        } else {
          return I18n.t('profile');
        }
      },
      ...Platform.select({
        ios: {
          renderRight: ({ params }) => {
            if (params.username) {
              return <OptionsButtonIOS />;
            } else {
              return <UserSettingsButtonIOS />;
            }
          },
        },
        android: {
          renderRight: ({ params }) => {
            if (params.username) {
              return <OptionsButtonAndroid />;
            } else {
              return <SignOutButtonAndroid />;
            }
          },
        },
      }),
    },
  };

  state = {
    currentUser: null,
    initialized: false,
  };

  componentWillMount() {
    Parse.User.currentAsync().then((user) => {
      this.setState({
          currentUser: user,
          initialized: true,
        }
      )
    });

    this.listner = DeviceEventEmitter.addListener(Events.LOGGED_IN, (user) => {
      this.setState({
        currentUser: user,
      })
    });

    this.listner = DeviceEventEmitter.addListener(Events.LOGGED_OUT, () => {
      Parse.User.logOut().then(() => {
        this.setState({
          currentUser: null,
        })
      });
    });
  }

  componentWillUnmount() {
    this.listner.remove();
  }

  render() {
    if (!this.state.initialized) {
      return <View/>;
    }

    if (this.state.currentUser === null) {
      return <ProfileUnauthenticated />;
    } else {
      return <View {...this.props}/>
    }
  }
}

class SignOutButtonAndroid extends React.Component {
  _anchor: View;

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          collapsable={false}
          ref={view => {
            this._anchor = view;
          }}
          style={{ position: 'absolute', top: 5, left: 0 }}
        />
        <TouchableOpacity style={styles.buttonContainer} onPress={this._handlePress}>
          <MaterialIcons name="more-vert" size={27} color="#4E9BDE" />
        </TouchableOpacity>
      </View>
    );
  }

  _handlePress = () => {
    let handle = findNodeHandle(this._anchor);
    NativeModules.UIManager.showPopupMenu(
      handle,
      [I18n.t('signOut')],
      () => {},
      (action, selectedIndex) => {
        if (selectedIndex === 0) {
          DeviceEventEmitter.emit(Events.LOGGED_OUT);
          // this.props.dispatch(AuthTokenActions.signOut());
          // this.props.dispatch(AuthTokenActions.clearAuthTokens());
          // this.props.dispatch(SessionActions.signOut());
        }
      }
    );
  };
}

class OptionsButtonAndroid extends React.Component {
  _anchor: View;

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          collapsable={false}
          ref={view => {
            this._anchor = view;
          }}
          style={{ position: 'absolute', top: 5, left: 0 }}
        />
        <TouchableOpacity style={styles.buttonContainer} onPress={this._handlePress}>
          <MaterialIcons name="more-vert" size={27} color="#4E9BDE" />
        </TouchableOpacity>
      </View>
    );
  }

  _handlePress = () => {
    // let handle = findNodeHandle(this._anchor);
    // NativeModules.UIManager.showPopupMenu(
    //   handle,
    //   ['Report this user'],
    //   () => {},
    //   (action, selectedIndex) => {
    //     if (selectedIndex === 0) {
    //       Alert.alert(
    //         'Thank you for your report',
    //         'We will investigate the case as soon as we can.'
    //       );
    //     }
    //   }
    // );
  };
}

@withNavigation
class UserSettingsButtonIOS extends React.Component {
  render() {
    return (
      <TouchableOpacity style={styles.buttonContainer} onPress={this._handlePress}>
        <Text style={{ fontSize: 16, color: '#4E9BDE' }}>Options</Text>
      </TouchableOpacity>
    );
  }

  _handlePress = () => {
    this.props.navigator.push('userSettings');
  };
}

class SignOutButtonIOS extends React.Component {
  render() {
    return (
      <TouchableOpacity style={styles.buttonContainer} onPress={this._handlePress}>
        <Text style={{ fontSize: 16, color: '#4E9BDE' }}>Sign Out</Text>
      </TouchableOpacity>
    );
  }

  _handlePress = () => {
    // this.props.dispatch(AuthTokenActions.signOut());
  };
}

class OptionsButtonIOS extends React.Component {
  render() {
    return (
      <TouchableOpacity style={styles.buttonContainer} onPress={this._handlePress}>
        <Ionicons name="ios-more" size={27} color="#4E9BDE" />
      </TouchableOpacity>
    );
  }

  _handlePress = () => {
    // let options = ['Report this user', 'Cancel'];
    // let cancelButtonIndex = 1;
    // this.props.showActionSheetWithOptions(
    //   {
    //     options,
    //     cancelButtonIndex,
    //   },
    //   async buttonIndex => {
    //     if (buttonIndex === 0) {
    //       Alert.alert(
    //         'Thank you for your report',
    //         'We will investigate the case as soon as we can.'
    //       );
    //     }
    //   }
    // );
  };
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 15,
  },
});