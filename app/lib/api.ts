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

export interface ServerStatus {
  online: boolean;
  /** Server is up but the movie drive (USB HDD) isn't connected: browse yes, play no. */
  mediaMissing: boolean;
}

/** Is the home server reachable right now, and is the movie drive connected? */
export async function serverStatus(timeoutMs = 4000): Promise<ServerStatus> {
  try {
    const res = await fetch(apiUrl("/health"), { cache: "no-store", signal: AbortSignal.timeout(timeoutMs) });
    if (!res.ok) return { online: false, mediaMissing: false };
    const data = (await res.json().catch(() => ({}))) as { media?: string };
    return { online: true, mediaMissing: data.media === "missing" };
  } catch {
    return { online: false, mediaMissing: false };
  }
}
