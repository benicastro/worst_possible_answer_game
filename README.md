# Worst Possible Answer

React + TypeScript + Node + Socket.IO implementation of a host-led party game for funny, intentionally bad answers.

## Structure

- `src/shared`: shared TypeScript types and event names used by both client and server.
- `src/server`: backend Express + Socket.IO server with in-memory state.
- `client`: front‑end React application built with Vite.

## Getting Started

```bash
npm install
npm run dev    # starts both server (4000) and client (3000)
```

The client proxy is configured to forward Socket.IO traffic to the server. Open `http://localhost:3000`.

## Deploying To Render

This repo can be deployed as a single Node web service because the Express server serves the built client and Socket.IO on the same host.

Recommended Render setup:

- Runtime: `Node`
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Health check path: `/health`

You can either:

- create the service manually in Render using those settings, or
- let Render read [`render.yaml`](./render.yaml)

Environment notes:

- `PORT` is provided by Render automatically
- `CORS_ORIGIN` is optional
- if `CORS_ORIGIN` is not set, the server falls back to `RENDER_EXTERNAL_URL`, then `*`

## Development notes

- State lives on the server in `src/server/gameState.ts`.
- No persistence or authentication yet.
- Room state is currently stored in memory, so a server restart clears the active game.
- This is suitable for single-instance MVP use, but not yet for multi-instance scaling.
