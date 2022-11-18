// Helper for combining webpack config objects
// @eslint-disable-file @typescript-eslint/no-var-requires
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');

module.exports = (config, context) => {
  const env = {
    ...process.env,
    NODE_ENV: context.configuration,
  };

  // console.log(envKeys);

  const merged = merge(config, {
    devServer: {
      port: process.env.PORT || 8080,
      allowedHosts: 'all',
    },
  });

  // TODO: This is a hack to reenable REACT_APP_ in nx by replacing their settings.  should be a better way?
  merged.plugins[0] = new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(context.configuration),
    },
  });

  return merged;
};
