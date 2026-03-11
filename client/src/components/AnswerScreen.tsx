import React, { useState } from 'react';
import { useRoom } from '../RoomContext';
import { AppShell, ButtonRow, Panel, StatCard, StatGrid, Stack } from './AppShell';
import { PhaseTimer } from './PhaseTimer';

const AnswerScreen: React.FC = () => {
  const { state, mePlayer, submitAnswer, skipAnswer } = useRoom();
  const [answer, setAnswer] = useState('');
  const room = state.room;

  if (!room || !mePlayer) {
    return null;
  }

  const locked = mePlayer.hasSubmitted || mePlayer.hasSkipped;

  return (
    <AppShell
      title="Write your worst possible answer"
      subtitle={room.prompt}
      role="player"
      roomCode={room.code}
      phase={room.phase}
      round={room.round}
      totalRounds={room.totalRounds}
      status={<span>Your answer locks the moment you submit it.</span>}
    >
      <div className="split-layout">
        <Panel title="Round brief" description="Aim for funny, wrong, and memorable." emphasis="soft">
          <StatGrid>
            <StatCard label="Answer timer" value={`${room.answerTimerSeconds}s`} />
            <StatCard label="Players active" value={room.players.filter((player) => player.isActive).length} />
          </StatGrid>
          <div className="panel-spacer">
            <PhaseTimer room={room} label="Submission window" />
          </div>
        </Panel>
        <Panel
          title={locked ? 'Submission locked' : 'Your answer'}
          description={locked ? (mePlayer.hasSkipped ? 'You skipped this round but can still vote later.' : 'Sit back and wait for the reveal phase.') : 'One answer only. No edits once sent.'}
          emphasis="accent"
        >
          {locked ? (
            <div className="callout callout--success">{mePlayer.hasSkipped ? 'Skipped this round.' : 'Answer submitted.'}</div>
          ) : (
            <Stack>
              <label className="field">
                <span className="field__label">Bad answer</span>
                <textarea
                  className="field__input field__input--textarea"
                  placeholder="Ex. Let's replace payroll with raffle tickets."
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                />
              </label>
              <ButtonRow>
                <button
                  className="button button--primary"
                  onClick={() => {
                    submitAnswer(answer.trim());
                    setAnswer('');
                  }}
                  disabled={!answer.trim()}
                >
                  Submit Answer
                </button>
                <button className="button button--ghost" onClick={skipAnswer}>
                  Skip Round
                </button>
              </ButtonRow>
            </Stack>
          )}
        </Panel>
      </div>
    </AppShell>
  );
};

export default AnswerScreen;
