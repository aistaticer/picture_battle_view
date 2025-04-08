const path = require('path');

module.exports = {
  devServer: {
    host: '0.0.0.0',   // コンテナ内で外部アクセスを許可する
    port: 3000,        // 開発サーバーのポート
    client: {
      webSocketURL: 'ws://localhost:3001/ws',  // WebSocket の URL を変更
    },
  },
  entry: './src/entrypoint/index.js', // エントリーポイント
  output: {
    path: path.resolve(__dirname, 'dist'), // 出力ディレクトリ
    filename: 'bundle.js', // 出力ファイル名
  },
  mode: 'development', // モード（production, development）
};
