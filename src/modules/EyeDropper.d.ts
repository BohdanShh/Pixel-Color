interface ColorSelectionOptions {
  signal?: AbortSignal;
}

interface ColorSelectionResult {
  sRGBHex: string;
}

declare class EyeDropper {
  constructor();

  open(options?: ColorSelectionOptions): Promise<ColorSelectionResult>;
}
