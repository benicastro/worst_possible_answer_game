import React from 'react';
import { useRoom } from '../RoomContext';
import { AppShell, LeaderboardList, Panel } from './AppShell';

const ScoreboardScreen: React.FC = () => {
  const { state, mePlayer } = useRoom();
  const room = state.room;

  if (!room) {
    return null;
  }

  const entries = [...room.players]
    .sort((left, right) => right.score - left.score)
    .map((player) => ({
      id: player.id,
      name: player.name,
      score: player.score,
      detail: `+${player.lastRoundPoints} this round`,
      highlight: player.id === mePlayer?.id
    }));
  const podium = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <AppShell
      title="The leaderboard shifts"
      subtitle="This is the score swing after the latest round."
      role="player"
      roomCode={room.code}
      phase={room.phase}
      round={room.round}
      totalRounds={room.totalRounds}
      status={<span>Waiting for the host to launch the next prompt.</span>}
    >
      <div className="split-layout split-layout--cinema">
        <Panel title="Podium" description="The round leaders get the big stage first." emphasis="accent">
          <div className="podium">
            {podium.map((entry, index) => (
              <div
                key={entry.id}
                className={`podium__card podium__card--${index === 0 ? 'first' : index === 1 ? 'second' : 'third'}${entry.highlight ? ' podium__card--highlight' : ''}`}
              >
                <div className="podium__place">#{index + 1}</div>
                <div className="podium__name">{entry.name}</div>
                <div className="podium__detail">{entry.detail}</div>
                <div className="podium__score">{entry.score}</div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Full standings" description="Everyone is still visible, not just the podium." emphasis="default">
          {rest.length > 0 ? <LeaderboardList entries={rest} /> : <div className="callout">The full room is already on the podium.</div>}
        </Panel>
      </div>
    </AppShell>
  );
};

export default ScoreboardScreen;
