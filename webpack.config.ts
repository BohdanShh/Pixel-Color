import CopyPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import { Configuration } from 'webpack';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';

interface EnvVariables {
  mode: 'development' | 'production';
  port: number;
}

export default (env: EnvVariables) => {
  const config: Configuration = {
    mode: env.mode || 'development',
    entry: path.resolve(__dirname, 'src', 'scripts', 'popup.ts'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[contenthash].js',
      clean: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public', 'index.html'),
      }),
      new CopyPlugin({
        patterns: [16, 32, 48, 128].map(size => ({
          from: path.resolve(__dirname, 'public', `icon-${size}x${size}.png`),
          to: path.resolve(__dirname, 'dist', 'assets'),
        })),
      }),
      new WebpackManifestPlugin({
        generate: (_, files) => {
          const { chunk } = files[0];

          return {
            manifest_version: 3,
            name: 'Pixel Color',
            description:
              'Pixel Color: Quick color picker for Chrome. Identify website colors instantly by hovering. Get precise color codes for an enhanced design experience.',
            version: '1.0',
            action: {
              default_popup: './index.html',
            },
            content_scripts: [
              {
                js: [Array.from(chunk?.files as Set<string>)[0]],
                matches: ['<all_urls>'],
              },
            ],
            icons: {
              '16': './assets/icon-16x16.png',
              '32': './assets/icon-32x32.png',
              '48': './assets/icon-48x48.png',
              '128': './assets/icon-128x128.png',
            },
          };
        },
      }),
    ],
  };

  return config;
};
