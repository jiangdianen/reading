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
import PropTypes from 'prop-types';
import {
  InteractionManager,
  StyleSheet,
  Text,
  View,
  DeviceEventEmitter,
  ScrollView,
  RefreshControl,
  Alert,
  StatusBar,
  Platform
} from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import { Garden } from 'react-native-navigation-hybrid';

import AV from 'leancloud-storage';
import store from 'react-native-simple-store';
import GridView from '../../components/GridView';
import Button from '../../components/Button';
import ToastUtil from '../../utils/ToastUtil';
import NavigationUtil from '../../utils/NavigationUtil';
import fontUri from '../../utils/FontUtil';

let tempTypeIds = [];
let maxCategory = 5; // 默认最多5个类别，远端可配置

const propTypes = {
  categoryActions: PropTypes.object,
  category: PropTypes.object.isRequired
};

class Category extends React.Component {
  static navigationItem = {
    titleItem: {
      title: '分类'
    },

    tabItem: {
      title: '分类',
      icon: { uri: fontUri('Ionicons', 'md-pricetags', 24) },
      hideTabBarWhenPush: true,
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      typeIds: tempTypeIds
    };
  }

  componentWillMount() {
    if (!this.props.isFirst) {
      this.props.garden.setRightBarButtonItem({
        icon: { uri: fontUri('Ionicons', 'md-checkmark', 24) },
        action: this.onActionSelected,
      });
      InteractionManager.runAfterInteractions(() => {
        store.get('typeIds').then((typeIds) => {
          tempTypeIds = typeIds;
          this.setState({
            typeIds
          });
        });
      });
    }
  }

  componentDidMount() {
    const { categoryActions } = this.props;
    categoryActions.requestTypeList();
    const query = new AV.Query('Reading_Settings');
    query.get('57b86e0ba633bd002a96436b').then((settings) => {
      maxCategory = settings.get('max_category');
    });
  }

  onRefresh = () => {
    const { categoryActions } = this.props;
    categoryActions.requestTypeList();
  };

  onPress = (type) => {
    const pos = tempTypeIds.indexOf(parseInt(type.id));
    if (pos === -1) {
      tempTypeIds.push(parseInt(type.id));
    } else {
      tempTypeIds.splice(pos, 1);
    }
    this.setState({
      typeIds: tempTypeIds
    });
  };

  onSelectCategory = () => {
    if (this.state.typeIds.length === 0) {
      Alert.alert('提示', '您确定不选择任何分类吗？', [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          onPress: () => {
            store.save('typeIds', this.state.typeIds);
            NavigationUtil.resetRootToHome();
          }
        }
      ]);
    } else if (this.state.typeIds.length > maxCategory) {
      ToastUtil.showShort(`不要超过${maxCategory}个类别哦`);
    } else {
      store.save('typeIds', this.state.typeIds);
      store.save('isInit', true);
      NavigationUtil.resetRootToHome();
    }
  };

  onActionSelected = () => {
    console.info('----------------------------');
    if (tempTypeIds.length > maxCategory) {
      ToastUtil.showShort(`不要超过${maxCategory}个类别哦`);
      return;
    }
    if (tempTypeIds.length < 1) {
      ToastUtil.showShort('不要少于1个类别哦');
    }
    InteractionManager.runAfterInteractions(() => {
      store.get('typeIds').then((typeIds) => {
        if (
          typeIds.sort().toString() ===
          Array.from(tempTypeIds)
            .sort()
            .toString()
        ) {
          this.props.navigator.switchToTab(0);
          return;
        }
        store.save('typeIds', this.state.typeIds).then(this.routeMain);
      });
    });
  };

  routeMain = () => {
    DeviceEventEmitter.emit('changeCategory', this.state.typeIds);
    this.props.navigator.switchToTab(0);
  };

  renderItem = (item) => {
    const isSelect =
      Array.from(this.state.typeIds).indexOf(parseInt(item.id)) !== -1;
    return (
      <Button
        key={item.id}
        containerStyle={[
          styles.categoryBtn,
          isSelect
            ? { backgroundColor: '#3e9ce9' }
            : { backgroundColor: '#fcfcfc' }
        ]}
        style={[
          styles.categoryText,
          isSelect ? { color: '#fcfcfc' } : { color: 'black' }
        ]}
        text={item.name}
        onPress={() => this.onPress(item)}
      />
    );
  };

  renderGridView = () => {
    const { category } = this.props;
    return (
      <ScrollView
        automaticallyAdjustContentInsets={false}
        horizontal={false}
        contentContainerStyle={styles.no_data}
        style={styles.base}
        refreshControl={
          <RefreshControl
            refreshing={category.loading}
            onRefresh={this.onRefresh}
            title="Loading..."
            colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
          />
        }
      >
        <View style={styles.gridLayout}>
          <GridView
            items={Array.from(category.typeList)}
            itemsPerRow={3}
            renderItem={this.renderItem}
          />
        </View>
      </ScrollView>
    );
  };

  render() {
    if (this.props.isFirst) {
      return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text
              style={[
                styles.btnText,
                { color: 'black', padding: 5, fontSize: 18 }
              ]}
            >
              初次见面，请选择您感兴趣的1-5个类别
            </Text>
          </View>
          {this.renderGridView()}
          <Button
            containerStyle={styles.sureBtn}
            style={styles.btnText}
            text="确认"
            onPress={() => this.onSelectCategory()}
          />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.btnText, { color: 'black' }]}>
            请选择您感兴趣的1-5个类别
          </Text>
        </View>
        {this.renderGridView()}
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
  categoryBtn: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dddddd'
  },
  categoryText: {
    fontSize: 16,
    textAlign: 'center'
  },
  gridLayout: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f2f2f2'
  },
  sureBtn: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#3e9ce9'
  },
  btnText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#fff'
  },
  header: {
    padding: 10,
    backgroundColor: '#fcfcfc'
  }
});

Category.propTypes = propTypes;

export default Category;
