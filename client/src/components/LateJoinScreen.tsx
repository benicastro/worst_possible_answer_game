import React from 'react';
import { useRoom } from '../RoomContext';
import { AppShell, Panel, StatCard, StatGrid } from './AppShell';

const LateJoinScreen: React.FC = () => {
  const { state, mePlayer } = useRoom();
  const room = state.room;

  return (
    <AppShell
      title="You arrived mid-show"
      subtitle="You can watch this round unfold, then start earning points when the next one begins."
      role="player"
      roomCode={room?.code}
      phase={room?.phase}
      round={room?.round}
      totalRounds={room?.totalRounds}
      status={<span>{mePlayer?.name} is queued for the next round.</span>}
    >
      <Panel title="Current game state" description="Late joiners stay in spectator mode until the next answer phase begins." emphasis="accent">
        <StatGrid>
          <StatCard label="Phase" value={room?.phase ?? 'Unknown'} />
          <StatCard label="Round" value={room ? `${room.round}/${room.totalRounds}` : '-'} />
        </StatGrid>
      </Panel>
    </AppShell>
  );
};

export default LateJoinScreen;
