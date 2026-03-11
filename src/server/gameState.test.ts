import test from 'node:test';
import assert from 'node:assert/strict';
import {
  addPlayer,
  advanceToResults,
  advanceToScoreboard,
  closeAnswering,
  createRoom,
  getEligibleVoters,
  getPhaseTimerDeadline,
  isAnsweringComplete,
  isVotingComplete,
  nextRound,
  openVoting,
  removeParticipant,
  resetState,
  revealNextAnswer,
  skipAnswer,
  startGame,
  state,
  submitAnswer,
  submitVote
} from './gameState.js';

test.afterEach(() => {
  resetState();
});

test('startGame only works from lobby and resets scores', () => {
  createRoom('host-1');
  addPlayer('player-1', 'Alex');
  addPlayer('player-2', 'Sam');

  state.room!.players[0].score = 7;
  startGame();
  assert.equal(state.room?.phase, 'answering');
  assert.equal(state.room?.players[0].score, 0);

  submitAnswer('player-1', 'Bad idea');
  startGame();
  assert.equal(state.room?.phase, 'answering');
  assert.equal(state.room?.answers.length, 1);
});

test('blank answers are rejected server-side', () => {
  createRoom('host-1');
  addPlayer('player-1', 'Alex');
  startGame();

  submitAnswer('player-1', '   ');

  assert.equal(state.room?.answers.length, 0);
  assert.equal(state.room?.players[0].hasSubmitted, false);
});

test('removing a player also removes votes for their deleted answer', () => {
  createRoom('host-1');
  addPlayer('player-1', 'Alex');
  addPlayer('player-2', 'Sam');
  startGame();

  submitAnswer('player-1', 'Answer one');
  submitAnswer('player-2', 'Answer two');
  closeAnswering();
  revealNextAnswer();
  revealNextAnswer();
  openVoting();
  submitVote('player-2', state.room!.answers[0].id);

  removeParticipant('player-1');

  assert.equal(state.room?.answers.length, 1);
  assert.equal(state.room?.votes.length, 0);
});

test('zero-answer rounds do not open voting and can still resolve to results', () => {
  createRoom('host-1');
  addPlayer('player-1', 'Alex');
  addPlayer('player-2', 'Sam');
  startGame();

  skipAnswer('player-1');
  skipAnswer('player-2');
  closeAnswering();
  openVoting();

  assert.equal(state.room?.phase, 'revealing');

  advanceToResults();

  assert.equal(state.room?.phase, 'results');
  assert.equal(state.room?.lastRoundResult?.winningAnswerId, null);
});

test('nextRound only advances from scoreboard', () => {
  createRoom('host-1');
  addPlayer('player-1', 'Alex');
  startGame();

  nextRound();
  assert.equal(state.room?.round, 1);

  closeAnswering();
  advanceToResults();
  advanceToScoreboard();
  nextRound();
  assert.equal(state.room?.round, 2);
  assert.equal(state.room?.phase, 'answering');
});

test('answering completion only becomes true when every active player is done', () => {
  createRoom('host-1');
  addPlayer('player-1', 'Alex');
  addPlayer('player-2', 'Sam');
  startGame();

  assert.equal(isAnsweringComplete(state.room!), false);

  submitAnswer('player-1', 'Absolutely not');
  assert.equal(isAnsweringComplete(state.room!), false);

  skipAnswer('player-2');
  assert.equal(isAnsweringComplete(state.room!), true);
});

test('eligible voters exclude players who can only vote for themselves', () => {
  createRoom('host-1');
  addPlayer('player-1', 'Alex');
  startGame();

  submitAnswer('player-1', 'One terrible idea');
  closeAnswering();
  revealNextAnswer();
  openVoting();

  assert.deepEqual(getEligibleVoters(state.room!).map((player) => player.id), []);
  assert.equal(isVotingComplete(state.room!), true);
});

test('phase timer deadline tracks answering and voting windows', () => {
  createRoom('host-1');
  addPlayer('player-1', 'Alex');
  startGame({ answerTimerSeconds: 12, voteTimerSeconds: 7 });

  const answeringDeadline = getPhaseTimerDeadline(state.room!);
  assert.equal(answeringDeadline, state.room!.phaseStartedAt + 12_000);

  submitAnswer('player-1', 'Bad answer');
  closeAnswering();
  revealNextAnswer();
  openVoting();

  const votingDeadline = getPhaseTimerDeadline(state.room!);
  assert.equal(votingDeadline, state.room!.phaseStartedAt + 7_000);
});
