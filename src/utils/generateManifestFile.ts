import { ManifestOptions } from '@/types';

export function generateManifestFile(options: ManifestOptions) {
  const {
    manifestVersion,
    name,
    description,
    appVersion,
    defaultPopupPath,
    contentScripts,
    icons,
  } = options;

  return {
    manifest_version: manifestVersion,
    name,
    description,
    version: appVersion,
    action: {
      default_popup: defaultPopupPath,
    },
    content_scripts: [
      {
        js: contentScripts.js,
        matches: contentScripts.matches,
      },
    ],
    icons,
  };
}
