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
      title="The room is filling up"
      subtitle="Get comfortable. The host will kick off the first prompt when the team is ready."
      role="player"
      roomCode={room.code}
      phase={room.phase}
      round={room.round}
      totalRounds={room.totalRounds}
      status={<span>You are signed in as <strong>{mePlayer?.name}</strong>.</span>}
    >
      <div className="split-layout">
        <Panel title="Room status" description="Everyone here will jump into the first round together." emphasis="accent">
          <StatGrid>
            <StatCard label="Players joined" value={room.players.length} />
            <StatCard label="Rounds planned" value={room.totalRounds} />
          </StatGrid>
        </Panel>
        <Panel title="Who is in" description="Your name stays highlighted so you can find yourself quickly." emphasis="soft">
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
