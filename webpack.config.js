var HtmlWebpackPlugin = require('html-webpack-plugin');
require('babel-polyfill');
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader')
module.exports = {
    mode: 'development',
    resolve: {
        extensions: ['.js', '.vue',],
        alias: {
            '@' : path.resolve('src')
        },
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
              },
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                use: 'babel-loader'
            },
            {
                test: /.css$/,
                use: [
                  'vue-style-loader',
                  'css-loader',
                ]
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                  {
                    loader: 'file-loader',
                  },
                ],
            },
            {
                test: /\.html$/i,
                loader: "html-loader",
            },
            
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './src/index.html',filename: "index.html"}),
        new VueLoaderPlugin()
    ],
    externals: {
        // global app config object
        config: JSON.stringify({
            apiUrl: // vtiger url
        }),
    },
}