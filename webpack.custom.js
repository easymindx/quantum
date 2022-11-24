// Helper for combining webpack config objects
// @eslint-disable-file @typescript-eslint/no-var-requires
const { merge } = require('webpack-merge');
const webpack = require('webpack');

module.exports = (config, context) => {
  const env = {
    ...process.env,
    NODE_ENV: context.configuration,
  };

  // reduce it to a nice object, the same as before
  const envKeys = Object.keys(env).reduce((prev, next) => {
    if (
      next.startsWith('REACT_APP_') ||
      next.startsWith('NX_') ||
      next === 'NODE_ENV'
    ) {
      if (env[next]) prev[`${next}`] = JSON.stringify(env[next]);
    }
    console.log('env', env);
    return prev;
  }, {});

  const merged = merge(config, {
    devServer: {
      allowedHosts: 'all',
    },
  });

  // TODO: This is a hack to reenable REACT_APP_ in nx by replacing their settings.  should be a better way?
  merged.plugins[0] = new webpack.DefinePlugin({
    'process.env': {
      ...envKeys,
      NODE_ENV: JSON.stringify(context.configuration),
    },
  });

  return merged;
};
