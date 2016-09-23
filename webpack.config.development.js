'use strict';

var webpack = require('webpack');
var config = require('./webpack.config.base.js');
const port = 3001;

if (process.env.NODE_ENV !== 'test') {
    config.entry = [
        'webpack-dev-server/client?http://localhost:' + port,
        'webpack/hot/dev-server'
    ].concat(config.entry);
}

config.devtool = '#cheap-module-eval-source-map';

config.plugins = config.plugins.concat([
    new webpack.HotModuleReplacementPlugin()
]);
//
config.module.loaders = config.module.loaders.concat([{
    test: /\.jsx?$/,
    loaders: ['react-hot', 'babel'],
    exclude: /node_modules/
}]);

module.exports.config = config;
module.exports.port = port;
