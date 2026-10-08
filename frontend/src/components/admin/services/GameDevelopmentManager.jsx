import React from 'react';
import { Gamepad2, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';

import aviatorImg from '../../../assets/services/aviator.png';
import teenPattiImg from '../../../assets/services/teen patti.png';
import ludoImg from '../../../assets/services/ludo.png';
import colourPredictionImg from '../../../assets/services/colour prediction.png';
import crashGameImg from '../../../assets/services/crash game.png';
import pokerImg from '../../../assets/services/poker game.png';
import rummyImg from '../../../assets/services/rummy.png';
import andarBaharImg from '../../../assets/services/andar bahar.png';
import rouletteImg from '../../../assets/services/roulette game.png';
import blackjackImg from '../../../assets/services/black jack.png';
import dragonTigerImg from '../../../assets/services/dragon tiger.png';
import matkaImg from '../../../assets/services/matka.png';
import spinWheelImg from '../../../assets/services/spin wheel.png';
import multiplayerImg from '../../../assets/services/multiplayer.png';
import unityGameImg from '../../../assets/services/unity game.png';
import baccaratImg from '../../../assets/services/Baccarat.png';

const GAMES = [
  {
    name: 'Aviator Game Development',
    category: 'Crash / Multiplier',
    color: '#EF4444',
    badge: 'HIGH DEMAND',
    desc: 'High-performance real-time Aviator game with secure backend, multiplayer functionality, and engaging crash mechanics.',
    image: aviatorImg
  },
  {
    name: 'Teen Patti Game Development',
    category: 'Card / Casino',
    color: '#8B5CF6',
    badge: 'CLASSIC CARD',
    desc: 'Immersive multiplayer Teen Patti with real-time tables, live dealer integration, and secure transactions.',
    image: teenPattiImg
  },
  {
    name: 'Ludo Game Development',
    category: 'Board / Multiplayer',
    color: '#10B981',
    badge: 'POPULAR BOARD',
    desc: 'Engaging Ludo with online multiplayer, chat, custom dice animations, and tournaments.',
    image: ludoImg
  },
  {
    name: 'Colour Prediction Game',
    category: 'Prediction / RNG',
    color: '#F59E0B',
    badge: 'FAST PACED',
    desc: 'Fast-paced prediction game with secure server backend, audited RNG, and instant results.',
    image: colourPredictionImg
  },
  {
    name: 'Crash Game Development',
    category: 'Crash / Multiplier',
    color: '#EC4899',
    badge: 'PROVABLY FAIR',
    desc: 'Real-time multiplayer crash game with provably fair cryptographic algorithms and live charts.',
    image: crashGameImg
  },
  {
    name: 'Poker Game Development',
    category: 'Card / Strategy',
    color: '#3B82F6',
    badge: 'ENTERPRISE ROOM',
    desc: 'Professional Texas Holdem and Omaha poker rooms with AI bots, multi-table tournaments, and anti-collusion.',
    image: pokerImg
  },
  {
    name: 'Rummy Game Development',
    category: 'Card / Skill',
    color: '#06B6D4',
    badge: 'SKILL GAMING',
    desc: 'Classic 13-card rummy with smart table matching, real-time leaderboard, and anti-fraud fraud detection.',
    image: rummyImg
  },
  {
    name: 'Andar Bahar Game Development',
    category: 'Indian Casino',
    color: '#84CC16',
    badge: 'LIVE DEALER',
    desc: 'Fast-deal Andar Bahar with live video stream dealer integration and provably fair certified RNG.',
    image: andarBaharImg
  },
  {
    name: 'Roulette Game Development',
    category: 'Table / Casino',
    color: '#F97316',
    badge: 'EUROPEAN / AMERICAN',
    desc: '3D animated wheel physics, realistic soundscapes, multi-bet options, and live table synchronization.',
    image: rouletteImg
  },
  {
    name: 'Blackjack Game Development',
    category: 'Card / Table',
    color: '#6366F1',
    badge: 'VEGAS RULES',
    desc: 'Standard 21 Blackjack with multi-hand play, card-counting mitigation, and split/double-down logic.',
    image: blackjackImg
  },
  {
    name: 'Dragon Tiger Game Development',
    category: 'Asian Casino',
    color: '#D946EF',
    badge: 'TWO CARD SPEED',
    desc: 'Simple, ultra-fast 2-card showdown with live broadcast feeds and automated payout settlements.',
    image: dragonTigerImg
  },
  {
    name: 'Matka Game Development',
    category: 'Number / Lottery',
    color: '#14B8A6',
    badge: 'REAL TIME DRAW',
    desc: 'Custom Matka software with automatic chart updates, multi-market bidding, and instant payout processing.',
    image: matkaImg
  },
  {
    name: 'Spin Wheel Game Development',
    category: 'Casual / Luck',
    color: '#A855F7',
    badge: 'FORTUNE WHEEL',
    desc: 'Engaging fortune wheel with configurable payout odds, vibrant particle VFX, and daily rewards.',
    image: spinWheelImg
  },
  {
    name: 'Custom Multiplayer Games',
    category: 'Custom Engine',
    color: '#0EA5E9',
    badge: 'NETWORKING CORE',
    desc: 'Custom WebSockets & WebRTC multiplayer gaming infrastructure for low-latency synchronization.',
    image: multiplayerImg
  },
  {
    name: 'Unity Game Development',
    category: 'Cross-Platform 3D',
    color: '#22C55E',
    badge: 'UNITY ENGINE',
    desc: 'High-end 2D & 3D cross-platform titles developed in Unity C# for Android, iOS, Windows, and WebGL.',
    image: unityGameImg
  },
  {
    name: 'Baccarat Game Development',
    category: 'High-Roller Card',
    color: '#EAB308',
    badge: 'PUNTO BANCO',
    desc: 'Classic VIP Baccarat with squeeze card animation, banker/player/tie side bets, and live history roadmaps.',
    image: baccaratImg
  }
];

export default function GameDevelopmentManager() {
  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100 mb-3">
            <Gamepad2 size={14} /> Interactive Gaming Capabilities
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
            Game Development Showcase (16 Titles)
          </h2>
          <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">
            These specialized gaming solutions are featured in the dedicated Game Development block on <code>/services#game-development</code> with custom responsive card animations and high-resolution art assets.
          </p>
        </div>

        <a
          href="/services"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-all cursor-pointer self-start md:self-auto"
        >
          <ExternalLink size={14} /> Preview on /services
        </a>
      </div>

      {/* 16 Game Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {GAMES.map((game, idx) => (
          <div
            key={idx}
            className="group bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_14px_45px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Game Art Container */}
              <div className="h-44 w-full bg-slate-900 relative overflow-hidden flex items-center justify-center p-3">
                <img
                  src={game.image}
                  alt={game.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-lg"
                />
                <span
                  className="absolute top-3 left-3 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border bg-white/90 backdrop-blur-md shadow-xs"
                  style={{ color: game.color, borderColor: `${game.color}30` }}
                >
                  {game.badge}
                </span>
                <span className="absolute top-3 right-3 text-[10px] font-mono text-white/70 bg-black/40 px-2 py-0.5 rounded">
                  #{idx + 1}
                </span>
              </div>

              {/* Game Details */}
              <div className="p-5">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                  {game.category}
                </div>
                <h4 className="text-base font-extrabold text-slate-900 mb-2 leading-snug">
                  {game.name}
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                  {game.desc}
                </p>
              </div>
            </div>

            {/* Bottom Status */}
            <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1.5 text-emerald-600 font-bold text-[11px]">
                <ShieldCheck size={14} /> Live on /services
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Asset Verified
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
