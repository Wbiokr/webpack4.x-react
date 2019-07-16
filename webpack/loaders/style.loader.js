const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const resolve = require('../utils/resolve');

const isPro = require('../utils/isPro');


module.exports = (type,loader) => {
  let use = [
    isPro ? {
      loader:MiniCssExtractPlugin.loader,
      options:{
        publicPath:resolve('dist/css')
      }
    } : require.resolve('style-loader'),
    {
      loader:require.resolve('css-loader'),
    },
    {
      loader:require.resolve("postcss-loader"),
      options:{
        plugins: [
          require('autoprefixer')  
        ],
      },
    }
  ];

  type !== 'css' && use.push(loader || require.resolve(`${type}-loader`)) ;

  const config = {
    test: type === 'css' ? /\.css$/ : type === 'less' ? /\.less$/ : type === 'scss' ? /\.(scss|sass)$/ : /\.styl(us)?$/ ,
    include:[resolve('src'),/node_modules/],
    use,
    
  };

  return config ;
}