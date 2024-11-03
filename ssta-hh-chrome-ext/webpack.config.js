const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HTMLPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        index: './src/index.tsx',
    },
    mode: 'production', // Set the mode to 'development' or 'production'
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            compilerOptions: { noEmit: false },
                        },
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'manifest.json', to: 'manifest.json' }, // Corrected path
            ],
        }),
        ...getHtmlPlugins(['index']),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        path: path.join(__dirname, 'dist'), // Corrected path
        filename: '[name].js',
    },
};

function getHtmlPlugins(chunks) {
    return chunks.map((chunk) => {
        return new HTMLPlugin({
            title: "React extension",
            template: 'index.html', // Use the created index.html as a template
            chunks: [chunk],
        });
    });
}