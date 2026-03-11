// Shared domain types between client and server

export type Phase =
  | 'lobby'
  | 'answering'
  | 'revealing'
  | 'voting'
  | 'results'
  | 'scoreboard'
  | 'final';

export interface Player {
  id: string; // socket id or generated uuid
  name: string;
  score: number;
  joinedRound: number;
  isActive: boolean;
  hasSubmitted: boolean;
  hasSkipped: boolean;
  hasVoted: boolean;
  lastRoundPoints: number;
}

export interface Answer {
  id: string;
  playerId: string;
  text: string;
  revealed: boolean;
  isSkipped: boolean;
}

export interface Vote {
  voterId: string;
  answerId: string;
}

export interface RoundResult {
  winningAnswerId: string | null;
  pointsByPlayerId: Record<string, number>;
}

export interface RoomState {
  code: string;
  hostId: string | null;
  phase: Phase;
  phaseStartedAt: number;
  round: number;
  totalRounds: number;
  prompt: string;
  players: Player[];
  answers: Answer[];
  votes: Vote[];
  answerTimerSeconds: number;
  voteTimerSeconds: number;
  revealedCount: number;
  lastRoundResult: RoundResult | null;
}

export interface GameState {
  room: RoomState | null;
}

export interface HostSettings {
  answerTimerSeconds?: number;
  voteTimerSeconds?: number;
}
