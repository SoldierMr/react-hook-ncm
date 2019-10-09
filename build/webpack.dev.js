const webpack = require('webpack')
const merge = require("webpack-merge")
const baseConfig = require("./webpack.base")
const HtmlWebpackPlugin = require('html-webpack-plugin')

const { SkeletonPlugin } = require('page-skeleton-webpack-plugin')

const devConfig = {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'public/index.html',
            title: '网易云音乐',
            inject: true,
            cdn: {
                js: [
                    'https://cdn.bootcss.com/react/16.8.6/umd/react.production.min.js',
                    'https://cdn.bootcss.com/react-dom/16.8.6/umd/react-dom.production.min.js'
                ]
            }
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],
    devServer: {
        host: 'localhost',
        port: 3000,
        historyApiFallback: true, // 任意的 404 响应都可能需要被替代为 index.html
        overlay: {
            //当出现编译器错误或警告时，就在网页上显示一层黑色的背景层和错误信息
            errors: true
        },
        inline: true,
        hot: true,
        proxy: {
            '/': {
                target: 'https://api.necm.chenfangzheng.cn',
                ws: false,
                changeOrigin: true,
                pathRewrite: {
                    '^/': '/'
                }
            }
        }
    }
}

module.exports = merge(baseConfig, devConfig)