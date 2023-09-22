const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  externals: [
    // Do not add node_modules to build
    nodeExternals(),
  ],
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: __dirname,
  },
  // Create source map in development mode
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
};
