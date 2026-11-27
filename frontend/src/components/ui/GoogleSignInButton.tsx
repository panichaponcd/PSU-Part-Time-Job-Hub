import { FC, useEffect, useRef, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: 'standard' | 'icon';
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              logo_alignment?: 'left' | 'center';
              width?: number;
            }
          ) => void;
        };
      };
    };
  }
}

export interface GoogleSignInButtonProps {
  onCredential: (credential: string) => void;
  onError?: (message: string) => void;
  disabled?: boolean;
}

export const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({
  onCredential,
  onError,
  disabled = false,
}) => {
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const callbackRef = useRef(onCredential);
  const [sdkReady, setSdkReady] = useState(false);

  const clientId = (process.env.REACT_APP_GOOGLE_CLIENT_ID || '').trim();

  useEffect(() => {
    callbackRef.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    if (!clientId) return;

    let attempts = 0;
    const maxAttempts = 40; // Wait up to ~6 seconds for async GSI script

    const tryInit = () => {
      const gsi = window.google?.accounts?.id;
      if (!gsi || !containerRef.current) {
        return false;
      }

      gsi.initialize({
        client_id: clientId,
        callback: (response) => {
          if (response.credential) {
            callbackRef.current(response.credential);
          } else if (onError) {
            onError('Google Sign-In did not return a valid credential.');
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      containerRef.current.innerHTML = '';
      const parentWidth = containerRef.current.offsetWidth || 320;
      gsi.renderButton(containerRef.current, {
        type: 'standard',
        theme: resolvedTheme === 'dark' ? 'filled_black' : 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: Math.min(Math.max(parentWidth, 240), 400),
      });

      setSdkReady(true);
      return true;
    };

    if (tryInit()) return;

    const interval = window.setInterval(() => {
      attempts += 1;
      if (tryInit() || attempts >= maxAttempts) {
        window.clearInterval(interval);
      }
    }, 150);

    return () => window.clearInterval(interval);
  }, [clientId, resolvedTheme, onError]);

  if (!clientId) {
    return (
      <div className="w-full p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-dashed border-slate-300 dark:border-slate-700 text-center">
        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
          PSU Google Sign-In Ready
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
          Set <code className="font-mono">REACT_APP_GOOGLE_CLIENT_ID</code> in <code className="font-mono">.env</code> to activate live Google OAuth.
        </p>
      </div>
    );
  }

  return (
    <div className={`w-full flex flex-col items-center ${disabled ? 'opacity-60 pointer-events-none' : ''}`}>
      <div ref={containerRef} className="w-full flex justify-center min-h-[44px]" />
      {!sdkReady && (
        <div className="w-full h-[44px] rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
      )}
    </div>
  );
};

export default GoogleSignInButton;
