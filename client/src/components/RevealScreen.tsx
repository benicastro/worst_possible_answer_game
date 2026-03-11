import React from 'react';
import { useRoom } from '../RoomContext';
import { AppShell, Panel } from './AppShell';

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
    >
      <div className="split-layout split-layout--cinema">
        <Panel title="On stage now" description="This is the current answer the room is reacting to." emphasis="accent">
          {latestReveal ? (
            <div className="spotlight-card">
              <div className="show-stamp">Freshly revealed</div>
              <div className="spotlight-card__tag">Newest reveal</div>
              <div className="spotlight-card__text">{latestReveal.text}</div>
            </div>
          ) : (
            <div className="spotlight-card spotlight-card--empty">
              <div className="show-stamp show-stamp--soft">Stand by</div>
              <div className="spotlight-card__tag">Curtain rising</div>
              <div className="spotlight-card__text">Waiting for the host to reveal the first answer.</div>
            </div>
          )}
        </Panel>
        <Panel title="Already revealed" description="Earlier answers stay visible while the latest one takes center stage." emphasis="default">
          <div className="callout callout--queued">
            {hiddenCount > 0 ? 'Stay ready. Another awful answer is about to land.' : 'Every answer is out. Voting is almost open.'}
          </div>
          <div className="panel-spacer" />
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
