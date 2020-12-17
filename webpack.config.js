const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/data-validate.js',
  plugins: [
    new CleanWebpackPlugin()
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'data-validate.js',
    library: 'data-validate',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
};