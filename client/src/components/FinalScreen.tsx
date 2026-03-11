import React from 'react';
import { useRoom } from '../RoomContext';
import { AppShell, LeaderboardList, Panel } from './AppShell';

const FinalScreen: React.FC = () => {
  const { state, mePlayer } = useRoom();
  const room = state.room;

  if (!room) {
    return null;
  }

  const players = [...room.players].sort((left, right) => right.score - left.score);
  const winner = players[0];

  return (
    <AppShell
      title="Game over"
      subtitle={winner ? `${winner.name} takes the crown for worst possible brilliance.` : 'The game has ended.'}
      role="player"
      roomCode={room.code}
      phase={room.phase}
      round={room.round}
      totalRounds={room.totalRounds}
      status={<span>Thanks for playing. The host can reopen the room later.</span>}
    >
      <div className="split-layout">
        <Panel title="Winner" description="The final ranking is locked." emphasis="accent">
          <div className="hero-callout">
            <div className="hero-callout__label">Champion of terrible ideas</div>
            <div className="hero-callout__value">{winner?.name ?? 'Nobody yet'}</div>
          </div>
        </Panel>
        <Panel title="Final leaderboard" emphasis="soft">
          <LeaderboardList
            entries={players.map((player) => ({
              id: player.id,
              name: player.name,
              score: player.score,
              highlight: player.id === mePlayer?.id
            }))}
          />
        </Panel>
      </div>
    </AppShell>
  );
};

export default FinalScreen;
