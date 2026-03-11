import React from 'react';
import { useRoom } from '../RoomContext';
import { AppShell, Panel, StatCard, StatGrid } from './AppShell';

const LateJoinScreen: React.FC = () => {
  const { state, mePlayer } = useRoom();
  const room = state.room;

  return (
    <AppShell
      title="You joined mid-round"
      subtitle="You can watch the current phase, then start scoring once the next round begins."
      role="player"
      roomCode={room?.code}
      phase={room?.phase}
      round={room?.round}
      totalRounds={room?.totalRounds}
      status={<span>{mePlayer?.name} is queued for the next round.</span>}
    >
      <Panel title="Current game state" description="Late joiners are spectators until the next answer phase." emphasis="accent">
        <StatGrid>
          <StatCard label="Phase" value={room?.phase ?? 'Unknown'} />
          <StatCard label="Round" value={room ? `${room.round}/${room.totalRounds}` : '-'} />
        </StatGrid>
      </Panel>
    </AppShell>
  );
};

export default LateJoinScreen;
