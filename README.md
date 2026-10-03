# MovieStream frontend

The web UI for [MovieStream](https://github.com/Aakashjammula/moviestream), a self-hosted Netflix-style library.

The UI is a static Next.js export hosted on **Vercel**, so it's always reachable. The **backend and video files run on a computer at home**, behind a Cloudflare Tunnel. When the home server is off, the UI shows a "Server is offline" screen and reconnects automatically.

```
movies.aakashjammula.com      → Vercel: this repo (static files)
movies-api.aakashjammula.com  → Cloudflare Tunnel → home server: API + video
```

Both addresses are on the same site, so the backend's `SameSite=Lax` login cookie works. A `*.vercel.app` address would be cross-site, and browsers would block the cookie.
Video, posters and subtitles load **directly from the home server**, never through Vercel.

## Development

```sh
cp .env.example .env.local     # NEXT_PUBLIC_API_URL=http://localhost:8000
npm install
npm run dev                    # http://localhost:3000
```

The backend must allow `http://localhost:3000` in its `FRONTEND_ORIGINS`.

## Deploying on Vercel

1. Import this repo in Vercel (framework: Next.js). `next build` writes the static site to `out/`.
2. **Settings → Environment Variables:** `NEXT_PUBLIC_API_URL=https://movies-api.aakashjammula.com`
3. **Settings → Domains:** add `movies.aakashjammula.com`. In Cloudflare DNS, add the CNAME that Vercel shows, as **DNS only** (grey cloud).
4. On the backend, set `FRONTEND_ORIGINS=https://movies.aakashjammula.com`.
