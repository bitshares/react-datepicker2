const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './docs/preview/index.html',
  filename: './index.html',
  inject: true
})

module.exports = {
  mode: "development",
  entry: './docs/src/boot.js',
  output: {
    path: path.resolve(__dirname, 'docs'),
    libraryTarget: 'umd',
    filename: 'demo_bundles.js',
    library: 'react-datepicker2'
  },
  devtool: "source-map",
  devServer: {
    historyApiFallback: true,
    static: "./docs"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, loader: 'babel-loader', exclude: /node_modules/, options: {
          plugins: ['@babel/plugin-transform-runtime'],
          presets: ['@babel/preset-env', '@babel/preset-react'],
        }
      }
    ]
  },
  plugins: [HtmlWebpackPluginConfig]
}