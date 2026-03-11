# Worst Possible Answer

Scaffold for a React + TypeScript + Node + Socket.IO implementation of Worst Possible Answer game.

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

## Development notes

- State lives on the server in `src/server/gameState.ts`.
- Screens are placeholders rendered based on `phase` field.
- No persistence or authentication yet.
- First connected player becomes host automatically.

This scaffold covers shared types, project layout, static screens, and basic state wiring as requested. Further work will implement game logic when required.
