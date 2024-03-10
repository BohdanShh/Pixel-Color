/* eslint-disable @typescript-eslint/no-explicit-any */

export class ChromeStorageService {
  static set(key: string, value: any, callback?: () => void): void {
    chrome.storage.sync.set({ [key]: value }, callback);
  }

  static get(keys: string[], callback: (data: Record<string, any>) => void): void {
    chrome.storage.sync.get(keys, data => {
      callback(data);
    });
  }

  static remove(key: string, callback?: () => void): void {
    chrome.storage.sync.remove(key, callback);
  }

  static clear(callback?: () => void): void {
    chrome.storage.sync.clear(callback);
  }
}
