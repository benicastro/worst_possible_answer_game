import React, { useState } from 'react';
import { useRoom } from '../RoomContext';
import { AppShell, ButtonRow, Panel, StatCard, StatGrid, Stack } from './AppShell';

const HostLobbyScreen: React.FC = () => {
  const { state, startGame } = useRoom();
  const room = state.room;
  const [answerTimerSeconds, setAnswerTimerSeconds] = useState(45);
  const [voteTimerSeconds, setVoteTimerSeconds] = useState(20);

  if (!room) {
    return null;
  }

  return (
    <AppShell
      title="You are running the room"
      subtitle="Set the pace, watch the roster, and launch the first prompt when the energy feels right."
      role="host"
      roomCode={room.code}
      phase={room.phase}
      round={room.round}
      totalRounds={room.totalRounds}
      status={<span>Share this room code with players: <strong>{room.code}</strong></span>}
      actions={
        <ButtonRow>
          <button
            className="button button--primary"
            onClick={() => startGame({ answerTimerSeconds, voteTimerSeconds })}
            disabled={room.players.length === 0}
          >
            Start Game
          </button>
        </ButtonRow>
      }
    >
      <div className="split-layout">
        <Panel title="Show settings" description="Keep it simple: one built-in prompt pack and a fixed 10-round session." emphasis="accent">
          <Stack>
            <label className="field">
              <span className="field__label">Answer timer</span>
              <select className="field__input" value={answerTimerSeconds} onChange={(event) => setAnswerTimerSeconds(Number(event.target.value))}>
                <option value={30}>30 seconds</option>
                <option value={45}>45 seconds</option>
                <option value={60}>60 seconds</option>
              </select>
            </label>
            <label className="field">
              <span className="field__label">Vote timer</span>
              <select className="field__input" value={voteTimerSeconds} onChange={(event) => setVoteTimerSeconds(Number(event.target.value))}>
                <option value={15}>15 seconds</option>
                <option value={20}>20 seconds</option>
                <option value={30}>30 seconds</option>
              </select>
            </label>
          </Stack>
        </Panel>
        <Panel title="Room roster" description="You are the facilitator, so the host stays separate from the player list." emphasis="soft">
          <StatGrid>
            <StatCard label="Players ready" value={room.players.length} />
            <StatCard label="Prompt count" value={room.totalRounds} />
          </StatGrid>
          <ul className="name-list">
            {room.players.map((player) => (
              <li key={player.id} className="name-list__item">
                {player.name}
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </AppShell>
  );
};

export default HostLobbyScreen;
