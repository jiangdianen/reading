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
import {
  StyleSheet,
  WebView,
  BackHandler,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Modal,
  StatusBar,
  Platform
} from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import { Garden } from 'react-native-navigation-hybrid';

import * as WeChat from 'react-native-wechat';
import ToastUtil from '../../utils/ToastUtil';
import LoadingView from '../../components/LoadingView';
import { formatStringWithHtml } from '../../utils/FormatUtil';
import fontUri from '../../utils/FontUtil';

let canGoBack = false;
const shareIconWechat = require('../../img/share_icon_wechat.png');
const shareIconMoments = require('../../img/share_icon_moments.png');

class WebViewPage extends React.Component {
  static navigationItem = {
    titleItem: {
      title: '标题会传过来的'
    },

    rightBarButtonItem: {
      icon: { uri: fontUri('Ionicons', 'md-share', 24) },
      action: (navigation) => {
        const { params } = navigation.state;
        params.onActionSelected();
      },
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      isShareModal: false
    };
    this.props.navigation.setParams({ onActionSelected: this.onActionSelected });
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.goBack);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.goBack);
  }

  onActionSelected = () => {
    this.setState({
      isShareModal: true
    });
  };

  onNavigationStateChange = (navState) => {
    canGoBack = navState.canGoBack;
  };

  goBack = () => {
    if (this.state.isShareModal) {
      this.setState({
        isShareModal: false
      });
      return true;
    } else if (canGoBack) {
      this.webview.goBack();
      return true;
    }
    return false;
  };

  renderLoading = () => <LoadingView />;

  renderSpinner = () => {
    const { article } = this.props;
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.setState({
            isShareModal: false
          });
        }}
      >
        <View key="spinner" style={styles.spinner}>
          <View style={styles.spinnerContent}>
            <Text
              style={[styles.spinnerTitle, { fontSize: 20, color: 'black' }]}
            >
              分享到
            </Text>
            <View style={styles.shareParent}>
              <TouchableOpacity
                style={styles.base}
                onPress={() => {
                  WeChat.isWXAppInstalled().then((isInstalled) => {
                    if (isInstalled) {
                      WeChat.shareToSession({
                        title: formatStringWithHtml(article.title),
                        description: '分享自：iReading',
                        thumbImage: article.contentImg,
                        type: 'news',
                        webpageUrl: article.url
                      }).catch((error) => {
                        ToastUtil.showShort(error.message, true);
                      });
                    } else {
                      ToastUtil.showShort('没有安装微信软件，请您安装微信之后再试', true);
                    }
                  });
                }}
              >
                <View style={styles.shareContent}>
                  <Image style={styles.shareIcon} source={shareIconWechat} />
                  <Text style={styles.spinnerTitle}>微信</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.base}
                onPress={() => {
                  WeChat.isWXAppInstalled().then((isInstalled) => {
                    if (isInstalled) {
                      WeChat.shareToTimeline({
                        title: formatStringWithHtml(`[@iReading]${article.title}`),
                        thumbImage: article.contentImg,
                        type: 'news',
                        webpageUrl: article.url
                      }).catch((error) => {
                        ToastUtil.showShort(error.message, true);
                      });
                    } else {
                      ToastUtil.showShort('没有安装微信软件，请您安装微信之后再试', true);
                    }
                  });
                }}
              >
                <View style={styles.shareContent}>
                  <Image style={styles.shareIcon} source={shareIconMoments} />
                  <Text style={styles.spinnerTitle}>朋友圈</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  render() {
    const { article } = this.props;
    return (
      <View style={styles.container}>
        <Modal
          animationType="fade"
          visible={this.state.isShareModal}
          transparent
          onRequestClose={() => {
            this.setState({
              isShareModal: false
            });
          }}
        >
          {this.renderSpinner()}
        </Modal>
        <WebView
          ref={(ref) => {
            this.webview = ref;
          }}
          style={styles.base}
          source={{ uri: article.url }}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          scalesPageToFit
          decelerationRate="normal"
          onShouldStartLoadWithRequest={() => {
            const shouldStartLoad = true;
            return shouldStartLoad;
          }}
          onNavigationStateChange={this.onNavigationStateChange}
          renderLoading={this.renderLoading}
        />
      </View>
    );
  }
}

function ifLollipop(obj1 = {}, obj2 = {}) {
  return Platform.Version > 20 ? obj1 : obj2;
}

const styles = StyleSheet.create({
  base: {
    flex: 1
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFF',
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
  spinner: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)'
  },
  spinnerContent: {
    justifyContent: 'center',
    width: Dimensions.get('window').width * (7 / 10),
    height: Dimensions.get('window').width * (7 / 10) * 0.68,
    backgroundColor: '#fcfcfc',
    padding: 20,
    borderRadius: 5
  },
  spinnerTitle: {
    fontSize: 18,
    color: '#313131',
    textAlign: 'center',
    marginTop: 5
  },
  shareParent: {
    flexDirection: 'row',
    marginTop: 20
  },
  shareContent: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  shareIcon: {
    width: 40,
    height: 40
  }
});

export default WebViewPage;
