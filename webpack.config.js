const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: 'development',
  entry: './index.web.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Rely on babel.config.js for presets/plugins
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images',
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new webpack.DefinePlugin({
      __DEV__: process.env.NODE_ENV !== 'production',
    }),
    new Dotenv({
      path: './.env.web', // Path to .env.web file
      safe: true, // load .env.example (if it exists)
      systemvars: true, // load all system variables
    }),
    // Explicitly ignore Node.js modules that cause issues in web builds
    new webpack.IgnorePlugin({ resourceRegExp: /^fs$/ }),
    new webpack.IgnorePlugin({ resourceRegExp: /^better-sqlite3$/ }),
  ],
  resolve: {
    extensions: ['.web.js', '.js', '.web.jsx', '.jsx', '.web.ts', '.ts', '.web.tsx', '.tsx'],
    alias: {
      'react-native$': 'react-native-web',
      'react-native-vector-icons/MaterialCommunityIcons$': path.resolve(__dirname, 'src/mocks/MaterialCommunityIcons.js'),
      'react-native-vector-icons/lib/create-icon-set$': path.resolve(__dirname, 'src/mocks/react-native-vector-icons.js'),
      // Revert to aliasing the main sqlite adapter import to false for web
      '@nozbe/watermelondb/adapters/sqlite$': false,
    },
    fallback: {
      // Keep fallbacks as a safety net
      "fs": false,
      "path": require.resolve("path-browserify"),
      "better-sqlite3": false
    }
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 3000,
    hot: true,
    historyApiFallback: true,
  },
};