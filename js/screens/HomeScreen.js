import React from "react";
import {Platform, Text} from "react-native";
import I18n from "../i18n/i18n";

export default class HomeScreen extends React.Component {

  static route = {
    navigationBar: {
      title: I18n.t('home'),
      ...Platform.select({
        ios: {
        },
      }),
    },
  };

  render() {
    return <Text>This Home Screen</Text>
  }
}