import { Answer, GameState, HostSettings, Player, RoomState } from '../shared/types.js';

const ROOM_CODE = 'ABCD';
const TOTAL_ROUNDS = 10;
const PROMPTS = [
  'What should absolutely never be said in a team standup?',
  'What is the worst possible thing to hear before a big presentation?',
  'What should never be included in a company benefits package?',
  'What is the worst subject line for an email to your boss?',
  'What should never be served at a professional networking event?',
  'What is the worst possible icebreaker question?',
  'What should never appear in a performance review?',
  'What is the worst name for a new productivity app?',
  'What should never be written on an office birthday cake?',
  'What is the worst way to end a Zoom call?'
];

const initialState: GameState = {
  room: null
};

export const state: GameState = { ...initialState };

export function createRoom(hostId: string): RoomState {
  const room: RoomState = {
    code: ROOM_CODE,
    hostId,
    phase: 'lobby',
    phaseStartedAt: Date.now(),
    round: 1,
    totalRounds: TOTAL_ROUNDS,
    prompt: '',
    players: [],
    answers: [],
    votes: [],
    answerTimerSeconds: 45,
    voteTimerSeconds: 20,
    revealedCount: 0,
    lastRoundResult: null
  };

  state.room = room;
  return room;
}

export function addPlayer(id: string, name: string): Player {
  const room = requireRoom();
  const activeInCurrentRound = room.phase === 'lobby' || room.phase === 'scoreboard' || room.phase === 'final';
  const player: Player = {
    id,
    name,
    score: 0,
    joinedRound: room.round,
    isActive: activeInCurrentRound,
    hasSubmitted: false,
    hasSkipped: false,
    hasVoted: false,
    lastRoundPoints: 0
  };

  room.players.push(player);
  return player;
}

export function removeParticipant(id: string) {
  const room = state.room;
  if (!room) {
    return;
  }

  if (room.hostId === id) {
    resetState();
    return;
  }

  const removedAnswerIds = room.answers
    .filter((answer) => answer.playerId === id)
    .map((answer) => answer.id);

  room.players = room.players.filter((player) => player.id !== id);
  room.answers = room.answers.filter((answer) => answer.playerId !== id);
  room.votes = room.votes.filter((vote) => vote.voterId !== id && !removedAnswerIds.includes(vote.answerId));
}

export function startGame(settings?: HostSettings) {
  const room = requireRoom();
  if (room.phase !== 'lobby') {
    return;
  }

  room.answerTimerSeconds = settings?.answerTimerSeconds ?? room.answerTimerSeconds;
  room.voteTimerSeconds = settings?.voteTimerSeconds ?? room.voteTimerSeconds;
  room.round = 1;
  for (const player of room.players) {
    player.score = 0;
    player.joinedRound = 1;
    player.isActive = true;
  }
  activateWaitingPlayers(room);
  prepareRound(room);
  setPhase(room, 'answering');
}

export function submitAnswer(playerId: string, text: string) {
  const room = requireRoom();
  if (room.phase !== 'answering') {
    return;
  }

  const player = getActivePlayer(playerId);
  if (!player || player.hasSubmitted || player.hasSkipped) {
    return;
  }

  const normalizedText = text.trim();
  if (!normalizedText) {
    return;
  }

  room.answers.push({
    id: `answer-${room.round}-${player.id}`,
    playerId,
    text: normalizedText,
    revealed: false,
    isSkipped: false
  });
  player.hasSubmitted = true;
}

export function skipAnswer(playerId: string) {
  if (requireRoom().phase !== 'answering') {
    return;
  }

  const player = getActivePlayer(playerId);
  if (!player || player.hasSubmitted || player.hasSkipped) {
    return;
  }

  player.hasSkipped = true;
  player.hasSubmitted = true;
}

export function closeAnswering() {
  const room = requireRoom();
  if (room.phase !== 'answering') {
    return;
  }

  setPhase(room, 'revealing');
}

export function revealNextAnswer() {
  const room = requireRoom();
  if (room.phase !== 'revealing') {
    return;
  }

  const nextAnswer = room.answers.find((answer) => !answer.revealed);
  if (!nextAnswer) {
    return;
  }

  nextAnswer.revealed = true;
  room.revealedCount += 1;
}

export function openVoting() {
  const room = requireRoom();
  if (room.phase !== 'revealing' || room.answers.length === 0 || room.answers.some((answer) => !answer.revealed)) {
    return;
  }

  setPhase(room, 'voting');
}

export function submitVote(voterId: string, answerId: string) {
  const room = requireRoom();
  if (room.phase !== 'voting') {
    return;
  }

  const voter = getActivePlayer(voterId);
  const answer = room.answers.find((candidate) => candidate.id === answerId);
  if (!voter || voter.hasVoted || !answer || answer.playerId === voterId) {
    return;
  }

  room.votes.push({ voterId, answerId });
  voter.hasVoted = true;
}

export function advanceToResults() {
  const room = requireRoom();
  if (room.phase !== 'voting' && !(room.phase === 'revealing' && room.answers.length === 0)) {
    return;
  }

  const voteCounts = new Map<string, number>();
  for (const answer of room.answers) {
    voteCounts.set(answer.id, 0);
  }

  for (const vote of room.votes) {
    voteCounts.set(vote.answerId, (voteCounts.get(vote.answerId) ?? 0) + 1);
  }

  const winner = room.answers.reduce<Answer | null>((best, answer) => {
    if (!best) {
      return answer;
    }

    const currentCount = voteCounts.get(answer.id) ?? 0;
    const bestCount = voteCounts.get(best.id) ?? 0;
    return currentCount > bestCount ? answer : best;
  }, null);

  const pointsByPlayerId: Record<string, number> = {};
  for (const player of room.players) {
    const answer = room.answers.find((candidate) => candidate.playerId === player.id);
    const points = answer ? (voteCounts.get(answer.id) ?? 0) : 0;
    pointsByPlayerId[player.id] = points;
    player.score += points;
    player.lastRoundPoints = points;
  }

  room.lastRoundResult = {
    winningAnswerId: winner?.id ?? null,
    pointsByPlayerId
  };
  setPhase(room, 'results');
}

export function advanceToScoreboard() {
  const room = requireRoom();
  if (room.phase !== 'results') {
    return;
  }

  setPhase(room, 'scoreboard');
}

export function nextRound() {
  const room = requireRoom();
  if (room.phase !== 'scoreboard') {
    return;
  }

  if (room.round >= room.totalRounds) {
    setPhase(room, 'final');
    return;
  }

  room.round += 1;
  activateWaitingPlayers(room);
  prepareRound(room);
  setPhase(room, 'answering');
}

export function endGame() {
  const room = requireRoom();
  if (room.phase === 'lobby') {
    return;
  }
  setPhase(room, 'final');
}

export function resetState() {
  state.room = null;
}

function prepareRound(room: RoomState) {
  room.prompt = PROMPTS[(room.round - 1) % PROMPTS.length];
  room.answers = [];
  room.votes = [];
  room.revealedCount = 0;
  room.lastRoundResult = null;

  for (const player of room.players) {
    player.hasSubmitted = false;
    player.hasSkipped = false;
    player.hasVoted = false;
    player.lastRoundPoints = 0;
  }
}

function activateWaitingPlayers(room: RoomState) {
  for (const player of room.players) {
    if (!player.isActive) {
      player.isActive = true;
      player.joinedRound = room.round;
    }
  }
}

function requireRoom(): RoomState {
  if (!state.room) {
    throw new Error('room not initialized');
  }

  return state.room;
}

function getActivePlayer(playerId: string): Player | undefined {
  const room = requireRoom();
  return room.players.find((player) => player.id === playerId && player.isActive);
}

function setPhase(room: RoomState, phase: RoomState['phase']) {
  room.phase = phase;
  room.phaseStartedAt = Date.now();
}
