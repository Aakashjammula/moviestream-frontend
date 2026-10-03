// Where the backend lives. The frontend is static (Vercel); the API and video come from
// the home server through the Cloudflare Tunnel, e.g. https://movies-api.aakashjammula.com.
// Both are on the same site, so the backend's SameSite=Lax login cookie works.
export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

/** Absolute URL for an API path, for fetch() and for <video>/<img> src. */
export const apiUrl = (path: string) => API_URL + path;

/** Fired when a request can't reach the server, so the offline screen can take over. */
export const OFFLINE_EVENT = "server-offline";

/** fetch() against the backend, always sending the login cookie. */
export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  try {
    return await fetch(apiUrl(path), { credentials: "include", ...init });
  } catch (err) {
    if (typeof window !== "undefined") window.dispatchEvent(new Event(OFFLINE_EVENT));
    throw err;
  }
}

/** Is the home server reachable right now? */
export async function serverOnline(timeoutMs = 4000): Promise<boolean> {
  try {
    const res = await fetch(apiUrl("/health"), { cache: "no-store", signal: AbortSignal.timeout(timeoutMs) });
    return res.ok;
  } catch {
    return false;
  }
}
