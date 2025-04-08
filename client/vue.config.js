const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  pluginOptions: {
    apollo: {
      enableMocks: true,
      enableEngine: true,
    },
  },
  configureWebpack: {
    performance: {
      hints: false,
    },
    resolve: {
      fallback: {
        fs: require.resolve('browserify-fs'),
        os: require.resolve('os-browserify/browser'),
      },
    },
    plugins: [new NodePolyfillPlugin()],
  },
  chainWebpack: (config) => {
    config.performance.maxEntrypointSize(400000).maxAssetSize(400000);
  },
};
