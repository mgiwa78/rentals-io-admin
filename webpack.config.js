const path = require('path')

// module.exports = function (webpackEnv) {
//   return {
//     mode: 'development',
//     entry: './src/index.tsx'
//     output: {
//       path: path.resolve(__dirname, 'build'),
//     },
//     resolve: {
//       fallback: {
//         path: require.resolve('path-browserify'),
//         stream: require.resolve('stream-browserify'),
//       },
//       extensions: ['.tsx', '.ts', '.js'],
//     },
//     module: {
//       rules: [
//         {
//           test: /\.tsx?$/,
//           loader: 'ts-loader',
//           exclude: /node_modules/,
//         },
//       ],
//     },
//   }
// }
// const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  mode: 'development',
  entry: './main.tsx',
  devtool: 'inline-source-map',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'bundle.js',
  },
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      path: require.resolve('path-browserify'),
      stream: require.resolve('stream-browserify'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
  ],
}
