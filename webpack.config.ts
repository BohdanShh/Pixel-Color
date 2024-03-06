import CopyPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import { Configuration } from 'webpack';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';

import { EnvVariables, ManifestOptions } from './src/types';
import { generateManifestFile } from './src/utils/generateManifestFile';

export default (env: EnvVariables) => {
  const config: Configuration = {
    mode: env.mode || 'development',
    entry: path.resolve(__dirname, 'src', 'scripts', 'popup.ts'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[contenthash].js',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public', 'popup.html'),
        filename: 'popup.html',
      }),
      new MiniCssExtractPlugin(),
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'public', `images`),
            to: path.resolve(__dirname, 'dist', 'images'),
          },
          {
            from: path.resolve(__dirname, 'src', 'css', 'popup.css'),
            to: path.resolve(__dirname, 'dist', 'css'),
          },
        ],
      }),
      new WebpackManifestPlugin({
        generate: (_, files) => {
          const { chunk } = files[0];

          const manifestOptions: ManifestOptions = {
            manifestVersion: 3,
            name: 'Pixel Color',
            description:
              'Pixel Color: Quick color picker for Chrome. Identify website colors instantly by hovering. Get precise color codes for an enhanced design experience.',
            appVersion: '1.0.0',
            defaultPopupPath: 'popup.html',
            contentScripts: {
              js: [Array.from(chunk?.files as Set<string>)[0]],
              matches: ['<all_urls>'],
            },
            icons: {
              '16': 'images/icon-16x16.png',
              '32': 'images/icon-32x32.png',
              '48': 'images/icon-48x48.png',
              '128': 'images/icon-128x128.png',
            },
          };

          return generateManifestFile(manifestOptions);
        },
      }),
    ],
  };

  return config;
};
