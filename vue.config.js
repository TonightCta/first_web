const path = require('path');
const webpack = require('webpack');
const Timestamp = new Date().getTime();
const isProduction = process.env.NODE_ENV == 'production';

function resolveSrc(_path) {
  return path.join(__dirname, _path);
}
// function resolve(dir){
//   return path.join(__dirname,'..',dir)
// };

// function addStyleResource(rule) {
//   rule.use('style-resource')
//     .loader('style-resources-loader')
//     .options({
//       patterns: [
//         path.resolve(__dirname, './src/style/mine_vant.less'), // 需要全局导入的less
//       ],
//     })
// }
// vue.config.js
module.exports = {
  productionSourceMap:!isProduction,
  publicPath: './',
  lintOnSave: true,
  devServer: {
    port: 5000,
    proxy: {
      '/api': {
        target: 'https://debugmanage.first.vip/api1',
        changeOrigin: true,
        logLevel: 'debug',
        pathRewrite: {
          '^/api': ''
        },
      },
    }
  },
  configureWebpack: {
    // Set up all the aliases we use in our app.
    output: {
      filename: `js/[name].${Timestamp}.js`,
      chunkFilename: `js/[name].${Timestamp}.js`
    },
    resolve: {
      alias: {
        src: resolveSrc('src'),
        'chart.js': 'chart.js/dist/Chart.js'
      }
    },
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 6
      })
    ]
  },
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  },
  css: {
    // Enable CSS source maps.
    sourceMap: process.env.NODE_ENV !== 'production',
    loaderOptions: {
      sass: {
        prependData: `
          @import "~@/style/global.scss";
        `
      },
      less:{
        javascriptEnabled: true,
        modifyVars:{
          // 'notify-primary-background-color':'red',
          // 'hack':`true;@import "${resolve('./src/style/mine_vant.less')}";`
        }
      }
    }
  },
  // chainWebpack: config => {
  //   const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
  //   types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))
  // }
};
