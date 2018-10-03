const path = require('path');
const webpack = require('webpack');
const packageJson = require('./package.json');

const isProd = process.env.NODE_ENV === 'production';

const webpackConfig = {
  mode: isProd ? 'production' : 'development',
  target: 'node',
  context: path.join(__dirname, 'src'),
  entry: {
    app: ['./main.js']
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js'],
    modules: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'node_modules')]
  },
  module: {
    rules: [{ test: /\.pem$/, loader: 'raw-loader' }]
  },
  plugins: [
    new webpack.DefinePlugin({
      BUILD_VERSION: JSON.stringify(packageJson.version)
    }),
    new webpack.IgnorePlugin(/\.(css|less)$/)
  ],
  devtool: 'source-map'
};

module.exports = webpackConfig;
