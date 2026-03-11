import React from 'react';
import { useRoom } from '../RoomContext';
import { AppShell, Panel } from './AppShell';

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
        <div className="compact-strip">
          <div className="compact-strip__item">
            <span className="compact-strip__label">Phase</span>
            <strong>{room?.phase ?? 'Unknown'}</strong>
          </div>
          <div className="compact-strip__item">
            <span className="compact-strip__label">Round</span>
            <strong>{room ? `${room.round}/${room.totalRounds}` : '-'}</strong>
          </div>
        </div>
        <div className="panel-spacer">
          <div className="callout">Sit back for this round, watch the flow, and you will be fully active when the next prompt begins.</div>
        </div>
      </Panel>
    </AppShell>
  );
};

export default LateJoinScreen;
