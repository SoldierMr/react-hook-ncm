const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    mode: 'production',
    entry: {
        // redux 之类的也可以加进来
        vendor: ['react', 'react-dom', 'react-router-dom', 'redux']
    },
    output: {
        filename: '[name].dll.[hash:8].js',
        path: path.join(__dirname, '../dll'),
        // 链接库输出方式默认'var'形式赋值给变量
        libraryTarget: 'var',
        library: '_dll_[name]_[hash:8]'
    },
    plugins: [
        // 每次运行时清空之前的dll文件
        new CleanWebpackPlugin({
            cleanAfterEveryBuildPatterns: [path.join(__dirname, '../dll/**/*')]
        }),
        new webpack.DllPlugin({
            // path 指定maifest文件的输出路径
            path: path.join(__dirname, '../dll/[name].manifest.json'),
            // 和library 一致，输出的manifest.json中的name值
            name: '_dll_[name]_[hash:8]'
        })
    ]
}