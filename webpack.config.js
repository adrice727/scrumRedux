
var path = require('path');
var webpack = require('webpack');

var BUILD_DIR = path.resolve(__dirname, '../scrumRedux/public/js');
var APP_DIR = path.resolve(__dirname, '../scrumRedux/jsx');
var REDUX_DIR = path.resolve(__dirname, '../scrumRedux/redux_config');

module.exports = {
  entry: {
    index: APP_DIR + '/index.jsx',
    actions: [REDUX_DIR + '/actions.js'],
    reducers: [REDUX_DIR + '/reducers.js'],
    store: [REDUX_DIR + '/store.js']
  },
  

  output: {
    path: BUILD_DIR,
    filename: '[name].js'
  },

  module : {
    loaders : [
      {
        test : /\.jsx?/,
        include : [APP_DIR, REDUX_DIR],
        loader : 'babel',
        exclude: "/node_modules/",
        query:
          {
        presets:['react', 'es2015', 'stage-2'],
        plugins: ['transform-decorators-legacy', "transform-object-rest-spread"]
          }
      }
    ]
  },

    externals: {
    'react/addons': 'react/addons'
  },

  plugins: [
        new webpack.optimize.CommonsChunkPlugin("vendors", "vendors.js"),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]

};

