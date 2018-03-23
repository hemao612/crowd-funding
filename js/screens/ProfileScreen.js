import React from "react";
import {Platform, Text} from "react-native";

export default class ProfileScreen extends React.Component {

  static route = {
    navigationBar: {
      title: 'Profile',
      ...Platform.select({
        ios: {
        },
      }),
    },
  };

  render() {
    return <Text>This Profile Screen</Text>
  }
}