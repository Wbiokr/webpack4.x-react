const HtmlWebpackPlugin = require('html-webpack-plugin');

const resolve = require('./utils/resolve');
const version = require('./utils/version');

const generateStyleLoader = require('./loaders/style.loader');
const generateFileLoader = require('./loaders/file.loader');

const isPro = require('./utils/isPro')

module.exports = {
  context:resolve('..'),
  bail:true,
  performance:{
    maxAssetSize:20000000
  },
  entry:{
    App:resolve('src/main.js')
  },
  output:{
    path:resolve('dist'),
    publicPath:isPro?'/dist/':'/',
    filename:`js/[name].${version}.js`,
  },
  resolve:{
    extensions:['.js','.jsx'],
    alias:{
      '@':resolve('src')
    },
    modules:[
      resolve('src'),
      resolve('node_modules')
    ]
  },
  externals:{
    'React':'React',
    
  },
  cache:true,
  module:{
    noParse:content=>/jquery|loadash|echarts/.test(content),
    rules:[
      generateStyleLoader('styl',require.resolve("stylus-loader")),
      generateStyleLoader('less'),
      generateStyleLoader('scss',require.resolve('sass-loader')),
      generateStyleLoader('css'),
      generateFileLoader('img',version),
      generateFileLoader('media',version),
      generateFileLoader('fonts',version),
      {
        test:/\.(js|jsx)$/,
        include:resolve('src'),
        loader:require.resolve('babel-loader'),
      },
    ]
  },
  plugins:[
    new HtmlWebpackPlugin({
      inject:false,
      filename: isPro ? resolve('index.html') : 'index.html',
      template:resolve('static/index.html'),
      react:`/static/lib/${isPro?"react.min":"react"}.js`,
      reactDOM:`/static/lib/${isPro?"reactDOM.min":"reactDOM"}.js`,
      moment:'/static/lib/moment.min.js',
      polyfill:'/static/lib/polyfill.min.js',
      app:`${isPro?"/dist":""}/js/App.${version}.js`,
      style:`${isPro?"/dist":""}/css/app.${version}.css`,
      minify:{
        removeComments:true,
        removeTagWhitespace:true,
        // removeAttributeQuotes:true,
      }
    })
  ],
  node: {
    setImmediate: false,
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}