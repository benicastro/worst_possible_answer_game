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
      title="Make it confidently wrong"
      subtitle={room.prompt}
      role="player"
      roomCode={room.code}
      phase={room.phase}
      round={room.round}
      totalRounds={room.totalRounds}
      status={<span>Once you send it, that answer is locked for the round.</span>}
    >
      <div className="split-layout">
        <Panel title="Round brief" description="Aim for funny, bold, and obviously incorrect." emphasis="soft">
          <StatGrid>
            <StatCard label="Answer timer" value={`${room.answerTimerSeconds}s`} />
            <StatCard label="Players active" value={room.players.filter((player) => player.isActive).length} />
          </StatGrid>
          <div className="panel-spacer">
            <PhaseTimer room={room} label="Submission window" />
          </div>
        </Panel>
        <Panel
          title={locked ? 'You are locked in' : 'Your answer'}
          description={locked ? (mePlayer.hasSkipped ? 'You skipped this one, but you still get to vote later.' : 'You are done for this round. Now wait for the reveal.') : 'You get one shot. No edits once it is sent.'}
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
