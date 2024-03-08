import type { Manifest } from 'webpack-manifest-plugin';
import type { FileDescriptor } from 'webpack-manifest-plugin/dist/helpers';

type ScriptName = 'popup' | 'content';

export function generateManifest(
  _seed: Record<string, unknown>,
  _files: FileDescriptor[],
  entries: Record<ScriptName, string[]>
): Manifest {
  return {
    manifest_version: 3,
    name: 'Pixel Color',
    description:
      'Pixel Color: Quick color picker for Chrome. Identify website colors instantly by hovering. Get precise color codes for an enhanced design experience.',
    version: '1.0.0',
    action: {
      default_popup: 'popup.html',
    },
    content_scripts: [
      {
        js: entries.content,
        matches: ['<all_urls>'],
        all_frames: true,
      },
    ],
    icons: {
      '16': 'images/icon-16x16.png',
      '32': 'images/icon-32x32.png',
      '48': 'images/icon-48x48.png',
      '128': 'images/icon-128x128.png',
    },
  };
}
