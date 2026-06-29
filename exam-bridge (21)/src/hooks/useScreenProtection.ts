/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';

export interface ScreenProtectionOptions {
  enableBlurOnBlur?: boolean;
  enableBlurOnHide?: boolean;
  blockContextMenu?: boolean;
  blockPrint?: boolean;
}

export function useScreenProtection(options: ScreenProtectionOptions = {}) {
  const {
    enableBlurOnBlur = true,
    enableBlurOnHide = true,
    blockContextMenu = true,
    blockPrint = true,
  } = options;

  const [isProtected, setIsProtected] = useState(false);
  const [screenshotAttempted, setScreenshotAttempted] = useState(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && enableBlurOnHide) {
        setIsProtected(true);
      } else if (document.visibilityState === 'visible') {
        // Keep a short delay to ensure rendering catches up smoothly
        setTimeout(() => {
          setIsProtected(false);
        }, 300);
      }
    };

    const handleWindowBlur = () => {
      if (enableBlurOnBlur) {
        setIsProtected(true);
      }
    };

    const handleWindowFocus = () => {
      setIsProtected(false);
    };

    const handleContextMenu = (e: MouseEvent) => {
      if (blockContextMenu) {
        e.preventDefault();
      }
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      // Silence is golden, just block it
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Block Print Screen
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        setScreenshotAttempted(true);
        setIsProtected(true);
        setTimeout(() => {
          setIsProtected(false);
          setScreenshotAttempted(false);
        }, 3000);
        return;
      }

      // Block Ctrl+P / Cmd+P (Print)
      if (blockPrint && (e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        alert('Printing and saving pages is disabled to protect exam integrity.');
      }

      // Block Cmd+Shift+3, Cmd+Shift+4, Cmd+Shift+5, Win+Shift+S (Screenshot triggers)
      // Browsers can't fully block OS-level screenshots, but we can detect key downs
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === 's' || e.key === 'S')) {
        setScreenshotAttempted(true);
        setIsProtected(true);
        setTimeout(() => {
          setIsProtected(false);
          setScreenshotAttempted(false);
        }, 3500);
      }
    };

    // Attach event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    
    if (blockContextMenu) {
      document.addEventListener('contextmenu', handleContextMenu);
    }
    
    document.addEventListener('copy', handleCopy);
    document.addEventListener('keydown', handleKeyDown);

    // Style cleanup for printing
    const styleElement = document.createElement('style');
    if (blockPrint) {
      styleElement.innerHTML = `
        @media print {
          body {
            display: none !important;
          }
          html {
            display: none !important;
          }
        }
      `;
      document.head.appendChild(styleElement);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      if (blockContextMenu) {
        document.removeEventListener('contextmenu', handleContextMenu);
      }
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('keydown', handleKeyDown);
      if (blockPrint && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, [enableBlurOnBlur, enableBlurOnHide, blockContextMenu, blockPrint]);

  return {
    isProtected,
    screenshotAttempted,
    resetProtection: () => {
      setIsProtected(false);
      setScreenshotAttempted(false);
    }
  };
}
