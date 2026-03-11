// shared socket event constants

export const enum ServerEvents {
  StateUpdate = 'state:update'
}

export const enum ClientEvents {
  CreateRoom = 'client:room:create',
  JoinRoom = 'client:join',
  LeaveRoom = 'client:leave',
  StartGame = 'client:start',
  SubmitAnswer = 'client:submit:answer',
  SkipAnswer = 'client:skip:answer',
  RevealNext = 'client:reveal:next',
  OpenVoting = 'client:open:voting',
  SubmitVote = 'client:submit:vote',
  AdvanceToResults = 'client:advance:results',
  AdvanceToScoreboard = 'client:advance:scoreboard',
  NextRound = 'client:next:round',
  EndGame = 'client:end:game'
}
