var path = require('path');
var webpack = require('webpack');

var NODE_ENV = process.env.NODE_ENV;

var env = {
    production: NODE_ENV === 'production',
    staging: NODE_ENV === 'staging',
    test: NODE_ENV === 'test',
    development: NODE_ENV === 'development' || typeof NODE_ENV === 'undefined'
};

Object.assign(env, {
    build: (env.production || env.staging)
});

module.exports = {
    target: 'web',

    entry: [
        'babel-polyfill',
        path.join(__dirname, './views/components/TripsPage.jsx')
    ],

    output: {
        path: path.join(__dirname, 'public'),
        //pathInfo: true,
        //publicPath: 'http://localhost:3000/',
        publicPath: '/',
        filename: 'scripts/bundle.js'
    },

    resolve: {
        root: path.join(__dirname, 'views/components'),
        modulesDirectories: [
            'web_modules',
            'node_modules',
            //'views/components'
        ],
        extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx']
    },

    plugins: [
        new webpack.DefinePlugin({
            __DEV__: env.development,
            __STAGING__: env.staging,
            __PRODUCTION__: env.production,
            __CURRENT_ENV__: '\'' + (NODE_ENV) + '\''
        })
    ],

    module: {
        loaders: [{
            test: /\.scss$/,
            loader: 'style!css!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded'
        }],

        noParse: /\.min\.js/
    }
};
