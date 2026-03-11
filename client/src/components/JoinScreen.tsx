import React, { useState } from 'react';
import { useRoom } from '../RoomContext';
import { AppShell, ButtonRow, Panel, Stack } from './AppShell';

const JoinScreen: React.FC = () => {
  const [name, setName] = useState('');
  const { state, createRoom, joinRoom } = useRoom();
  const room = state.room;

  return (
    <AppShell
      title="A party game for gloriously bad answers"
      subtitle="A Bayanihan Partners team game: one host runs the room, everyone else submits the funniest wrong answer they can think of."
      role="guest"
      status={
        room ? (
          <span>
            Room <strong>{room.code}</strong> is live. Join from this tab as a player, or open another tab to host.
          </span>
        ) : (
          <span>Create the room here, then share the code with everyone else.</span>
        )
      }
    >
      <div className="split-layout">
        <Panel
          title="How it works"
          description="The host controls pacing. Players answer, watch reveals, vote, and climb the leaderboard."
          emphasis="soft"
        >
          <ol className="info-list">
            <li>Host creates one room.</li>
            <li>Players join with a display name.</li>
            <li>Each round moves through answer, reveal, vote, and results.</li>
          </ol>
        </Panel>
        <Panel
          title={room ? 'Join the room' : 'Open the room'}
          description={room ? 'Pick a display name. It stays locked for this session.' : 'Start the host session before players join.'}
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
