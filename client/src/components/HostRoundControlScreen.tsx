import React from 'react';
import { useRoom } from '../RoomContext';
import { AppShell, ButtonRow, Panel, StatCard, StatGrid } from './AppShell';
import { PhaseTimer } from './PhaseTimer';

const HostRoundControlScreen: React.FC = () => {
  const { state, revealNext, openVoting, advanceToResults, advanceToScoreboard } = useRoom();
  const room = state.room;

  if (!room) {
    return null;
  }

  const submittedCount = room.players.filter((player) => player.isActive && player.hasSubmitted).length;
  const skippedCount = room.players.filter((player) => player.isActive && player.hasSkipped).length;
  const votedCount = room.players.filter((player) => player.isActive && player.hasVoted).length;
  const activePlayerCount = room.players.filter((player) => player.isActive).length;
  const allRevealed = room.answers.every((answer) => answer.revealed);
  const hasAnswers = room.answers.length > 0;
  const revealedAnswers = room.answers.filter((answer) => answer.revealed);
  const nextHiddenAnswer = room.answers.find((answer) => !answer.revealed);
  const latestReveal = revealedAnswers[revealedAnswers.length - 1] ?? null;
  const earlierReveals = latestReveal ? revealedAnswers.slice(0, -1) : [];
  const allAnswersIn = room.phase === 'answering' && activePlayerCount > 0 && submittedCount === activePlayerCount;
  const allVotesIn = room.phase === 'voting' && activePlayerCount > 0 && votedCount === activePlayerCount;
  const resultRows = room.answers.map((answer) => {
    const author = room.players.find((player) => player.id === answer.playerId);
    const voteCount = room.votes.filter((vote) => vote.answerId === answer.id).length;

    return {
      answerId: answer.id,
      text: answer.text,
      author: author?.name ?? 'Unknown',
      voteCount,
      isWinner: room.lastRoundResult?.winningAnswerId === answer.id
    };
  });

  let actionBlock: React.ReactNode = null;
  if (room.phase === 'answering') {
    actionBlock = (
      <ButtonRow>
        <button className="button button--primary" onClick={revealNext}>
          Close Submissions
        </button>
      </ButtonRow>
    );
  } else if (room.phase === 'revealing') {
    actionBlock = (
      <ButtonRow>
        <button className="button button--primary" onClick={revealNext} disabled={allRevealed}>
          Reveal Next
        </button>
        <button className="button button--ghost" onClick={openVoting} disabled={!allRevealed}>
          {hasAnswers ? 'Open Voting' : 'Skip to Results'}
        </button>
      </ButtonRow>
    );
  } else if (room.phase === 'voting') {
    actionBlock = (
      <ButtonRow>
        <button className="button button--primary" onClick={advanceToResults}>
          Show Results
        </button>
      </ButtonRow>
    );
  } else if (room.phase === 'results') {
    actionBlock = (
      <ButtonRow>
        <button className="button button--primary" onClick={advanceToScoreboard}>
          Show Scoreboard
        </button>
      </ButtonRow>
    );
  }

  return (
    <AppShell
      title="Host round controls"
      subtitle={room.prompt}
      role="host"
      roomCode={room.code}
      phase={room.phase}
      round={room.round}
      totalRounds={room.totalRounds}
      status={<span>Move the room forward only when the current beat is clear.</span>}
      actions={actionBlock}
    >
      <div className={room.phase === 'revealing' ? 'host-control-layout host-control-layout--revealing' : 'split-layout'}>
        <Panel title="Current prompt" description="Keep this visible while pacing the room." emphasis="soft">
          <div className="hero-callout">
            <div className="hero-callout__label">Round {room.round} prompt</div>
            <div className="hero-callout__value hero-callout__value--prompt">{room.prompt}</div>
          </div>
        </Panel>
        <Panel title="Live counters" description="This panel tracks the current phase at a glance." emphasis="accent">
          <StatGrid>
            <StatCard label="Submitted" value={submittedCount} />
            <StatCard label="Skipped" value={skippedCount} />
            <StatCard label="Revealed" value={`${room.revealedCount}/${room.answers.length}`} />
            <StatCard label="Votes" value={votedCount} />
          </StatGrid>
          {allAnswersIn ? (
            <div className="panel-spacer">
              <div className="callout callout--success">All players have submitted or skipped. You can move on now.</div>
            </div>
          ) : null}
          {allVotesIn ? (
            <div className="panel-spacer">
              <div className="callout callout--success">All active players have voted. You can show results now.</div>
            </div>
          ) : null}
          <div className="panel-spacer">
            <PhaseTimer room={room} label={room.phase === 'voting' ? 'Voting closes in' : 'Answering closes in'} />
          </div>
        </Panel>
        <Panel title="Host notes" description="The controls change as the phase changes." emphasis="soft">
          <div className="callout">
            {room.phase === 'answering' && 'Wait for enough players to submit, then close submissions.'}
            {room.phase === 'revealing' && (hasAnswers
              ? 'Reveal all submitted answers before opening voting.'
              : 'No answers were submitted. Move straight to results.' )}
            {room.phase === 'voting' && 'Players can vote once, and never for their own answer.'}
            {room.phase === 'results' && 'Announce the winner and vote totals before moving to the scoreboard.'}
          </div>
        </Panel>
        {room.phase === 'revealing' && (
          <Panel title="Reveal stage" description="Use the latest reveal card as your main host cue." emphasis="default">
            {latestReveal ? (
              <div className="spotlight-card">
                <div className="spotlight-card__tag">Newest reveal</div>
                <div className="spotlight-card__text">{latestReveal.text}</div>
              </div>
            ) : (
              <div className="spotlight-card spotlight-card--empty">
                <div className="spotlight-card__tag">Curtain rising</div>
                <div className="spotlight-card__text">No answers have been revealed yet.</div>
              </div>
            )}
            <div className="panel-spacer">
              <div className="callout callout--queued">
                <strong>Next up:</strong>{' '}
                {nextHiddenAnswer
                  ? nextHiddenAnswer.text
                  : hasAnswers
                    ? 'All answers are revealed. You can open voting now.'
                    : 'No answers this round. Skip straight to results.'}
              </div>
            </div>
            {earlierReveals.length > 0 ? (
              <div className="panel-spacer">
                <ul className="answer-feed answer-feed--stacked">
                  {earlierReveals.slice().reverse().map((answer) => (
                    <li key={answer.id} className="answer-feed__item">
                      {answer.text}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </Panel>
        )}
        {room.phase === 'results' && (
          <Panel title="Round outcome" description="Use this summary to announce the result live." emphasis="default">
            {resultRows.length > 0 ? (
              <>
                <div className="winner-hero winner-hero--compact">
                  <div className="winner-hero__label">Round winner</div>
                  <div className="winner-hero__text">{resultRows.find((row) => row.isWinner)?.text ?? 'No winning answer this round.'}</div>
                  <div className="winner-hero__meta">
                    {(() => {
                      const winnerRow = resultRows.find((row) => row.isWinner);
                      return winnerRow ? `By ${winnerRow.author} with ${winnerRow.voteCount} votes` : 'No answers were submitted this round.';
                    })()}
                  </div>
                </div>
                <div className="panel-spacer" />
                <ul className="results-list">
                {resultRows.map((row) => (
                  <li key={row.answerId} className={row.isWinner ? 'results-list__item results-list__item--winner' : 'results-list__item'}>
                    <div className="results-list__answer">{row.text}</div>
                    <div className="results-list__meta">
                      <span>By {row.author}</span>
                      <span>{row.voteCount} votes</span>
                    </div>
                  </li>
                ))}
                </ul>
              </>
            ) : (
              <div className="callout">No answers were submitted this round.</div>
            )}
          </Panel>
        )}
      </div>
    </AppShell>
  );
};

export default HostRoundControlScreen;
