const fs = require('fs-extra')

// 找到 NavigatonHybrid 的 build.gradle 文件
const navigationHybrid = './node_modules/react-native-navigation-hybrid/android/build.gradle'

// 其它使用了原生源码的库，例如：
const codePush = './node_modules/react-native-code-push/android/app/build.gradle'
const vectorIcons = './node_modules/react-native-vector-icons/android/build.gradle'
const splash = './node_modules/react-native-splash-screen/android/build.gradle'
const wechat = './node_modules/react-native-wechat/android/build.gradle'
const deviceInfo = './node_modules/react-native-device-info/android/build.gradle'
const exceptionManager = './node_modules/react-native-exceptions-manager/android/app/build.gradle'
const modal = './node_modules/react-native-modal-translucent/android/build.gradle'

const gradles = [
  navigationHybrid,
  codePush,
  vectorIcons,
  splash,
  wechat,
  deviceInfo,
  exceptionManager,
  modal
]

gradles.forEach(gradle => {
  fs.readFile(gradle, 'utf8', function(err, data) {
    if(data) {
      let str = data.replace(/^(\s+compileSdkVersion).*$/gm, '$1 rootProject.ext.compileSdkVersion')
      str = str.replace(/^(\s+buildToolsVersion).*$/gm, '$1 rootProject.ext.buildToolsVersion')
      str = str.replace(/^(\s+targetSdkVersion).*$/gm, '$1 rootProject.ext.targetSdkVersion')
      str = str.replace(/["'](com\.android\.support:appcompat-v7:).*["']/gm, '"$1$rootProject.ext.supportLibraryVersion"')
      str = str.replace(/["'](com\.android\.support:support-v4:).*["']/gm, '"$1$rootProject.ext.supportLibraryVersion"')
      str = str.replace(/["'](com\.android\.support:design:).*["']/gm, '"$1$rootProject.ext.supportLibraryVersion"')
      fs.outputFile(gradle, str)
    }
  })
})