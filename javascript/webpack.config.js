// output.pathに絶対パスを指定する必要があるため、pathモジュールを読み込んでおく
const path = require('path');

module.exports = {
  // development or production。
  mode: 'development',
  resolve: {
    alias: {
      // vue はフルコンパイラー入りが必要
      'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
    }
  },
  // エントリーポイントの設定
  entry: './build/index.js',
  // 出力の設定
  output: {
    // 出力するファイル名
    filename: 'index.js',
    // 出力先のパス
    path: path.join(__dirname, './public/lib')
  }
};