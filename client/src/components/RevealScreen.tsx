import React from 'react';
import { useRoom } from '../RoomContext';
import { AppShell, Panel, StatCard, StatGrid } from './AppShell';

const RevealScreen: React.FC = () => {
  const { state } = useRoom();
  const room = state.room;

  if (!room) {
    return null;
  }

  const revealedAnswers = room.answers.filter((answer) => answer.revealed);
  const latestReveal = revealedAnswers[revealedAnswers.length - 1] ?? null;
  const earlierReveals = latestReveal ? revealedAnswers.slice(0, -1) : [];
  const hiddenCount = room.answers.length - revealedAnswers.length;

  return (
    <AppShell
      title="The room is hearing them one by one"
      subtitle={room.prompt}
      role="player"
      roomCode={room.code}
      phase={room.phase}
      round={room.round}
      totalRounds={room.totalRounds}
      status={<span>Answers stay anonymous until results. The newest reveal gets the spotlight.</span>}
    >
      <div className="split-layout split-layout--cinema">
        <Panel title="Reveal progress" description="The host reveals submissions one at a time in order." emphasis="soft">
          <StatGrid>
            <StatCard label="Revealed" value={`${room.revealedCount}/${room.answers.length}`} />
            <StatCard label="Still hidden" value={hiddenCount} />
          </StatGrid>
          <div className="panel-spacer">
            <div className="callout callout--queued">
              {hiddenCount > 0 ? 'Stay ready. Another awful answer is about to land.' : 'Every answer is out. Voting is almost open.'}
            </div>
          </div>
        </Panel>
        <Panel title="On stage now" description="This is the current answer the room is reacting to." emphasis="accent">
          {latestReveal ? (
            <div className="spotlight-card">
              <div className="spotlight-card__tag">Newest reveal</div>
              <div className="spotlight-card__text">{latestReveal.text}</div>
            </div>
          ) : (
            <div className="spotlight-card spotlight-card--empty">
              <div className="spotlight-card__tag">Curtain rising</div>
              <div className="spotlight-card__text">Waiting for the host to reveal the first answer.</div>
            </div>
          )}
        </Panel>
        <Panel title="Already revealed" description="Earlier answers stay visible while the latest one takes center stage." emphasis="default">
          {earlierReveals.length > 0 ? (
            <ul className="answer-feed answer-feed--stacked">
              {earlierReveals.slice().reverse().map((answer) => (
                <li key={answer.id} className="answer-feed__item">
                  {answer.text}
                </li>
              ))}
            </ul>
          ) : (
            <div className="callout">Nothing else has been revealed yet.</div>
          )}
        </Panel>
      </div>
    </AppShell>
  );
};

export default RevealScreen;
