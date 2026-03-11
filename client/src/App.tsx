import React from 'react';
import { useRoom } from './RoomContext';
import JoinScreen from './components/JoinScreen';
import LobbyScreen from './components/LobbyScreen';
import AnswerScreen from './components/AnswerScreen';
import RevealScreen from './components/RevealScreen';
import VotingScreen from './components/VotingScreen';
import ResultsScreen from './components/ResultsScreen';
import ScoreboardScreen from './components/ScoreboardScreen';
import FinalScreen from './components/FinalScreen';
import HostLobbyScreen from './components/HostLobbyScreen';
import HostRoundControlScreen from './components/HostRoundControlScreen';
import HostResultsScreen from './components/HostResultsScreen';
import HostFinalScreen from './components/HostFinalScreen';
import LateJoinScreen from './components/LateJoinScreen';

const App: React.FC = () => {
  const { state, isHost, mePlayer } = useRoom();
  const room = state.room;
  if (!room) {
    return <JoinScreen />;
  }

  if (!isHost && !mePlayer) {
    return <JoinScreen />;
  }

  if (!isHost && mePlayer && room.phase !== 'lobby' && !mePlayer.isActive) {
    return <LateJoinScreen />;
  }

  if (isHost) {
    switch (room.phase) {
      case 'lobby':
        return <HostLobbyScreen />;
      case 'answering':
      case 'revealing':
      case 'voting':
      case 'results':
        return <HostRoundControlScreen />;
      case 'scoreboard':
        return <HostResultsScreen />;
      case 'final':
        return <HostFinalScreen />;
      default:
        return <div>Unknown phase</div>;
    }
  }

  switch (room.phase) {
    case 'lobby':
      return <LobbyScreen />;
    case 'answering':
      return <AnswerScreen />;
    case 'revealing':
      return <RevealScreen />;
    case 'voting':
      return <VotingScreen />;
    case 'results':
      return <ResultsScreen />;
    case 'scoreboard':
      return <ScoreboardScreen />;
    case 'final':
      return <FinalScreen />;
    default:
      return <div>Unknown phase</div>;
  }
};

export default App;
