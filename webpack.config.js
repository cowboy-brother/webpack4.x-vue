const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const cleanWebpackPlugin = require('clean-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const isDev = process.env.NODE_ENV == 'development';

const config = {
	target: 'web',
	entry: './src/index.js',
	output: {
		filename: 'js/[name].build.js',
		path: path.resolve(__dirname, './dist')
	},
	plugins: [
    new htmlWebpackPlugin({
    	title: 'this is index.html',
    	template: './index.html'
    }),
    new cleanWebpackPlugin('./dist'),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
    	'process.env': {
    		NODE_ENV: isDev ? '"development"' : '"production"'
    	}
    })
	],
	module: {
		rules: [
		  {
        test: /\.vue$/,
        use: 'vue-loader'
		  },{
      test: /\.styl$/,
    	use: [
      	'style-loader',
      	'css-loader',
      	'postcss-loader',
      	'stylus-loader'
    	]
    },
      {
        test: /\.(gif|jpg|jpeg|png|svg)$/,
        use: [
            {
              loader:'file-loader',
              options:{ // 这里的options选项参数可以定义多大的图片转换为base64
                name: '[name].[ext]',
                outputPath:'images' //定义输出的图片文件夹
              }
            }
        ]
	    }
		]
	},
}

if(isDev){
	//开发环境配置
	config.module.rules.push(
	  {
      test: /\.css$/,
    	use: [
      	'style-loader',
      	'css-loader',
      	'postcss-loader',
    	]
    }
   );
	config.devServer = {
    port: '8080',
    host: '0.0.0.0',
    overlay: { // webpack编译出现错误，则显示到网页上
    	errors: true
    },
    // open: true,
    // 不刷新热加载数据
    hot: true
	};
	config.devtool = '#cheap-module-eval-source-map';
	config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
	)
} else {
// 生成坏境的配置
    config.entry = {   // 将所用到的类库单独打包
        app: path.join(__dirname, 'src/index.js'),
        vendor: ['vue']
    };
    config.output.filename = 'js/[name].[chunkhash:8].js';
    config.module.rules.push({
         test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
              publicPath: '../'
            }
          },
          "css-loader"
        ]
    });
    config.plugins.push(
         new MiniCssExtractPlugin({
		      // Options similar to the same options in webpackOptions.output
		      // both options are optional
		      filename: "css/[name].css",
		      chunkFilename: "css/[id].css"
		    }),
        new OptimizeCSSAssetsPlugin({
            // assetNameRegExp: '0.css',  //需要根据自己打包出来的文件名来写正则匹配这个配置是我自己的
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                discardComments: { removeAll: true },
                parser: require('postcss-safe-parser'),
                autoprefixer: false
            },
            canPrint: true
        })
        // 将类库文件单独打包出来
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'vendor'
        // })

        // webpack相关的代码单独打包
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'runtime'
        // })
    );

    config.optimization = {
      splitChunks: {
          cacheGroups: {                  // 这里开始设置缓存的 chunks
              commons: {
                  chunks: 'initial',      // 必须三选一： "initial" | "all" | "async"(默认就是异步)
                  minSize: 0,             // 最小尺寸，默认0,
                  minChunks: 2,           // 最小 chunk ，默认1
                  maxInitialRequests: 5   // 最大初始化请求书，默认1
              },
              vendor: {
                  test: /node_modules/,   // 正则规则验证，如果符合就提取 chunk
                  chunks: 'initial',      // 必须三选一： "initial" | "all" | "async"(默认就是异步)
                  name: 'vendor',         // 要缓存的 分隔出来的 chunk 名称
                  priority: 10,           // 缓存组优先级
                  enforce: true
              }
          }
      },
      runtimeChunk: true
    }
       

}

module.exports = config;
