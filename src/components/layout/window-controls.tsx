import { useState, useEffect } from 'react';
import { Minus, X, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WindowControls() {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    // Check if running in Electron
    setIsElectron(!!window.electronAPI);

    // Check if window is maximized on load
    if (window.electronAPI) {
      window.electronAPI.windowControls.isMaximized().then(setIsMaximized);

      // Listen for window state changes
      const cleanupMaximized = window.electronAPI.onWindowMaximized(() => {
        setIsMaximized(true);
      });

      const cleanupUnmaximized = window.electronAPI.onWindowUnmaximized(() => {
        setIsMaximized(false);
      });

      // Cleanup listeners on unmount
      return () => {
        cleanupMaximized();
        cleanupUnmaximized();
      };
    }
  }, []);

  const handleMinimize = async () => {
    if (window.electronAPI) {
      await window.electronAPI.windowControls.minimize();
    }
  };

  const handleMaximize = async () => {
    if (window.electronAPI) {
      await window.electronAPI.windowControls.maximize();
      const maximized = await window.electronAPI.windowControls.isMaximized();
      setIsMaximized(maximized);
    }
  };

  const handleClose = async () => {
    if (window.electronAPI) {
      await window.electronAPI.windowControls.close();
    }
  };

  // Only show controls if running in Electron
  if (!isElectron) {
    return null;
  }

  return (
    <div 
      className="flex items-center gap-1 ml-auto" 
      style={{ 
        // @ts-ignore - WebkitAppRegion is a valid CSS property for Electron
        WebkitAppRegion: 'no-drag' 
      }}
    >
      {/* Minimize Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleMinimize}
        className="h-8 w-8 p-0 hover:bg-white/20 dark:hover:bg-white/20 rounded-none text-white hover:text-white"
      >
        <Minus className="h-4 w-4" />
      </Button>

      {/* Maximize/Restore Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleMaximize}
        className="h-8 w-8 p-0 hover:bg-white/20 dark:hover:bg-white/20 rounded-none text-white hover:text-white"
      >
        {isMaximized ? (
          <Minimize2 className="h-4 w-4" />
        ) : (
          <Maximize2 className="h-4 w-4" />
        )}
      </Button>

      {/* Close Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClose}
        className="h-8 w-8 p-0 hover:bg-red-500 hover:text-white rounded-none text-white"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default WindowControls;