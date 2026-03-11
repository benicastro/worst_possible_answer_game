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
import { PhaseChangeNotice } from './components/PhaseChangeNotice';

const App: React.FC = () => {
  const { state, isHost, mePlayer, me } = useRoom();
  const room = state.room;
  let screen: React.ReactNode;

  if (!room) {
    screen = <JoinScreen />;
  } else if (!isHost && !mePlayer) {
    screen = <JoinScreen />;
  } else if (!isHost && mePlayer && room.phase !== 'lobby' && !mePlayer.isActive) {
    screen = <LateJoinScreen />;
  } else if (isHost) {
    switch (room.phase) {
      case 'lobby':
        screen = <HostLobbyScreen />;
        break;
      case 'answering':
      case 'revealing':
      case 'voting':
      case 'results':
        screen = <HostRoundControlScreen />;
        break;
      case 'scoreboard':
        screen = <HostResultsScreen />;
        break;
      case 'final':
        screen = <HostFinalScreen />;
        break;
      default:
        screen = <div>Unknown phase</div>;
    }
  } else {
    switch (room.phase) {
      case 'lobby':
        screen = <LobbyScreen />;
        break;
      case 'answering':
        screen = <AnswerScreen />;
        break;
      case 'revealing':
        screen = <RevealScreen />;
        break;
      case 'voting':
        screen = <VotingScreen />;
        break;
      case 'results':
        screen = <ResultsScreen />;
        break;
      case 'scoreboard':
        screen = <ScoreboardScreen />;
        break;
      case 'final':
        screen = <FinalScreen />;
        break;
      default:
        screen = <div>Unknown phase</div>;
    }
  }

  return (
    <>
      {screen}
      <PhaseChangeNotice state={state} isHost={isHost} me={me} />
    </>
  );
};

export default App;
