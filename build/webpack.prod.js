const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { assetsPath, resolve } = require('./utils')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// 压缩css代码
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// 压缩js代码
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')

const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')

const { bundleAnalyzerReport } = require('./config')

// service worker
const OfflinePlugin = require('offline-plugin')
// mainfest
const WebpackPwaMainfest = require('webpack-pwa-manifest')

const prodConfig = {
    mode: 'production',
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'public/index.html',
            title: '网易云音乐',
            inject: true,
            minify: {
                removeComments: true, // 去掉注释
                collapseWhitespace: true, // 去掉多余空白
                removeAttributeQuotes: true // 去掉一些属性引号，例如id="mode" => id=mode
            },
            cdn: {
                js: [
                    'https://cdn.bootcss.com/react/16.8.6/umd/react.production.min.js',
                    'https://cdn.bootcss.com/react-dom/16.8.6/umd/react-dom.production.min.js'
                ]
            }
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: assetsPath('css/[name].[contenthash].css'),
            chunkFilename: assetsPath('css/[name].[id].[contenthash].css')
        }),
        new CleanWebpackPlugin(),
        new ScriptExtHtmlWebpackPlugin({
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
        }),
        new webpack.DllReferencePlugin({
            // dll 加速打包速度
            manifest: resolve('../dll/vendor.manifest.json')
        }),
        new AddAssetHtmlPlugin({
            filepath: resolve('../dll/**/*.js'),
            includeSourcemap: false
        }),
        new OfflinePlugin({
            externals: ['/'],
            appShell: ' / '
        }),
        new WebpackPwaManifest({
            name: 'necm demo',
            short_name: 'necm',
            description: 'Progressive Web App for necm',
            background_color: '#ffffff',
            start_url: '.',
            crossorigin: 'use-credentials',
            icons: [
                {
                    src: resolve('../src/assets/img/main_logo.png'),
                    sizes: [96, 128, 192, 256, 384, 512] // multiple size
                },
                {
                    src: resolve('../src/assets/img/main_logo.png'),
                    sizes: '1024x1024'
                }
            ],
            ios: {
                'apple-mobile-web-app-title': 'necm',
                'apple-mobile-web-app-status-bar-style': '#000',
                'apple-mobile-web-app-capable': 'yes',
                'apple-touch-icon': resolve('../src/assets/img/main_logo.png'),
            }
        })
    ],
    optimization: {
        runtimeChunk: true,
        minimizer: [
            new OptimizeCssAssetsPlugin({
                cssProcessor: require('cssnano'), // 使用 cssnano 压缩器
                cssProcessorOptions: {
                    reduceIdents: false,
                    autoprefixer: false,
                    safe: true,
                    discardComments: {
                        removeAll: true
                    }
                }
            }),
            new TerserPlugin({
                cache: true,
                terserOptions: {
                    compress: {
                        warnings: true,
                        drop_console: true,
                        drop_debugger: true,
                        pure_funcs: ['console.log'] // 移除console
                    }
                },
                sourceMap: true
            })
        ],
        splitChunks: {
            chunks: 'async', // 提取的 chunk 类型，all: 所有，async: 异步，initial: 初始
            // minSize: 30000, // 默认值，新 chunk 产生的最小限制 整数类型（以字节为单位）
            // maxSize: 0, // 默认值，新 chunk 产生的最大限制，0为无限 整数类型（以字节为单位）
            // minChunks: 1, // 默认值，新 chunk 被引用的最少次数
            // maxAsyncRequests: 5, // 默认值，按需加载的 chunk，最大数量
            // maxInitialRequests: 3, // 默认值，初始加载的 chunk，最大数量
            // name: true, // 默认值，控制 chunk 的命名
            cacheGroups: {
                // 配置缓存组
                vendor: {
                    name: 'vendor',
                    chunks: 'initial',
                    priority: 10, // 优先级
                    reuseExistingChunk: false, // 允许复用已经存在的代码块
                    test: /node_modules\/(.*)\.js/
                },
                common: {
                    name: 'common',
                    chunks: 'initial',
                    // test: resolve("src/components"), // 可自定义拓展你的规则
                    minChunks: 2,
                    priority: 5,
                    reuseExistingChunk: true
                }
            }
        }
    }
}

if(bundleAnalyzerReport) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    prodConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = merge(baseConfig, prodConfig)