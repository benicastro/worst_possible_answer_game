# Worst Possible Answer — Phase 2 UI Plan

## Purpose
This document defines the screen-by-screen UI plan for the Phase 2 implementation of **Worst Possible Answer**, a browser-based party game for virtual meetings.

This phase focuses on:
- screen definitions
- layout intent
- user actions
- transitions
- host/player separation
- component planning

This phase does **not** yet require full production polish, persistence, or advanced moderation.

---

## Product Summary
Worst Possible Answer is a host-controlled live browser game where players submit intentionally funny bad answers to prompts, then vote on their favorite revealed answer.

The game is designed for:
- virtual weekly meetings
- desktop-first use
- at least 10 players
- one host, many players
- clean and funny gameplay
- one active room for V1

---

## Global UX Principles

### 1. Fast to understand
A player should understand what to do within a few seconds on every screen.

### 2. Host-controlled pacing
The host controls progression through the game using simple actions:
- Next
- Reveal
- Vote
- Next Round

### 3. Clear phase visibility
Every screen should clearly indicate the current phase:
- Lobby
- Answering
- Revealing
- Voting
- Results
- Final

### 4. Desktop-first
The layout should work best on desktop but remain accessible on smaller screens.

### 5. Minimal clutter
Each screen should focus on one main action.

---

## Screen Inventory

### Player Screens
1. Join Screen
2. Lobby Screen
3. Answer Screen
4. Reveal Screen
5. Voting Screen
6. Round Results Screen
7. Scoreboard Screen
8. Final Winner Screen
9. Late Join Waiting Screen

### Host Screens
1. Host Lobby Screen
2. Host Round Control Screen
3. Host Results / Scoreboard Screen
4. Host Final Screen

---

# 1. Player Join Screen

## Purpose
Allow a player to enter a room and choose a locked display name.

## Main UI Elements
- game title
- short room description
- room code input
- display name input
- join button
- validation/error message area

## Behavior
- player can join through:
  - direct room link
  - or manual room code entry
- display name becomes locked after joining
- if room is invalid, show clear error
- if game is already in progress, player may still join and wait for next round

## Actions
- enter room code
- enter display name
- click Join

## Validation Rules
- room code required unless already supplied in URL
- display name required
- display name should be reasonably short
- duplicate names may either:
  - be allowed as-is for V1
  - or lightly blocked later if needed

## Transition
- if room open and pre-game: go to Player Lobby
- if room active mid-game: go to Late Join Waiting or current spectator state

---

# 2. Player Lobby Screen

## Purpose
Show joined players and wait for host to start the game.

## Main UI Elements
- room code
- player list
- waiting message
- player’s own display name highlighted
- “Waiting for host to start” indicator

## Behavior
- updates in real time as players join
- no gameplay actions yet
- player remains idle until host starts

## Actions
- no major action required
- optional leave room button can be added later

## Transition
- host starts game → Answer Screen

---

# 3. Player Answer Screen

## Purpose
Let the player read the prompt and submit one answer.

## Main UI Elements
- current round number
- prompt text
- text input / textarea
- submit button
- skip button
- countdown timer
- submission state indicator

## Behavior
- one answer per player
- player may skip round
- once submitted:
  - input becomes locked
  - show “Answer submitted”
- if skipped:
  - mark player as skipped
  - still allow voting later
- host can advance early even before timer ends

## Actions
- type answer
- submit answer
- skip round

## Rules
- max one answer
- no editing after submit for V1
- skipped players still continue to later phases

## Transition
- host closes submission / timer ends → Reveal Screen

---

# 4. Player Reveal Screen

## Purpose
Let players watch answers appear one by one without voting yet.

## Main UI Elements
- current round number
- prompt text
- revealed answers list
- unrevealed state indicator like:
  - “Waiting for next reveal...”
- reveal progress indicator:
  - e.g. “3 of 8 answers revealed”

## Behavior
- answers are shown in submission order
- answers remain anonymous
- players cannot vote yet
- all submitted answers must be revealed before voting opens

## Actions
- passive viewing only

## Transition
- host reveals all answers
- host clicks Vote
- move to Voting Screen

---

# 5. Player Voting Screen

## Purpose
Allow each player to cast one vote for their favorite answer.

## Main UI Elements
- current round number
- prompt text
- full list of revealed answers
- radio-style single-select choice
- vote button
- countdown timer
- “You cannot vote for your own answer” handling

## Behavior
- every player gets one vote
- players can vote even if they skipped submission
- self-voting is blocked
- after vote is submitted:
  - selection is locked
  - show confirmation state

## Actions
- select one answer
- submit vote

## Rules
- one vote only
- no vote changes for V1 after submission
- own answer must be disabled or clearly blocked

## Transition
- timer ends or host advances → Round Results Screen

---

# 6. Player Round Results Screen

## Purpose
Reveal round outcome and make the comedy payoff visible.

## Main UI Elements
- prompt text
- each answer card
- vote count per answer
- voter names displayed beside the chosen answer
- points earned this round
- visual highlight for winning answer

## Behavior
- answer authors are now revealed
- vote mappings become visible
- players can see who voted for which answer
- scoreboard update should be obvious

## Actions
- passive viewing only

## Transition
- host advances → Scoreboard Screen or directly to next round
- for V1, show Scoreboard Screen after every round

---

# 7. Player Scoreboard Screen

## Purpose
Show live rankings after each round.

## Main UI Elements
- round summary header
- full ranked player list
- total score for each player
- highlight current player
- current round number / total rounds

## Behavior
- show everyone, not just top 3
- ranking sorted descending by score
- ties may be handled by same score ordering, then join order or stable ordering

## Actions
- passive viewing only

## Transition
- host clicks Next Round → next Answer Screen
- after final round → Final Winner Screen

---

# 8. Player Final Winner Screen

## Purpose
End the game with a satisfying final ranking and winner reveal.

## Main UI Elements
- final winner banner
- full final leaderboard
- winner emphasized visually
- “Game Over” state
- optional message from host like “Thanks for playing” can be added later

## Behavior
- players remain in room until host resets or closes
- no extra title awards in V1

## Actions
- passive viewing only

---

# 9. Player Late Join Waiting Screen

## Purpose
Handle players who join after the game has already started.

## Main UI Elements
- current phase indicator
- message such as:
  - “You joined mid-game.”
  - “You’ll start scoring from the next round.”
- current player list
- current round indicator

## Behavior
- if join occurs during an active round:
  - late joiner observes current state
  - late joiner becomes active next round
- for V1, late joiners may remain spectator-only until next answer phase begins

## Actions
- passive viewing only

## Transition
- next round begins → Answer Screen

---

# 10. Host Lobby Screen

## Purpose
Allow host to create and manage the room before the game starts.

## Main UI Elements
- room code
- join link
- copy link button
- player list
- total players joined
- start game button
- timer setting controls
- prompt pack summary

## Behavior
- host is not a player
- host can wait for players to join
- host can configure:
  - answer timer
  - voting timer
- prompts are drawn from built-in pack

## Recommended V1 Controls
- answer timer preset:
  - 30s
  - 45s
  - 60s
- voting timer preset:
  - 15s
  - 20s
  - 30s

## Actions
- copy room link
- review players
- select timers
- start game

## Transition
- host starts game → Host Round Control Screen

---

# 11. Host Round Control Screen

## Purpose
Provide simple host-only controls for each round phase.

## Main UI Elements
- round number
- prompt text
- phase label
- player count
- submitted answer count
- skipped count
- revealed answer count
- timer state
- primary control buttons:
  - Next
  - Reveal
  - Vote
  - Next Round

## Behavior by Phase

### Answering Phase
Show:
- answer count submitted
- skip count
- timer remaining

Host can:
- wait for timer
- manually move on early

### Revealing Phase
Show:
- revealed answer count
- next hidden answer ready

Host can:
- click Reveal to show next answer

Constraint:
- Vote button remains disabled until all submitted answers are revealed

### Voting Phase
Show:
- vote count submitted
- timer remaining

Host can:
- wait
- manually advance to results if needed

### Results / Scoreboard
Host can:
- review outcome
- continue to next round
- end final game if round 10 is complete

---

# 12. Host Results / Scoreboard Screen

## Purpose
Give host a clean summary of round outcome before continuing.

## Main UI Elements
- winning answer
- full answer list
- votes per answer
- voter mapping
- updated leaderboard
- next round button

## Actions
- Next Round
- End Game if on final round

---

# 13. Host Final Screen

## Purpose
Display the end state of the game and allow room reuse later.

## Main UI Elements
- winner
- final leaderboard
- room summary
- reset/new game option for later extension
- room remains reusable in concept, but V1 may just remain open after completion

## Actions
- end session
- future enhancement: start new game in same room

---

## Suggested Layout Strategy

### Shared Layout Structure
Use a consistent app shell:
- top bar
- main content panel
- bottom action/status area

### Top Bar
- game title
- room code
- round info
- phase indicator

### Main Content
- prompt area
- answer/reveal/results content

### Bottom Area
- timer
- controls
- status messages

---

## Component Planning

### Shared Components
- `AppShell`
- `PhaseBadge`
- `RoundHeader`
- `TimerDisplay`
- `PlayerList`
- `Leaderboard`
- `AnswerCard`
- `VoteList`
- `PrimaryButton`
- `SecondaryButton`
- `StatusBanner`

### Player Components
- `JoinForm`
- `AnswerForm`
- `RevealFeed`
- `VoteForm`
- `ResultsList`

### Host Components
- `HostControls`
- `SubmissionCounter`
- `RevealController`
- `VotingProgress`
- `PromptOverview`

---

## Transitions Summary

### Standard Round Flow
1. Lobby
2. Answering
3. Revealing
4. Voting
5. Results
6. Scoreboard
7. Next round

### End Flow
- after round 10 scoreboard
- move to Final Winner Screen

---

## UI Questions Already Decided
These are locked for implementation:
- text-only prompts for V1
- host is separate from players
- answers revealed one by one
- reveal order follows submission order
- voting only after all reveals
- one vote per player
- self-voting blocked
- skipped players can still vote
- scoreboard shown after every round
- room supports late joiners
- late joiners start earning next round
- one active room only for V1
- built-in prompt pack only
- exactly 10 prompts in one game

---

## Out of Scope for Phase 2
Do not implement these yet:
- image prompts
- moderation/removal
- prompt editor UI
- multiple simultaneous rooms
- login/auth accounts
- sound effects
- avatars/emojis
- persistent history
- analytics
- chat system

---

## Deliverables for Phase 2
A successful Phase 2 should produce:
1. static screen plan
2. component structure
3. shared layout strategy
4. state requirements per screen
5. event planning for realtime implementation