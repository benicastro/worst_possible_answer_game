import React, { useEffect, useMemo, useState } from 'react';
import { RoomState } from '@shared/types';

function getDurationSeconds(room: RoomState): number | null {
  if (room.phase === 'answering') {
    return room.answerTimerSeconds;
  }

  if (room.phase === 'voting') {
    return room.voteTimerSeconds;
  }

  return null;
}

export function usePhaseTimer(room: RoomState | null) {
  const durationSeconds = room ? getDurationSeconds(room) : null;
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    setNow(Date.now());

    if (!room || durationSeconds === null) {
      return;
    }

    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 250);

    return () => {
      window.clearInterval(interval);
    };
  }, [room?.phase, room?.phaseStartedAt, durationSeconds]);

  return useMemo(() => {
    if (!room || durationSeconds === null) {
      return null;
    }

    const endTime = room.phaseStartedAt + durationSeconds * 1000;
    const remainingMs = Math.max(0, endTime - now);
    const remainingSeconds = Math.ceil(remainingMs / 1000);
    const progress = Math.min(1, Math.max(0, remainingMs / (durationSeconds * 1000)));
    const urgency = remainingSeconds <= 5 ? 'critical' : remainingSeconds <= 10 ? 'warning' : 'calm';

    return {
      durationSeconds,
      remainingSeconds,
      progress,
      urgency
    };
  }, [durationSeconds, now, room]);
}

export const PhaseTimer: React.FC<{
  room: RoomState | null;
  label?: string;
}> = ({ room, label }) => {
  const timer = usePhaseTimer(room);

  if (!timer) {
    return null;
  }

  return (
    <div className={`timer-card timer-card--${timer.urgency}`}>
      <div className="timer-card__topline">
        <span>{label ?? 'Time left'}</span>
        <strong>{timer.remainingSeconds}s</strong>
      </div>
      <div className="timer-card__track">
        <div className="timer-card__fill" style={{ transform: `scaleX(${timer.progress})` }} />
      </div>
    </div>
  );
};
