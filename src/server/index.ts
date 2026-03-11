import express from 'express';
import http from 'http';
import { Server as IOServer, Socket } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import {
  state,
  createRoom,
  addPlayer,
  removeParticipant,
  startGame,
  submitAnswer,
  skipAnswer,
  closeAnswering,
  revealNextAnswer,
  openVoting,
  submitVote,
  advanceToResults,
  advanceToScoreboard,
  nextRound,
  endGame
} from './gameState.js';
import { ClientEvents, ServerEvents } from '../shared/events.js';
import { HostSettings } from '../shared/types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const server = http.createServer(app);
const io = new IOServer(server, {
  cors: {
    origin: '*',
  }
});

const clientDistPath = path.join(__dirname, '../../client/dist');
const clientIndexPath = path.join(clientDistPath, 'index.html');

// serve static client build if present
app.use(express.static(clientDistPath));

app.get('/', (_req, res) => {
  if (existsSync(clientIndexPath)) {
    res.sendFile(clientIndexPath);
    return;
  }

  res.type('text/plain').send(
    'Client build not found. Run "npm run dev" for the Vite app on http://localhost:3000 or "npm run build" before using the production server.'
  );
});

app.get('*', (_req, res, next) => {
  if (existsSync(clientIndexPath)) {
    res.sendFile(clientIndexPath);
    return;
  }

  next();
});

io.on('connection', (socket: Socket) => {
  console.log('socket connected', socket.id);
  broadcastState();

  socket.on(ClientEvents.CreateRoom, () => {
    console.log('CreateRoom');
    if (!state.room) {
      createRoom(socket.id);
      broadcastState();
    }
  });

  socket.on(ClientEvents.JoinRoom, (name: string) => {
    console.log('JoinRoom', name);
    if (!state.room || state.room.players.some((player) => player.id === socket.id)) {
      return;
    }

    addPlayer(socket.id, name);
    broadcastState();
  });

  socket.on(ClientEvents.LeaveRoom, () => {
    console.log('LeaveRoom');
    removeParticipant(socket.id);
    broadcastState();
  });

  socket.on(ClientEvents.StartGame, (settings?: HostSettings) => {
    console.log('StartGame');
    if (state.room?.hostId !== socket.id || state.room.phase !== 'lobby') {
      return;
    }

    startGame(settings);
    broadcastState();
  });

  socket.on(ClientEvents.SubmitAnswer, (answer: string) => {
    console.log('SubmitAnswer');
    submitAnswer(socket.id, answer);
    broadcastState();
  });

  socket.on(ClientEvents.SkipAnswer, () => {
    console.log('SkipAnswer');
    skipAnswer(socket.id);
    broadcastState();
  });

  socket.on(ClientEvents.RevealNext, () => {
    console.log('RevealNext');
    if (state.room?.hostId !== socket.id) {
      return;
    }

    if (state.room.phase === 'answering') {
      closeAnswering();
    } else if (state.room.phase === 'revealing') {
      revealNextAnswer();
    } else {
      return;
    }

    broadcastState();
  });

  socket.on(ClientEvents.OpenVoting, () => {
    console.log('OpenVoting');
    if (state.room?.hostId !== socket.id || state.room.phase !== 'revealing') {
      return;
    }

    if (state.room.answers.length === 0) {
      advanceToResults();
      broadcastState();
      return;
    }

    openVoting();
    broadcastState();
  });

  socket.on(ClientEvents.SubmitVote, (answerId: string) => {
    console.log('SubmitVote');
    submitVote(socket.id, answerId);
    broadcastState();
  });

  socket.on(ClientEvents.AdvanceToResults, () => {
    console.log('AdvanceToResults');
    if (state.room?.hostId !== socket.id || (state.room.phase !== 'voting' && state.room.phase !== 'revealing')) {
      return;
    }

    advanceToResults();
    broadcastState();
  });

  socket.on(ClientEvents.AdvanceToScoreboard, () => {
    console.log('AdvanceToScoreboard');
    if (state.room?.hostId !== socket.id || state.room.phase !== 'results') {
      return;
    }

    advanceToScoreboard();
    broadcastState();
  });

  socket.on(ClientEvents.NextRound, () => {
    console.log('NextRound');
    if (state.room?.hostId !== socket.id || state.room.phase !== 'scoreboard') {
      return;
    }

    nextRound();
    broadcastState();
  });

  socket.on(ClientEvents.EndGame, () => {
    console.log('EndGame');
    if (state.room?.hostId !== socket.id || state.room.phase === 'lobby') {
      return;
    }

    endGame();
    broadcastState();
  });

  socket.on('disconnect', () => {
    console.log('disconnect', socket.id);
    removeParticipant(socket.id);
    broadcastState();
  });
});

function broadcastState() {
  io.emit(ServerEvents.StateUpdate, state);
}

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});
