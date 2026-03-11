import React from 'react';
import { useRoom } from '../RoomContext';
import { AppShell, Panel } from './AppShell';

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
      <Panel title="Who is in the room" description="Everyone here will jump into the first round together. Your name stays highlighted so you can find yourself quickly." emphasis="accent">
        <div className="compact-strip">
          <div className="compact-strip__item">
            <span className="compact-strip__label">Players joined</span>
            <strong>{room.players.length}</strong>
          </div>
          <div className="compact-strip__item">
            <span className="compact-strip__label">Rounds planned</span>
            <strong>{room.totalRounds}</strong>
          </div>
        </div>
        <div className="panel-spacer">
          <ul className="name-list">
            {room.players.map((player) => (
              <li key={player.id} className={player.id === mePlayer?.id ? 'name-list__item name-list__item--self' : 'name-list__item'}>
                {player.name}
                {player.id === mePlayer?.id ? ' You' : ''}
              </li>
            ))}
          </ul>
        </div>
      </Panel>
    </AppShell>
  );
};

export default LobbyScreen;
