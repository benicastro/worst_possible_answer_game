import React from 'react';
import { useRoom } from '../RoomContext';
import { AppShell, Panel } from './AppShell';

const ResultsScreen: React.FC = () => {
  const { state } = useRoom();
  const room = state.room;

  if (!room) {
    return null;
  }

  const voteCounts = room.answers.reduce<Record<string, number>>((accumulator, answer) => {
    accumulator[answer.id] = room.votes.filter((vote) => vote.answerId === answer.id).length;
    return accumulator;
  }, {});

  return (
    <AppShell
      title="Round results"
      subtitle={room.prompt}
      role="player"
      roomCode={room.code}
      phase={room.phase}
      round={room.round}
      totalRounds={room.totalRounds}
      status={<span>The answer authors are revealed now.</span>}
    >
      <Panel title="Who landed the best worst answer?" description="Votes and voter names are now visible." emphasis="accent">
        <ul className="results-list">
          {room.answers.map((answer) => {
            const author = room.players.find((player) => player.id === answer.playerId);
            const voters = room.votes
              .filter((vote) => vote.answerId === answer.id)
              .map((vote) => room.players.find((player) => player.id === vote.voterId)?.name ?? 'Unknown');
            const isWinner = room.lastRoundResult?.winningAnswerId === answer.id;

            return (
              <li key={answer.id} className={isWinner ? 'results-list__item results-list__item--winner' : 'results-list__item'}>
                <div className="results-list__answer">{answer.text}</div>
                <div className="results-list__meta">
                  <span>By {author?.name ?? 'Unknown'}</span>
                  <span>{voteCounts[answer.id] ?? 0} votes</span>
                </div>
                <div className="results-list__voters">{voters.length > 0 ? `Voted by ${voters.join(', ')}` : 'No votes this round'}</div>
              </li>
            );
          })}
        </ul>
      </Panel>
    </AppShell>
  );
};

export default ResultsScreen;
