'use strict';

var webpack = require('webpack'),
    WebpackDevServer = require('webpack-dev-server'),
    config = require('./webpack.config.js');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  quiet: false,
  noInfo: false,
  stats: {
    assets: false,
    colors: true,
    version: false,
    hash: false,
    timings: false,
    chunks: false,
    chunkModules: false
  }
}).listen(3000, 'localhost', function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Listening at localhost:3000');
  }
});