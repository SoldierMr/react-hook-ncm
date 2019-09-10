const { resolve } = require("path")
const webpack = require("webpack")
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    entry: {
        index: resolve(__dirname, '../src/index.tsx'),
    },
    output: {
        filename: 'js/[name].[contenthash].js',
        chunkFilename: 'js/[name].[contenthash].js',
        path: resolve(__dirname , '../dist')
    },
    module: {
        rules: [
            {
                test: /\.(j|t)sx?$/,
                include: [resolve(__dirname, '../src')],
                // 去除node_modules底下的
                exclude: /(node_modules|bower_component)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            presets: [
                                '@babel/preset-env',
                                '@babel/preset-typescript',
                                '@babel/preset-react'
                            ],
                            plugins: [
                                ['@babel/plugin-proposal-decorators', { legacy: true }],
                                ['@babel/plugin-proposal-class-properties', { loose: true }],
                                '@babel/plugin-syntax-dynamic-import',
                                '@babel/plugin-transform-runtime'
                            ]
                        }
                    }
                ]
            }, 
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    // 注意loader生效是从右到左的
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                include: resolve(__dirname, '../src'),
                use: [
                    extractCss ? MiniCssExtractPlugin.loader : 'style-loader',
                    'css-loader',
                    'postcss-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            includePaths: [resolve(__dirname, '../src/styles')]
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            // 1024b == 1kb
                            // 小于10kb时打包成base64编码的图片，否则单独打包成图片
                            limit: 10240,
                            name: resolve('img/[name].[hash:8].[ext]')
                        }
                    }
                ]
            },
            {
                test: /\.(woff2|eot|ttf|otf)(\?.*)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            name: resolve('font/[name].[hash:8].[ext]')
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        
    ],
    performance: {
        // 性能提示，可以提示过大文件
        hints: 'warnging', // 性能提示开关 false | "error" | "warning"
        maxAssetSize: 100000, // 生成的文件最大限制 整数类型 （以字节为单位）
        maxEntrypointSize: 100000, // 引入的文件最大限制 整数类型（以字节为单位）
        assetFilter: function(assetFilename) {
            // 提供资源文件名的断言函数
            return /\.(png|jpe?g|gif|svg)(\?.*)?$/.test(assetFilename)
        }
    },
    resolve:{
        extensions: ['.ts', 'tsx', '.js', '.jsx'],
        alias: {
            '@': resolve(__dirname, '../src'),
            '@components': resolve(__dirname, '../src/components'),
            '@img': resolve(__dirname, '../src/assets/img'),
            '@views': resolve(__dirname, '../src/views'),
            '@actions': resolve(__dirname, '../src/actions'),
            '@reducers': resolve(__dirname, '../src/reducers'),
            '@store': resolve(__dirname, '../src/store'),
            '@hooks': resolve(__dirname, '../src/hooks'),
            '@styles': resolve(__dirname, '../src/styles'),
        }
    },
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
    }
}