export type EnvVariables = {
  mode: 'development' | 'production';
  port: number;
};

export type ManifestOptions = {
  manifestVersion: number;
  name: string;
  description: string;
  appVersion: string;
  defaultPopupPath: string;
  contentScripts: {
    js: string[];
    matches: string[];
  };
  icons: { '16': string; '32': string; '48': string; '128': string };
};
