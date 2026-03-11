import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { GameState, HostSettings, Player } from '@shared/types';
import { ServerEvents, ClientEvents } from '@shared/events';

interface RoomContextValue {
  socket: Socket | null;
  state: GameState;
  isHost: boolean;
  me: string | null;
  mePlayer: Player | null;
  createRoom: () => void;
  joinRoom: (name: string) => void;
  leaveRoom: () => void;
  startGame: (settings?: HostSettings) => void;
  submitAnswer: (answer: string) => void;
  skipAnswer: () => void;
  revealNext: () => void;
  openVoting: () => void;
  submitVote: (answerId: string) => void;
  advanceToResults: () => void;
  advanceToScoreboard: () => void;
  nextRound: () => void;
  endGame: () => void;
}

const noop = () => undefined;

const RoomContext = createContext<RoomContextValue>({
  socket: null,
  state: { room: null },
  isHost: false,
  me: null,
  mePlayer: null,
  createRoom: noop,
  joinRoom: noop,
  leaveRoom: noop,
  startGame: noop,
  submitAnswer: noop,
  skipAnswer: noop,
  revealNext: noop,
  openVoting: noop,
  submitVote: noop,
  advanceToResults: noop,
  advanceToScoreboard: noop,
  nextRound: noop,
  endGame: noop
});

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [state, setState] = useState<GameState>({ room: null });

  useEffect(() => {
    const s = io();
    setSocket(s);
    s.on(ServerEvents.StateUpdate, (newState: GameState) => {
      setState(newState);
    });

    return () => {
      s.disconnect();
    };
  }, []);

  const me = socket?.id ?? null;
  const isHost = state.room?.hostId === me;
  const mePlayer = state.room?.players.find((player) => player.id === me) ?? null;

  return (
    <RoomContext.Provider
      value={{
        socket,
        state,
        isHost,
        me,
        mePlayer,
        createRoom: () => socket?.emit(ClientEvents.CreateRoom),
        joinRoom: (name: string) => socket?.emit(ClientEvents.JoinRoom, name),
        leaveRoom: () => socket?.emit(ClientEvents.LeaveRoom),
        startGame: (settings?: HostSettings) => socket?.emit(ClientEvents.StartGame, settings),
        submitAnswer: (answer: string) => socket?.emit(ClientEvents.SubmitAnswer, answer),
        skipAnswer: () => socket?.emit(ClientEvents.SkipAnswer),
        revealNext: () => socket?.emit(ClientEvents.RevealNext),
        openVoting: () => socket?.emit(ClientEvents.OpenVoting),
        submitVote: (answerId: string) => socket?.emit(ClientEvents.SubmitVote, answerId),
        advanceToResults: () => socket?.emit(ClientEvents.AdvanceToResults),
        advanceToScoreboard: () => socket?.emit(ClientEvents.AdvanceToScoreboard),
        nextRound: () => socket?.emit(ClientEvents.NextRound),
        endGame: () => socket?.emit(ClientEvents.EndGame)
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export function useRoom() {
  return useContext(RoomContext);
}
