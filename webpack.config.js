const path = require('path');
const pkg = require('./package.json');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//const DEBUG = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: ['./src/index.js'],
  devServer: {
    hot: true,
    inline: true,
    host: '0.0.0.0',
    disableHostCheck: true
  },
  performance: {
    hints: false
  },
  output: {
    library: 'Supaplex'
  },
  target: 'web',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: 'babel-loader',
        exclude: path.resolve(__dirname, './node_modules/')
      },{
        test: /\.(jpe?g|png|gif|svg|json)$/i,
        use: 'file-loader'
      },
      {
        test: /\.(frag?g|vert)$/i,
        use: 'raw-loader'
      },
      {
        test: /\.css?$/,
        use: ['style-loader', 'css-loader'],
        exclude: path.resolve(__dirname, './node_modules/')
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: 'head',
      template: 'src/index.html'
    }),
    new webpack.HotModuleReplacementPlugin({})
  ]
}
