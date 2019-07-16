const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const merge = require('webpack-merge');
const webpack = require('webpack');
const del = require('del');
const ora = require('ora');
const chalk = require('chalk');

const version = require('./utils/version');

const baseConfg = require('./base.conf');
const packer = ora(chalk.yellow('正在删除老版本...\n'));

packer.color = 'yellow';
packer.start();

del(['dist/**'])
  .then(res => {
    packer.color = 'cyanBright';
    packer.text = chalk.cyanBright('打包新版本...\n');
  })


const config = merge(baseConfg, {
  mode: 'production',
  stats: {
    warnings: false,
    assets: false,
    chunks: false,
    errors: false,
  },
  optimization: {
    splitChunks: {
      minSize: 10000,
      minChunks: 2,
      name: false,
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 4,
          minSize: 0
        },
        vendor: {
          name: false,
          chunks: 'initial',
          minSize: 0,
          minChunks: 2,
          priority: 10,
          enforce: true,
        }
      }
    }
  },
  plugins:[
    new OptimizeCssPlugin(),
    new MiniCssExtractPlugin({
      filename:`css/[name].${version}.css`,
      chunkFilename:`css/[name].${version}.css`
    })
  ]
})

webpack(config,(err,stats)=>{
  packer.stop();
  if(err) throw err;
  process.stdout.write('\n');

  process.stdout.write(chalk.cyanBright(stats.toString({
    colors:true,
    modules:false,
    children:false,
    chunks:false,
    chunkModules:false,
    performance:false,
    warnings:false,
  })+'\n\n'))

  if(stats.hasErrors()){
    packer.color='yellow';
    packer.warn(chalk.red(' 打包出错: \n '));
    process.exit();
  }

  packer.color = 'cyan';
  packer.succeed(chalk.cyan(' 老铁，打包成功！ \n '))
})