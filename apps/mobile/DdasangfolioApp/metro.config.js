// apps/mobileApp/metro.config.js
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../../..');

/**
* Metro 설정
* <https://reactnative.dev/docs/metro>
*
* @type { import('metro-config').MetroConfig }
*/
const config = {
  projectRoot,
  // pnpm symlink이 모노레포 루트 node_modules/.pnpm을 가리키므로 루트까지 watch 필요
  watchFolders: [monorepoRoot],
  resolver: {
    unstable_enableSymlinks: true,
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(monorepoRoot, 'node_modules'),
    ],
  },
};
module.exports = mergeConfig(getDefaultConfig(__dirname), config);