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
import { StyleSheet, TextInput, View, Keyboard, StatusBar, Platform } from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import { Garden } from 'react-native-navigation-hybrid';

import AV from 'leancloud-storage';
import DeviceInfo from 'react-native-device-info';
import ToastUtil from '../../utils/ToastUtil';
import fontUri from '../../utils/FontUtil';

let feedbackText;

class Feedback extends React.Component {
  static navigationItem = {

    titleItem: {
      title: '建议'
    },

    rightBarButtonItem: {
      icon: { uri: fontUri('Ionicons', 'md-checkmark', 24) },
      action: (navigation) => {
        const { params } = navigation.state;
        params.onActionSelected();
      },
    },

    tabItem: {
      title: '建议',
      icon: { uri: fontUri('Ionicons', 'md-thumbs-up', 24) },
      hideTabBarWhenPush: true,
    },
  };

  constructor(props) {
    super(props);
    this.onActionSelected = this.onActionSelected.bind(this);
    this.props.navigation.setParams({ onActionSelected: this.onActionSelected });
  }

  componentDidMount() {
    feedbackText = '';
  }

  onActionSelected = () => {
    if (feedbackText === undefined || feedbackText.replace(/\s+/g, '') === '') {
      ToastUtil.showShort('请填写建议内容哦~');
    } else {
      const feedback = AV.Object.new('Feedback');
      feedback.set('manufacturer', DeviceInfo.getManufacturer());
      feedback.set('system', DeviceInfo.getSystemName());
      feedback.set('deviceVersion', DeviceInfo.getSystemVersion());
      feedback.set('deviceModel', DeviceInfo.getModel());
      feedback.set('appVersion', DeviceInfo.getVersion());
      feedback.set('feedback', feedbackText);
      feedback.save();
      ToastUtil.showShort('您的问题已反馈，我们会及时跟进处理');
      this.textInput.clear();
      Keyboard.dismiss();
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          ref={(ref) => {
            this.textInput = ref;
          }}
          style={styles.textInput}
          placeholder="请写下您宝贵的意见或建议，与iReading一起进步！"
          placeholderTextColor="#aaaaaa"
          underlineColorAndroid="transparent"
          numberOfLines={200}
          multiline
          autoFocus
          onChangeText={(text) => {
            feedbackText = text;
          }}
        />
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
  textInput: {
    flex: 1,
    fontSize: 18,
    padding: 15,
    textAlignVertical: 'top'
  }
});

export default Feedback;
