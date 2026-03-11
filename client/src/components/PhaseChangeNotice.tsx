import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GameState, Player, RoomState } from '@shared/types';

interface PhaseNotice {
  title: string;
  detail: string;
}

function canPlayerVote(room: RoomState, player: Player | null): boolean {
  if (!player) {
    return false;
  }

  return room.answers.some((answer) => answer.playerId !== player.id);
}

function getPhaseNotice(
  previousRoom: RoomState,
  nextRoom: RoomState,
  previousPlayer: Player | null,
  isHost: boolean
): PhaseNotice | null {
  if (previousRoom.phase === nextRoom.phase) {
    return null;
  }

  if (previousRoom.phase === 'answering' && nextRoom.phase === 'revealing') {
    if (isHost) {
      return {
        title: 'Submissions closed',
        detail: 'The timer is up. Start revealing the answers to the room.'
      };
    }

    if (previousPlayer && !previousPlayer.hasSubmitted && !previousPlayer.hasSkipped) {
      return {
        title: "Time's up",
        detail: 'Submissions are closed. Watch the reveal and get ready to vote.'
      };
    }

    return {
      title: 'Reveal starting',
      detail: 'Submissions are closed. The room is about to hear the answers.'
    };
  }

  if (previousRoom.phase === 'revealing' && nextRoom.phase === 'voting') {
    return isHost
      ? {
          title: 'Voting is open',
          detail: 'All answers are out. Let the room pick a winner.'
        }
      : {
          title: 'Voting is open',
          detail: 'Choose the answer that landed best before the timer ends.'
        };
  }

  if (previousRoom.phase === 'voting' && nextRoom.phase === 'results') {
    if (isHost) {
      return {
        title: 'Voting closed',
        detail: 'Results are ready for you to announce.'
      };
    }

    if (canPlayerVote(previousRoom, previousPlayer) && previousPlayer && !previousPlayer.hasVoted) {
      return {
        title: 'Voting closed',
        detail: "Time's up. The round is moving on to results."
      };
    }

    return {
      title: 'Results are in',
      detail: 'The room has locked its votes. See how the round ended.'
    };
  }

  if (previousRoom.phase === 'results' && nextRoom.phase === 'scoreboard') {
    return {
      title: 'Scoreboard time',
      detail: 'The round is wrapped. Check how the standings changed.'
    };
  }

  if (previousRoom.phase === 'scoreboard' && nextRoom.phase === 'answering') {
    return isHost
      ? {
          title: 'Next round live',
          detail: 'A new prompt is up. The answer timer has started.'
        }
      : {
          title: 'New prompt live',
          detail: 'The next round has started. Time to answer again.'
        };
  }

  if (nextRoom.phase === 'final') {
    return {
      title: 'Final board',
      detail: 'The game is over. Time to crown the room champion.'
    };
  }

  return null;
}

export const PhaseChangeNotice: React.FC<{
  state: GameState;
  isHost: boolean;
  me: string | null;
}> = ({ state, isHost, me }) => {
  const [notice, setNotice] = useState<PhaseNotice | null>(null);
  const previousRoomRef = useRef<RoomState | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const currentPlayer = useMemo(() => {
    return state.room && me ? state.room.players.find((player) => player.id === me) ?? null : null;
  }, [me, state.room]);

  useEffect(() => {
    const nextRoom = state.room;
    const previousRoom = previousRoomRef.current;

    if (!nextRoom) {
      previousRoomRef.current = null;
      setNotice(null);
      return;
    }

    if (previousRoom) {
      const previousPlayer = me
        ? previousRoom.players.find((player) => player.id === me) ?? null
        : null;

      const nextNotice = getPhaseNotice(previousRoom, nextRoom, previousPlayer, isHost);
      if (nextNotice) {
        setNotice(nextNotice);
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = window.setTimeout(() => {
          setNotice(null);
          timeoutRef.current = null;
        }, 3200);
      }
    }

    previousRoomRef.current = nextRoom;
  }, [isHost, me, state.room]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!notice || !state.room || (!isHost && !currentPlayer)) {
    return null;
  }

  return (
    <div className="phase-notice" role="status" aria-live="polite">
      <div className="phase-notice__eyebrow">Phase update</div>
      <div className="phase-notice__title">{notice.title}</div>
      <div className="phase-notice__detail">{notice.detail}</div>
    </div>
  );
};
