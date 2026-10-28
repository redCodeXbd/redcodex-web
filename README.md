# Red Codex web

Public landing pages for Red Codex. Angular 18, Tailwind 3, lucide icons. Not part of the Fuse app in `../frontend`.

    npm start          # http://localhost:4300
    npm run build      # dist/web/browser

Backend and ERP-app URLs: `src/app/config.ts` (override at runtime with `window.RCX_API_URL` / `window.RCX_APP_URL`).
Text and lists live in `src/app/content.ts`; one component per section in `src/app/sections/`.
