import React from 'react';
import { useRoom } from '../RoomContext';
import { AppShell, Panel, StatCard, StatGrid } from './AppShell';

const LobbyScreen: React.FC = () => {
  const { state, mePlayer } = useRoom();
  const room = state.room;

  if (!room) {
    return null;
  }

  return (
    <AppShell
      title="Players are gathering"
      subtitle="Stay ready. The host will launch the first prompt from their control screen."
      role="player"
      roomCode={room.code}
      phase={room.phase}
      round={room.round}
      totalRounds={room.totalRounds}
      status={<span>You are signed in as <strong>{mePlayer?.name}</strong>.</span>}
    >
      <div className="split-layout">
        <Panel title="Room status" description="Everyone here will enter the first round together." emphasis="accent">
          <StatGrid>
            <StatCard label="Players joined" value={room.players.length} />
            <StatCard label="Rounds planned" value={room.totalRounds} />
          </StatGrid>
        </Panel>
        <Panel title="Player list" description="Your name is highlighted in the room roster." emphasis="soft">
          <ul className="name-list">
            {room.players.map((player) => (
              <li key={player.id} className={player.id === mePlayer?.id ? 'name-list__item name-list__item--self' : 'name-list__item'}>
                {player.name}
                {player.id === mePlayer?.id ? ' You' : ''}
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </AppShell>
  );
};

export default LobbyScreen;
