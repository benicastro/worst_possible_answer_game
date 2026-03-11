import React, { useState } from 'react';
import { useRoom } from '../RoomContext';
import { AppShell, ButtonRow, Panel, Stack } from './AppShell';

const JoinScreen: React.FC = () => {
  const [name, setName] = useState('');
  const { state, createRoom, joinRoom } = useRoom();
  const room = state.room;

  return (
    <AppShell
      title="A team game for brilliantly bad answers"
      subtitle="Built for Bayanihan Partners sessions: one host runs the room, everyone else tries to deliver the funniest wrong response."
      role="guest"
      status={
        room ? (
          <span>
            Room <strong>{room.code}</strong> is live. Join here as a player, or open another tab if you are the host.
          </span>
        ) : (
          <span>Start the room here, then invite the team in.</span>
        )
      }
    >
      <div className="split-layout">
        <Panel
          title="How the game flows"
          description="The room moves quickly. The host runs the pace, the players bring the chaos."
          emphasis="soft"
        >
          <ol className="info-list">
            <li>The host opens one shared room.</li>
            <li>Players join with a display name and stay in for the whole session.</li>
            <li>Each round moves through answer, reveal, vote, and score.</li>
          </ol>
        </Panel>
        <Panel
          title={room ? 'Join the room' : 'Open the room'}
          description={room ? 'Pick the name you want the room to know you by. It stays locked for this session.' : 'Open the host console first, then let the team pile in.'}
          emphasis="accent"
        >
          {!room ? (
            <Stack>
              <button className="button button--primary" onClick={createRoom}>
                Host Game
              </button>
            </Stack>
          ) : (
            <Stack>
              <label className="field">
                <span className="field__label">Display name</span>
                <input
                  className="field__input"
                  placeholder="Ex. The Spreadsheet Goblin"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </label>
              <ButtonRow>
                <button className="button button--primary" onClick={() => joinRoom(name.trim())} disabled={!name.trim()}>
                  Join Room
                </button>
              </ButtonRow>
            </Stack>
          )}
        </Panel>
      </div>
    </AppShell>
  );
};

export default JoinScreen;
