import React, { useMemo, useState } from 'react';
import { useRoom } from '../RoomContext';
import { AppShell, ButtonRow, Panel } from './AppShell';
import { PhaseTimer } from './PhaseTimer';

const VotingScreen: React.FC = () => {
  const { state, mePlayer, submitVote } = useRoom();
  const [selectedAnswerId, setSelectedAnswerId] = useState('');
  const room = state.room;

  const myAnswerId = useMemo(
    () => room?.answers.find((answer) => answer.playerId === mePlayer?.id)?.id ?? '',
    [room, mePlayer]
  );

  if (!room || !mePlayer) {
    return null;
  }

  return (
    <AppShell
      title="Choose the funniest disaster"
      subtitle={room.prompt}
      role="player"
      roomCode={room.code}
      phase={room.phase}
      round={room.round}
      totalRounds={room.totalRounds}
    >
      <Panel title="Answer list" description={mePlayer.hasVoted ? 'Your vote is locked in.' : 'Pick the answer that made you laugh the hardest.'} emphasis="accent">
        <PhaseTimer room={room} label="Voting closes in" />
        <div className="panel-spacer" />
        <ul className="vote-list">
          {room.answers.map((answer) => (
            <li key={answer.id} className={selectedAnswerId === answer.id ? 'vote-list__item vote-list__item--selected' : 'vote-list__item'}>
              <label className="vote-option">
                <input
                  type="radio"
                  name="vote"
                  value={answer.id}
                  checked={selectedAnswerId === answer.id}
                  disabled={mePlayer.hasVoted || answer.id === myAnswerId}
                  onChange={(event) => setSelectedAnswerId(event.target.value)}
                />
                <span>{answer.text}</span>
                {answer.id === myAnswerId ? <em className="vote-option__note">You wrote this one</em> : null}
              </label>
            </li>
          ))}
        </ul>
        <div className="panel-spacer" />
        {!mePlayer.hasVoted ? (
          <ButtonRow>
            <button className="button button--primary" onClick={() => submitVote(selectedAnswerId)} disabled={!selectedAnswerId}>
              Submit Vote
            </button>
          </ButtonRow>
        ) : (
          <div className="callout callout--success">Your vote is locked in.</div>
        )}
      </Panel>
    </AppShell>
  );
};

export default VotingScreen;
