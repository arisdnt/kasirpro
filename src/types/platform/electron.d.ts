export {};

declare global {
  interface Window {
    electronAPI?: {
      platform: NodeJS.Platform;
      windowControls: {
        minimize: () => Promise<void>;
        maximize: () => Promise<void>;
        close: () => Promise<void>;
        isMaximized: () => Promise<boolean>;
      };
      onWindowMaximized: (cb: () => void) => () => void;
      onWindowUnmaximized: (cb: () => void) => () => void;
      getDeviceInfo: () => Promise<any>;
      getDeviceInfoCached: () => Promise<{ data: any; fetchedAt: number } | null>;
      refreshDeviceInfo: () => Promise<boolean>;
      onDeviceInfoReady: (cb: () => void) => () => void;
    };
  }
}
