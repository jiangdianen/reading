/**
 *
 * Copyright 2016-present reading
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import React from 'react';
import { StyleSheet, Image, Text, Linking, View, StatusBar, Platform } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import { Garden } from 'react-native-navigation-hybrid';

import DeviceInfo from 'react-native-device-info';
import Button from '../../components/Button';
import fontUri from '../../utils/FontUtil';

const SHOW_API = 'https://www.showapi.com';
const READING_REPO = 'https://github.com/attentiveness/reading';

const aboutLogo = require('../../img/about_logo.png');

class About extends React.Component {
  static navigationItem = {
    titleItem: {
      title: '关于'
    },

    rightBarButtonItem: {
      icon: { uri: fontUri('Ionicons', 'logo-github', 24) },
      action: () => {
        Linking.openURL(READING_REPO);
      },
    },

    tabItem: {
      title: '关于',
      icon: { uri: fontUri('Ionicons', 'md-information-circle', 24) },
      hideTabBarWhenPush: true,
    },

  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.center}>
            <Image style={styles.logo} source={aboutLogo} />
            <Text style={styles.version}>{`v${DeviceInfo.getVersion()}`}</Text>
            <Text style={styles.title}>iReading</Text>
            <Text style={styles.subtitle}>让生活更精彩</Text>
          </View>
          <View style={styles.bottomContainer}>
            <View style={styles.disclaimerContent}>
              <Text style={[styles.disclaimer, { color: '#999999' }]}>
                免责声明：所有内容均来自:
              </Text>
              <Button
                style={[styles.disclaimer, { color: '#3e9ce9' }]}
                text={SHOW_API}
                onPress={() => Linking.openURL(SHOW_API)}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

function ifLollipop(obj1 = {}, obj2 = {}) {
  return Platform.Version > 20 ? obj1 : obj2;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        ...ifIphoneX(
          {
            paddingTop: 88,
          },
          {
            paddingTop: 64,
          }
        ),
      },
      android: {
        ...ifLollipop(
          {
            paddingTop: StatusBar.currentHeight + Garden.toolbarHeight,
          },
          {
            paddingTop: Garden.toolbarHeight,
          }
        ),
      },
    }),
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 10
  },
  center: {
    flex: 1,
    alignItems: 'center'
  },
  logo: {
    width: 110,
    height: 110,
    marginTop: 50
  },
  version: {
    fontSize: 16,
    textAlign: 'center',
    color: '#aaaaaa',
    marginTop: 5
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    color: '#313131',
    marginTop: 10
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#4e4e4e'
  },
  disclaimerContent: {
    flexDirection: 'column'
  },
  disclaimer: {
    fontSize: 14,
    textAlign: 'center'
  },
  bottomContainer: {
    alignItems: 'center'
  }
});

export default About;
