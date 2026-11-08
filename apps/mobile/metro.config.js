const path = require('path');
const fs = require('fs');
const { withNxMetro } = require('@nx/expo');
const { getDefaultConfig } = require('expo/metro-config');
const { mergeConfig } = require('@expo/metro/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');
const nodeModulesRoot = path.resolve(workspaceRoot, 'node_modules');
const pnpmRoot = path.resolve(nodeModulesRoot, '.pnpm');

const defaultConfig = getDefaultConfig(projectRoot);
const { assetExts, sourceExts } = defaultConfig.resolver;

// Enable symlink and package export resolution for pnpm monorepos
defaultConfig.resolver.unstable_enableSymlinks = true;
defaultConfig.resolver.unstable_enablePackageExports = true;

const rawWatchFolders = [
  projectRoot,
  workspaceRoot,
  nodeModulesRoot,
];
if (fs.existsSync(pnpmRoot)) {
  rawWatchFolders.push(pnpmRoot);
}

// Add both lowercase and uppercase drive letter variants to avoid Windows path prefix check failures in Metro
const watchFolders = [];
for (const f of rawWatchFolders) {
  watchFolders.push(f);
  if (/^[A-Za-z]:/.test(f)) {
    watchFolders.push(f[0].toUpperCase() + f.slice(1));
    watchFolders.push(f[0].toLowerCase() + f.slice(1));
  }
}

const singletons = ['react', 'react-native', 'expo', 'react-native-svg'];
const extraNodeModules = singletons.reduce((acc, name) => {
  acc[name] = path.resolve(nodeModulesRoot, name);
  return acc;
}, {});

const customConfig = {
  cacheVersion: 'mobile',
  watchFolders,
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...sourceExts, 'cjs', 'mjs', 'svg'],
    extraNodeModules,
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      nodeModulesRoot,
    ],
  },
};

const merged = withNxMetro(mergeConfig(defaultConfig, customConfig), {
  debug: false,
  extensions: [],
  watchFolders,
});

// Ensure final watchFolders also contain both drive letter variants
const finalWatchFolders = [];
for (const f of (merged.watchFolders || watchFolders)) {
  finalWatchFolders.push(f);
  if (/^[A-Za-z]:/.test(f)) {
    finalWatchFolders.push(f[0].toUpperCase() + f.slice(1));
    finalWatchFolders.push(f[0].toLowerCase() + f.slice(1));
  }
}
merged.watchFolders = [...new Set(finalWatchFolders)];

module.exports = merged;
