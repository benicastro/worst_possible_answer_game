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

  return (
    <AppShell
      title="Watch the answers surface"
      subtitle={room.prompt}
      role="player"
      roomCode={room.code}
      phase={room.phase}
      round={room.round}
      totalRounds={room.totalRounds}
      status={<span>Answers stay anonymous until results.</span>}
    >
      <div className="split-layout">
        <Panel title="Reveal progress" description="The host reveals submissions one at a time in order." emphasis="soft">
          <StatGrid>
            <StatCard label="Revealed" value={`${room.revealedCount}/${room.answers.length}`} />
            <StatCard label="Next step" value={revealedAnswers.length < room.answers.length ? 'More reveals' : 'Voting soon'} />
          </StatGrid>
        </Panel>
        <Panel title="Answer feed" description="Sit tight until every submitted answer has been shown." emphasis="accent">
          <ul className="answer-feed">
            {revealedAnswers.map((answer) => (
              <li key={answer.id} className="answer-feed__item">
                {answer.text}
              </li>
            ))}
          </ul>
          {revealedAnswers.length < room.answers.length ? <div className="callout">Waiting for next reveal...</div> : null}
        </Panel>
      </div>
    </AppShell>
  );
};

export default RevealScreen;
