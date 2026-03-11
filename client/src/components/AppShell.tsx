import React from 'react';
import { Phase } from '@shared/types';
import bpLogo from '../assets/bp-logo.png';

const PHASE_LABELS: Record<Phase, string> = {
  lobby: 'Lobby',
  answering: 'Answering',
  revealing: 'Reveal',
  voting: 'Voting',
  results: 'Results',
  scoreboard: 'Scoreboard',
  final: 'Finale'
};

const PHASE_VIBES: Record<'host' | 'player' | 'guest', Partial<Record<Phase, string>>> = {
  host: {
    lobby: 'You are setting the room',
    answering: 'Guide the round',
    revealing: 'Control the reveal beat',
    voting: 'Watch the room decide',
    results: 'Announce the payoff',
    scoreboard: 'Reset the energy',
    final: 'Close the show'
  },
  player: {
    lobby: 'Get ready to play',
    answering: 'Pens out',
    revealing: 'Curtain up',
    voting: 'Choose your favorite',
    results: 'Big payoff',
    scoreboard: 'Climbing',
    final: 'Crowning'
  },
  guest: {
    lobby: 'Room open',
    answering: 'Room open',
    revealing: 'Room open',
    voting: 'Room open',
    results: 'Room open',
    scoreboard: 'Room open',
    final: 'Room open'
  }
};

interface AppShellProps {
  title: string;
  subtitle?: string;
  phase?: Phase;
  roomCode?: string;
  round?: number;
  totalRounds?: number;
  role?: 'host' | 'player' | 'guest';
  status?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  title,
  subtitle,
  phase,
  roomCode,
  round,
  totalRounds,
  role = 'guest',
  status,
  actions,
  children
}) => {
  const vibe = phase ? PHASE_VIBES[role][phase] : 'Room open';
  const phaseClass = phase ? `app-shell--phase-${phase}` : 'app-shell--phase-idle';

  return (
    <div className={`app-shell app-shell--${role} ${phaseClass}`}>
      <div className="scene scene--left">
        <div className="scene__blob scene__blob--mint" />
        <div className="scene__blob scene__blob--peach" />
        <div className="scene__sticker">ha!</div>
      </div>
      <div className="scene scene--right">
        <div className="scene__blob scene__blob--sky" />
        <div className="scene__blob scene__blob--butter" />
        <div className="scene__sticker scene__sticker--alt">oops</div>
      </div>
      <main className="app-shell__frame">
        <div className="brand-ribbon">
          <div className="brand-ribbon__identity">
            <div className="brand-mark" aria-hidden="true">
              <img className="brand-mark__logo" src={bpLogo} alt="" />
            </div>
            <div>
              <div className="brand-ribbon__label">Bayanihan Partners</div>
              <div className="brand-ribbon__subtext">Collaboration-first game room experience</div>
            </div>
          </div>
          <div className="brand-ribbon__tag">Powered by the Bayanihan spirit</div>
        </div>
        <header className="hero-card">
          <div className="hero-card__copy">
            <div className="eyebrow">{role === 'host' ? 'Host Console' : role === 'player' ? 'Player View' : 'Worst Possible Answer'}</div>
            <h1>{title}</h1>
            {subtitle ? <p className="hero-card__subtitle">{subtitle}</p> : null}
          </div>
          <div className="hero-card__rail">
            <div className="badge-cluster">
              <span className={`badge badge--${role}`}>{role}</span>
              {phase ? <span className="badge">{PHASE_LABELS[phase]}</span> : null}
              {roomCode ? <span className="badge">Room {roomCode}</span> : null}
              {typeof round === 'number' && typeof totalRounds === 'number' ? (
                <span className="badge">
                  Round {round}/{totalRounds}
                </span>
              ) : null}
            </div>
            <div className="mascot-card">
              <div className="mascot-card__face">
                <span className="mascot-card__eye" />
                <span className="mascot-card__eye" />
                <span className="mascot-card__smile" />
              </div>
              <div className="mascot-card__label">{vibe}</div>
            </div>
          </div>
        </header>
        {status ? <section className="status-banner">{status}</section> : null}
        <section className="app-shell__content">{children}</section>
        {actions ? <footer className="app-shell__footer">{actions}</footer> : null}
      </main>
    </div>
  );
};

export const Panel: React.FC<{
  title?: string;
  description?: string;
  emphasis?: 'default' | 'accent' | 'soft';
  children: React.ReactNode;
}> = ({ title, description, emphasis = 'default', children }) => {
  return (
    <section className={`panel panel--${emphasis}`}>
      {(title || description) ? (
        <div className="panel__header">
          {title ? <h2 className="panel__title">{title}</h2> : null}
          {description ? <p className="panel__description">{description}</p> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
};

export const StatGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="stat-grid">{children}</div>;
};

export const StatCard: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => {
  return (
    <div className="stat-card">
      <div className="stat-card__label">{label}</div>
      <div className="stat-card__value">{value}</div>
    </div>
  );
};

export const Stack: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="stack">{children}</div>;
};

export const ButtonRow: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="button-row">{children}</div>;
};

export const LeaderboardList: React.FC<{
  entries: Array<{ id: string; name: string; score: number; detail?: string; highlight?: boolean }>;
}> = ({ entries }) => {
  return (
    <ol className="leaderboard">
      {entries.map((entry, index) => (
        <li key={entry.id} className={entry.highlight ? 'leaderboard__item leaderboard__item--highlight' : 'leaderboard__item'}>
          <div>
            <div className="leaderboard__rank">#{index + 1}</div>
            <div className="leaderboard__name">{entry.name}</div>
            {entry.detail ? <div className="leaderboard__detail">{entry.detail}</div> : null}
          </div>
          <div className="leaderboard__score">{entry.score}</div>
        </li>
      ))}
    </ol>
  );
};
