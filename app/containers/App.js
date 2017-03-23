// @flow
import React, { Component } from 'react';
import type { Children } from 'react';
import { View } from 'react-desktop/macOs';

export default class App extends Component {
  props: {
    children: Children
  };

  render() {
    return (
      <View>
        {this.props.children}
      </View>
    );
  }
}
