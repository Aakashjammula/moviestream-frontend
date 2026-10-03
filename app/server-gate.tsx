'use client';

// Shows a friendly "server offline" screen instead of the app whenever the home
// server (behind the Cloudflare Tunnel) can't be reached, and retries automatically.
import { useCallback, useEffect, useState } from "react";
import { OFFLINE_EVENT, serverOnline } from "./lib/api";

const RETRY_MS = 15_000;

export default function ServerGate({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"checking" | "online" | "offline">("checking");

  const check = useCallback(async () => {
    setStatus((s) => (s === "online" ? s : "checking"));
    setStatus((await serverOnline()) ? "online" : "offline");
  }, []);

  useEffect(() => {
    check();
    // A failed request elsewhere in the app means the server may have gone away: re-check.
    const onOffline = () => check();
    window.addEventListener(OFFLINE_EVENT, onOffline);
    return () => window.removeEventListener(OFFLINE_EVENT, onOffline);
  }, [check]);

  useEffect(() => {
    if (status !== "offline") return;
    const t = setInterval(check, RETRY_MS);
    return () => clearInterval(t);
  }, [status, check]);

  if (status === "online") return <>{children}</>;

  return (
    <div className="login-wrap">
      <div className="login-card offline-card" role="status" aria-live="polite">
        <div className="logo big">
          Movie<span>Stream</span>
        </div>
        {status === "checking" ? (
          <p className="login-sub">Connecting to the server…</p>
        ) : (
          <>
            <p className="offline-title">Server is offline</p>
            <p className="login-sub">
              MovieStream runs on a computer at home and is only available while it&apos;s switched on.
              This page will reconnect automatically.
            </p>
            <button className="btn-signin wide" type="button" onClick={check}>
              Try again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
