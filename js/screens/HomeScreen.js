import React from "react";
import {Platform, Text} from "react-native";

export default class HomeScreen extends React.Component {

  static route = {
    navigationBar: {
      title: 'Projects',
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