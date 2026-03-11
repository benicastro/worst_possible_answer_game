import React, { useState } from 'react';
import { useRoom } from '../RoomContext';
import { AppShell, ButtonRow, Panel, PromptCard, Stack } from './AppShell';
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
      title="Answer the prompt"
      role="player"
      roomCode={room.code}
      phase={room.phase}
      round={room.round}
      totalRounds={room.totalRounds}
    >
      <PromptCard prompt={room.prompt} label="Your challenge" />
      <Panel
        title={locked ? 'You are locked in' : 'Your answer'}
        description={locked ? (mePlayer.hasSkipped ? 'You skipped this one, but you still get to vote later.' : 'You are done for this round. Now wait for the reveal.') : 'You get one shot. Make it funny, bold, and obviously incorrect.'}
        emphasis="accent"
      >
        <PhaseTimer room={room} label="Submission window" />
        <div className="panel-spacer" />
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
    </AppShell>
  );
};

export default AnswerScreen;
