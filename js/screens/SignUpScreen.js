/* @flow */

import React from 'react';
import { Keyboard, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import Colors from '../constants/Colors';
import Form from '../components/Form';
import PrimaryButton from '../components/PrimaryButton';
import I18n from '../i18n/i18n'
import Parse from 'parse/react-native'

const DEBUG = false;

export default class SignUpScreen extends React.Component {
  static route = {
    navigationBar: {
      title: I18n.t('signUp'),
    },
  };

  state = DEBUG
    ? {
      keyboardHeight: 0,
      firstName: 'Brent',
      lastName: 'Vatne',
      username: `brentvatne${new Date() - 0}`,
      email: `brentvatne+${new Date() - 0}@gmail.com`,
      password: 'pass123!!!1',
      passwordConfirmation: 'pass123!!!1',
      isLoading: false,
    }
    : {
      keyboardHeight: 0,
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      isLoading: false,
    };

  _isMounted: boolean;
  _keyboardDidShowSubscription: { remove: Function };
  _keyboardDidHideSubscription: { remove: Function };

  // componentWillReceiveProps(nextProps: Object) {
  //   if (nextProps.authTokens.idToken && !this.props.authTokens.isToken) {
  //     TextInput.State.blurTextInput(TextInput.State.currentlyFocusedField());
  //     this.props.navigation.dismissModal();
  //   }
  // }

  componentDidMount() {
    this._isMounted = true;

    this._keyboardDidShowSubscription = Keyboard.addListener(
      'keyboardDidShow',
      ({endCoordinates}) => {
        const keyboardHeight = endCoordinates.height;
        this.setState({keyboardHeight});
      }
    );

    this._keyboardDidHideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      this.setState({keyboardHeight: 0});
    });
  }

  componentWillUnmount() {
    this._isMounted = false;

    this._keyboardDidShowSubscription.remove();
    this._keyboardDidHideSubscription.remove();
  }

  render() {
    return (
      <ScrollView
        contentContainerStyle={{paddingTop: 20}}
        keyboardShouldPersistTaps="always"
        style={styles.container}>
        <Form>
          <Form.Input
            onChangeText={this._updateValue.bind(this, 'firstName')}
            onSubmitEditing={() => this._handleSubmitEditing('firstName')}
            value={this.state.firstName}
            autoFocus
            autoCorrect={false}
            autoCapitalize="words"
            keyboardType="default"
            label="First name"
            returnKeyType="next"
          />
          <Form.Input
            ref={view => {
              this._lastNameInput = view;
            }}
            onChangeText={this._updateValue.bind(this, 'lastName')}
            onSubmitEditing={() => this._handleSubmitEditing('lastName')}
            value={this.state.lastName}
            autoCorrect={false}
            autoCapitalize="words"
            keyboardType="default"
            label="Last name"
            returnKeyType="next"
          />
          <Form.Input
            ref={view => {
              this._usernameInput = view;
            }}
            onChangeText={this._updateValue.bind(this, 'username')}
            onSubmitEditing={() => this._handleSubmitEditing('username')}
            value={this.state.username}
            autoCorrect={false}
            autoCapitalize="none"
            keyboardType="default"
            label="Username"
            returnKeyType="next"
          />
          <Form.Input
            ref={view => {
              this._emailInput = view;
            }}
            onSubmitEditing={() => this._handleSubmitEditing('email')}
            onChangeText={this._updateValue.bind(this, 'email')}
            autoCorrect={false}
            autoCapitalize="none"
            value={this.state.email}
            keyboardType="email-address"
            label="E-mail address"
            returnKeyType="next"
          />
          <Form.Input
            ref={view => {
              this._passwordInput = view;
            }}
            onSubmitEditing={() => this._handleSubmitEditing('password')}
            onChangeText={this._updateValue.bind(this, 'password')}
            value={this.state.password}
            autoCorrect={false}
            autoCapitalize="none"
            label="Password"
            returnKeyType="next"
            secureTextEntry
          />
          <Form.Input
            ref={view => {
              this._passwordConfirmationInput = view;
            }}
            onSubmitEditing={() => this._handleSubmitEditing('passwordConfirmation')}
            onChangeText={this._updateValue.bind(this, 'passwordConfirmation')}
            value={this.state.passwordConfirmation}
            hideBottomBorder
            autoCorrect={false}
            autoCapitalize="none"
            label="Repeat your password"
            returnKeyType="done"
            secureTextEntry
          />
        </Form>

        <PrimaryButton
          style={{margin: 20}}
          onPress={this._handleSubmit}
          isLoading={this.state.isLoading}>
          Sign Up
        </PrimaryButton>

        <View style={{height: this.state.keyboardHeight}}/>
      </ScrollView>
    );
  }

  _lastNameInput: any;
  _usernameInput: any;
  _emailInput: any;
  _passwordInput: any;
  _passwordConfirmationInput: any;

  _handleSubmitEditing = (field: string) => {
    switch (field) {
      case 'firstName':
        this._lastNameInput.focus();
        break;
      case 'lastName':
        this._usernameInput.focus();
        break;
      case 'username':
        this._emailInput.focus();
        break;
      case 'email':
        this._passwordInput.focus();
        break;
      case 'password':
        this._passwordConfirmationInput.focus();
        break;
      case 'passwordConfirmation':
        this._handleSubmit();
        break;
    }
  };

  _updateValue = (key: string, value: string) => {
    this.setState({[key]: value});
  };

  _handleSubmit = async () => {
    let {isLoading} = this.state;

    if (isLoading) {
      return;
    }

    let user = new Parse.User();
    user.set("username", this.state.username);
    user.set("password", this.state.password);
    user.set("email", this.state.email);
    user.set("firstname", this.state.firstName);
    user.set("lastname", this.state.lastName);

    user.signUp().then(() => {
      this.props.navigation.dismissModal();
    }, function(val){
      console.log(val);
      // Do something when sign up failed.
    });

    this.setState({isLoading: true});
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.greyBackground,
  },
});
