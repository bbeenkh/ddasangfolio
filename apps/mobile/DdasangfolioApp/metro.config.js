// apps/mobileApp/metro.config.js 
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/** 
* Metro 설정 
* <https://reactnative.dev/docs/metro> 
* 
* @type { import('metro-config').MetroConfig } 
*/
const config = {
  resolver: {
    unstable_enableSymlinks: true, // 심볼릭 링크 사용 활성화
  },
  // 프로젝트의 node_modules 폴더 위치 지정 
  watchFolders: [path.join(__dirname, '..', '..')],
};
module.exports = mergeConfig(getDefaultConfig(__dirname), config);