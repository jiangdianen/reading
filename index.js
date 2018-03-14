/**
 *
 * Copyright 2015-present reading
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
import { ReactRegistry, Garden, Navigation } from 'react-native-navigation-hybrid';

import componentWrapper from './app/root';

import About from './app/pages/About/About';
import Category from './app/containers/CategoryContainer';
import Feedback from './app/pages/Feedback/Feedback';
import Web from './app/pages/ItemDetail/WebViewPage';
import Main from './app/containers/MainContainer';
import Splash from './app/pages/Splash';

Garden.setStyle({
  topBarStyle: 'light-content',
  topBarColor: '#3E9CE9',
  titleTextSize: 20,

  bottomBarColor: '#FFFFFF',
  bottomBarButtonItemActiveColor: '#3E9CE9',
  bottomBarButtonItemInactiveColor: '#CCCCCC',
});

ReactRegistry.startRegisterComponent(componentWrapper);

ReactRegistry.registerComponent('About', () => About);
ReactRegistry.registerComponent('Category', () => Category);
ReactRegistry.registerComponent('Feedback', () => Feedback);
ReactRegistry.registerComponent('Web', () => Web);
ReactRegistry.registerComponent('Main', () => Main);
ReactRegistry.registerComponent('Splash', () => Splash);

ReactRegistry.endRegisterComponent();

Navigation.setRoot({
  screen: { moduleName: 'Splash' }
}, true);

