const { override } = require('customize-cra');

module.exports = override((config, env) => {
  console.log('オーバーライドされました');

  // devServer の設定を追加
  if (!config.devServer) {
    config.devServer = {};
  }
  config.devServer.host = '0.0.0.0';
  config.devServer.port = 3000;
  config.devServer.client = {
    webSocketURL: 'ws://localhost:3001/ws',
  };

  // Webpack の module.rules に fullySpecified を追加
  if (!config.module) {
    config.module = { rules: [] };
  }
  config.module.rules.push({
    test: /\.m?js/,
    resolve: {
      fullySpecified: false,
    },
  });

  // ソースマップの警告を無視
  config.ignoreWarnings = [/Failed to parse source map/];

  return config;
});
