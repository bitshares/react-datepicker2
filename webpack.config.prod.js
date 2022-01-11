const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: "production",
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    filename: 'index.js',
    library: 'react-datepicker2'
  },

  externals: {
    'react': {
      'commonjs': 'react',
      'commonjs2': 'react',
      'amd': 'react',
      // React dep should be available as window.React, not window.react
      'root': 'React'
    },
    'react-dom': {
      'commonjs': 'react-dom',
      'commonjs2': 'react-dom',
      'amd': 'react-dom',
      'root': 'ReactDOM'
    }
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
  }
}