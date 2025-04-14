const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    cache: false,
    entry: {
        index: './src/index.js',
        'download-button': './src/blocks/download-button/frontend.js',
        'image-compare': './src/blocks/image-compare/frontend.js',
        'reference-links': './src/blocks/reference-links/frontend.js',
        'ai-image-gallery-frontend': './src/blocks/ai-image-gallery/ai-image-gallery-frontend.js',
        style: [
            './src/blocks/download-button/style.css',
            './src/blocks/image-compare/style.css',
            './src/blocks/reference-links/style.css',
            './src/blocks/ai-image-gallery/style.scss'
        ]
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js',
        clean: true
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.css', '.scss'],
        modules: [
            path.resolve(__dirname, 'src'),
            'node_modules'
        ]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
        new DependencyExtractionWebpackPlugin()
    ],
    externals: {
        jquery: 'jQuery',
        react: 'React',
        'react-dom': 'ReactDOM',
        '@wordpress/blocks': 'wp.blocks',
        '@wordpress/block-editor': 'wp.blockEditor',
        '@wordpress/components': 'wp.components',
        '@wordpress/i18n': 'wp.i18n',
        '@wordpress/element': 'wp.element',
        '@wordpress/data': 'wp.data',
        '@wordpress/api-fetch': 'wp.apiFetch'
    }
}; 