import React from 'react';
import { useRoom } from '../RoomContext';
import { AppShell, ButtonRow, LeaderboardList, Panel } from './AppShell';

const HostResultsScreen: React.FC = () => {
  const { state, nextRound, endGame } = useRoom();
  const room = state.room;

  if (!room) {
    return null;
  }

  const isLastRound = room.round >= room.totalRounds;
  const entries = [...room.players]
    .sort((left, right) => right.score - left.score)
    .map((player) => ({
      id: player.id,
      name: player.name,
      score: player.score,
      detail: `+${player.lastRoundPoints} this round`
    }));
  const podium = entries.slice(0, 3);
  const rest = entries.slice(3);
  const currentLeader = entries[0];

  return (
    <AppShell
      title="Host scoreboard"
      subtitle="Let the room react, then either launch the next round or close the session."
      role="host"
      roomCode={room.code}
      phase={room.phase}
      round={room.round}
      totalRounds={room.totalRounds}
      status={<span>{currentLeader ? `${currentLeader.name} is leading with ${currentLeader.score} points.` : 'No leader yet.'}</span>}
      actions={
        <ButtonRow>
          {isLastRound ? (
            <button className="button button--primary" onClick={endGame}>
              End Game
            </button>
          ) : (
            <button className="button button--primary" onClick={nextRound}>
              Next Round
            </button>
          )}
        </ButtonRow>
      }
    >
      <div className="split-layout split-layout--cinema">
        <Panel title="Podium" description="This is the host-friendly snapshot to announce out loud." emphasis="accent">
          <div className="podium">
            {podium.map((entry, index) => (
              <div key={entry.id} className={`podium__card podium__card--${index === 0 ? 'first' : index === 1 ? 'second' : 'third'}`}>
                <div className="podium__place">#{index + 1}</div>
                <div className="podium__name">{entry.name}</div>
                <div className="podium__detail">{entry.detail}</div>
                <div className="podium__score">{entry.score}</div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Full standings" description="Everyone stays visible between rounds." emphasis="default">
          {rest.length > 0 ? <LeaderboardList entries={rest} /> : <div className="callout">The full room is already on the podium.</div>}
        </Panel>
      </div>
    </AppShell>
  );
};

export default HostResultsScreen;
