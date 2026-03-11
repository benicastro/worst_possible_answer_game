import React from 'react';
import { useRoom } from '../RoomContext';
import { AppShell, LeaderboardList, Panel } from './AppShell';

const HostFinalScreen: React.FC = () => {
  const { state } = useRoom();
  const room = state.room;

  if (!room) {
    return null;
  }

  const players = [...room.players].sort((left, right) => right.score - left.score);
  const winner = players[0];

  return (
    <AppShell
      title="Session complete"
      subtitle={winner ? `${winner.name} finished on top.` : 'The game has ended.'}
      role="host"
      roomCode={room.code}
      phase={room.phase}
      round={room.round}
      totalRounds={room.totalRounds}
      status={<span>The room can remain open while everyone reviews the final board.</span>}
    >
      <div className="split-layout">
        <Panel title="Winner" emphasis="accent">
          <div className="hero-callout">
            <div className="hero-callout__label">Best bad answer energy</div>
            <div className="hero-callout__value">{winner?.name ?? 'Nobody yet'}</div>
          </div>
        </Panel>
        <Panel title="Final leaderboard" emphasis="soft">
          <LeaderboardList
            entries={players.map((player) => ({
              id: player.id,
              name: player.name,
              score: player.score
            }))}
          />
        </Panel>
      </div>
    </AppShell>
  );
};

export default HostFinalScreen;
