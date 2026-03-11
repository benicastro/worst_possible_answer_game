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

  return (
    <AppShell
      title="Host scoreboard"
      subtitle="Use this pause to let the room react before you move on."
      role="host"
      roomCode={room.code}
      phase={room.phase}
      round={room.round}
      totalRounds={room.totalRounds}
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
      <Panel title="Standings" description="Everyone stays visible between rounds." emphasis="accent">
        <LeaderboardList entries={entries} />
      </Panel>
    </AppShell>
  );
};

export default HostResultsScreen;
