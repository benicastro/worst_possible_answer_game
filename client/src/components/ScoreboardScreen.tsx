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

  return (
    <AppShell
      title="Live scoreboard"
      subtitle="The ranking updates after every round so the momentum stays visible."
      role="player"
      roomCode={room.code}
      phase={room.phase}
      round={room.round}
      totalRounds={room.totalRounds}
      status={<span>Waiting for the host to launch the next prompt.</span>}
    >
      <Panel title="Standings" description="Everyone is shown, not just the leaders." emphasis="accent">
        <LeaderboardList entries={entries} />
      </Panel>
    </AppShell>
  );
};

export default ScoreboardScreen;
