import CopyPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import { Configuration } from 'webpack';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';

import { generateManifest } from './src/configs/manifest';

type EnvVariables = {
  mode: 'development' | 'production';
  port: number;
};

export default (env: EnvVariables) => {
  const isDev = env.mode === 'development';

  const config: Configuration = {
    watch: isDev,
    mode: env.mode || 'development',
    entry: {
      popup: path.resolve(__dirname, 'src', 'scripts', 'popup.ts'),
      content: path.resolve(__dirname, 'src', 'scripts', 'content.ts'),
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[contenthash].js',
      clean: true,
    },
    devtool: isDev && 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          options: {
            transpileOnly: isDev,
          },
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        src: path.resolve(__dirname, 'src/'),
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public', 'popup.html'),
        filename: 'popup.html',
        chunks: ['popup'],
      }),
      new MiniCssExtractPlugin(),
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'public', `images`),
            to: path.resolve(__dirname, 'dist', 'images'),
          },
          {
            from: path.resolve(__dirname, 'src', 'css'),
            to: path.resolve(__dirname, 'dist', 'css'),
          },
        ],
      }),
      new WebpackManifestPlugin({ generate: generateManifest }),
    ],
  };

  return config;
};
