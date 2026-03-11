# Worst Possible Answer — Game State Spec

## Purpose
This document defines the shared game state, domain objects, and realtime event model for the V1 implementation of **Worst Possible Answer**.

The goal is to make the app easy to implement in React + TypeScript + Node + Socket.IO.

---

## Core State Design Principles

### 1. Single active room
V1 supports one active room only.

### 2. Server is source of truth
All game state should live on the server.
Clients receive updates and send actions.

### 3. Phase-driven state
The game moves through a finite set of phases:
- lobby
- answering
- revealing
- voting
- results
- scoreboard
- final

### 4. Host-controlled transitions
The host advances game flow manually, except timers may auto-complete phases.

---

## Recommended Top-Level State Shape

```ts
type GameState = {
  room: RoomState | null;
};