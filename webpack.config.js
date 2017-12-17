const path = require('path');

module.exports = {

    entry: {
        bundle: './src/main.js',
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },

    resolve: {
        extensions: ['', '.js']
    },

    module: {
        loaders: [
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.png$/, loader: 'url-loader?limit=100000' },
            {
                loader: 'babel-loader',

                // Skip any files outside of your project's `src` directory
                exclude: [
                    path.resolve(__dirname, 'node_modules')
                ],

                // Options to configure babel with
                query: {
                    plugins: ['transform-class-properties'],
                    presets: ['es2015']
                }
            }
        ]
    }
};
