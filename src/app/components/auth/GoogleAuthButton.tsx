import { useEffect, useRef, useState } from "react";
import "../../../css/google.scss";

type GoogleCredentialResponse = {
  credential?: string;
};

type GoogleAccounts = {
  id: {
    initialize: (options: {
      client_id: string;
      callback: (response: GoogleCredentialResponse) => void;
    }) => void;
    renderButton: (
      parent: HTMLElement,
      options: {
        theme: "outline";
        size: "large";
        shape: "rectangular";
        text: "continue_with";
        width: number;
      },
    ) => void;
  };
};

declare global {
  interface Window {
    google?: { accounts: GoogleAccounts };
  }
}

let googleScriptPromise: Promise<void> | null = null;

function loadGoogleIdentityScript() {
  if (window.google?.accounts.id) return Promise.resolve();
  if (googleScriptPromise) return googleScriptPromise;

  googleScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]',
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Google sign-in could not be loaded.")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Google sign-in could not be loaded."));
    document.head.appendChild(script);
  });

  return googleScriptPromise;
}

type GoogleAuthButtonProps = {
  disabled?: boolean;
  onCredential: (credential: string) => void;
  onError: (message: string) => void;
};

export function GoogleAuthButton({
  disabled = false,
  onCredential,
  onError,
}: GoogleAuthButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  useEffect(() => {
    let isMounted = true;

    if (!clientId) {
      onError("Google sign-in is not configured yet.");
      return undefined;
    }

    loadGoogleIdentityScript()
      .then(() => {
        if (!isMounted || !window.google?.accounts.id || !buttonRef.current) {
          return;
        }

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (!response.credential) {
              onError("Google did not return a sign-in credential.");
              return;
            }

            onCredential(response.credential);
          },
        });

        buttonRef.current.replaceChildren();
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          shape: "rectangular",
          text: "continue_with",
          width: 400,
        });
        setIsReady(true);
      })
      .catch((error: unknown) => {
        if (isMounted) {
          onError(
            error instanceof Error
              ? error.message
              : "Google sign-in could not be loaded.",
          );
        }
      });

    return () => {
      isMounted = false;
    };
  }, [clientId, onCredential, onError]);

  return (
    <div className="mnshop-google-auth" aria-busy={!isReady || disabled}>
      <div className="mnshop-google-auth__divider" aria-hidden="true">
        <span />
        <b>or continue with</b>
        <span />
      </div>
      <div
        className={
          disabled
            ? "mnshop-google-auth__button is-disabled"
            : "mnshop-google-auth__button"
        }
        ref={buttonRef}
      />
    </div>
  );
}
