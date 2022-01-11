const path = require('path');

module.exports = {
  mode: "development",
  entry: './docs/src/boot.js',
  output: {
    path: path.resolve(__dirname, 'docs'),
    libraryTarget: 'umd',
    filename: 'demo_bundles.js',
    library: 'react-datepicker2'
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