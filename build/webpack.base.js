// const { resolve } = require("path")
const webpack = require("webpack")
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { resolveAssetsRootDir, resolve } = require('./utils')

const { defineEnv, extractCss, _hash } = require('./config')

module.exports = {
    entry: {
        index: resolve('../src/index.tsx'),
    },
    output: {
        filename: `js/[name].[${_hash}].js`,
        path: resolve('../dist')
    },
    module: {
        rules: [
            {
                test: /\.(j|t)sx?$/,
                include: [resolve('../src')],
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
                include: resolve('../src'),
                use: [
                    extractCss ? MiniCssExtractPlugin.loader : 'style-loader',
                    'css-loader',
                    'postcss-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                includePaths: [resolve('../src/styles')]
                            }
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
                            name: resolveAssetsRootDir('img/[name].[hash:8].[ext]')
                        }
                    }
                ]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            name: resolveAssetsRootDir('font/[name].[hash:8].[ext]')
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin(defineEnv)
    ],
    performance: {
        // 性能提示，可以提示过大文件
        hints: 'warning', // 性能提示开关 false | "error" | "warning"
        maxAssetSize: 100000, // 生成的文件最大限制 整数类型 （以字节为单位）
        maxEntrypointSize: 100000, // 引入的文件最大限制 整数类型（以字节为单位）
        assetFilter: function(assetFilename) {
            // 提供资源文件名的断言函数
            return /\.(png|jpe?g|gif|svg)(\?.*)?$/.test(assetFilename)
        }
    },
    resolve:{
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        alias: {
            '@': resolve('../src'),
            '@components': resolve('../src/components'),
            '@img': resolve('../src/assets/img'),
            '@views': resolve('../src/views'),
            '@actions': resolve('../src/actions'),
            '@reducers': resolve('../src/reducers'),
            '@store': resolve('../src/store'),
            '@hooks': resolve('../src/hooks'),
            '@styles': resolve('../src/styles'),
        }
    },
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
    }
}