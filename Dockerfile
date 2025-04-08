# ベースイメージにNode.jsを使用
FROM node:16-alpine

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY app/package*.json ./

# 依存関係をインストール
RUN npm install

# ソースコードをコピー
COPY . .

# 開発サーバーを起動
CMD ["npm", "start"]
