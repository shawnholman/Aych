'use strict';

var nodeExternals = require('webpack-node-externals');

module.exports = {
    mode: "development",
    entry: './src/H.ts',
    output: {
        filename: 'H.js', // <-- Important
        libraryTarget: 'this' // <-- Important
    },
    target: 'node', // <-- Important
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true
                }
            }
        ]
    },
    resolve: {
        extensions: [ '.ts', '.tsx', '.js' ]
    },
    externals: [nodeExternals()] // <-- Important
};
