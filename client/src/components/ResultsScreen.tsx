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
  const winner = room.answers.find((answer) => answer.id === room.lastRoundResult?.winningAnswerId) ?? null;
  const winnerAuthor = winner ? room.players.find((player) => player.id === winner.playerId) : null;
  const sortedAnswers = [...room.answers].sort((left, right) => (voteCounts[right.id] ?? 0) - (voteCounts[left.id] ?? 0));

  return (
    <AppShell
      title="That one landed"
      subtitle={room.prompt}
      role="player"
      roomCode={room.code}
      phase={room.phase}
      round={room.round}
      totalRounds={room.totalRounds}
      status={<span>The answer authors are revealed now, along with the vote totals.</span>}
    >
      <div className="split-layout split-layout--cinema">
        <Panel title="Round winner" description="The room's favorite worst answer gets the headline treatment." emphasis="accent">
          <div className="winner-hero">
            <div className="show-stamp">Crowd favorite</div>
            <div className="winner-hero__label">Top answer</div>
            <div className="winner-hero__text">{winner?.text ?? 'No winning answer this round.'}</div>
            <div className="winner-hero__meta">
              {winner ? `By ${winnerAuthor?.name ?? 'Unknown'} with ${voteCounts[winner.id] ?? 0} votes` : 'Nobody submitted an answer this round.'}
            </div>
          </div>
        </Panel>
        <Panel title="Full round breakdown" description="Votes and voter names are now visible." emphasis="default">
          <ul className="results-list">
            {sortedAnswers.map((answer) => {
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
      </div>
    </AppShell>
  );
};

export default ResultsScreen;
