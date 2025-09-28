import { useState, useEffect } from 'react';
import { Minus, X, Maximize2, Minimize2, Expand, Shrink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function WindowControls() {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    // Check if running in Electron
    setIsElectron(!!window.electronAPI);

    // Check if window is maximized on load
    if (window.electronAPI) {
      window.electronAPI.windowControls.isMaximized().then(setIsMaximized);

      // Check if window is fullscreen on load
      if (window.electronAPI.windowControls.isFullscreen) {
        window.electronAPI.windowControls.isFullscreen().then(setIsFullscreen);
      }

      // Listen for window state changes
      const cleanupMaximized = window.electronAPI.onWindowMaximized(() => {
        setIsMaximized(true);
      });

      const cleanupUnmaximized = window.electronAPI.onWindowUnmaximized(() => {
        setIsMaximized(false);
      });

      // Listen for fullscreen state changes
      let cleanupFullscreenEnter, cleanupFullscreenLeave;
      if (window.electronAPI.onWindowFullscreenEnter) {
        cleanupFullscreenEnter = window.electronAPI.onWindowFullscreenEnter(() => {
          setIsFullscreen(true);
        });
      }

      if (window.electronAPI.onWindowFullscreenLeave) {
        cleanupFullscreenLeave = window.electronAPI.onWindowFullscreenLeave(() => {
          setIsFullscreen(false);
        });
      }

      // Cleanup listeners on unmount
      return () => {
        cleanupMaximized();
        cleanupUnmaximized();
        if (cleanupFullscreenEnter) cleanupFullscreenEnter();
        if (cleanupFullscreenLeave) cleanupFullscreenLeave();
      };
    }

    // Also listen for browser fullscreen changes (for web version)
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
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

  const handleFullscreen = async () => {
    if (window.electronAPI && window.electronAPI.windowControls.toggleFullscreen) {
      // Use Electron API if available
      await window.electronAPI.windowControls.toggleFullscreen();
      if (window.electronAPI.windowControls.isFullscreen) {
        const fullscreen = await window.electronAPI.windowControls.isFullscreen();
        setIsFullscreen(fullscreen);
      }
    } else {
      // Fallback to browser fullscreen API
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        } else {
          await document.exitFullscreen();
        }
      } catch (error) {
        console.error('Error toggling fullscreen:', error);
      }
    }
  };

  const handleClose = async () => {
    if (window.electronAPI) {
      await window.electronAPI.windowControls.close();
    }
  };

  // Show controls for both Electron and web version (for fullscreen functionality)
  const showControls = isElectron || true; // Always show for now to support web fullscreen

  if (!showControls) {
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
      {/* Fullscreen Button - Always show for web/electron compatibility */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleFullscreen}
        className="h-8 w-8 p-0 hover:bg-white/20 dark:hover:bg-white/20 rounded-none text-white hover:text-white"
        title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? (
          <Shrink className="h-4 w-4" />
        ) : (
          <Expand className="h-4 w-4" />
        )}
      </Button>

      {/* Electron-only controls */}
      {isElectron && (
        <>
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
        </>
      )}
    </div>
  );
}

export default WindowControls;