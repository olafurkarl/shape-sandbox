/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
        mainFields: ['browser', 'module', 'main'],
        plugins: [new TsconfigPathsPlugin()]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        publicPath: '/',
        contentBase: path.join(__dirname, 'dist'),
        port: 3333,
        proxy: {
            '/api': 'http://localhost:3001',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods':
                    'GET, POST, PUT, DELETE, PATCH, OPTIONS',
                'Access-Control-Allow-Headers':
                    'X-Requested-With, content-type, Authorization'
            }
        },
        historyApiFallback: {
            index: 'index.html'
        }
    }
};
