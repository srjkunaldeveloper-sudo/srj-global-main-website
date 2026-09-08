import { useMemo } from "react";
import Reveal from "./Reveal";
import ServiceCard from "./ServiceCard";

import aviatorImg from "../../assets/services/aviator.png";
import teenPattiImg from "../../assets/services/teen patti.png";
import ludoImg from "../../assets/services/ludo.png";
import colourPredictionImg from "../../assets/services/colour prediction.png";
import crashGameImg from "../../assets/services/crash game.png";
import pokerImg from "../../assets/services/poker game.png";
import rummyImg from "../../assets/services/rummy.png";
import andarBaharImg from "../../assets/services/andar bahar.png";
import rouletteImg from "../../assets/services/roulette game.png";
import blackjackImg from "../../assets/services/black jack.png";
import dragonTigerImg from "../../assets/services/dragon tiger.png";
import matkaImg from "../../assets/services/matka.png";
import spinWheelImg from "../../assets/services/spin wheel.png";
import multiplayerImg from "../../assets/services/multiplayer.png";
import unityGameImg from "../../assets/services/unity game.png";
import baccaratImg from "../../assets/services/Baccarat.png";

const games = [
  {
    name: "Aviator Game Development",
    desc: "High-performance real-time Aviator game with secure backend, multiplayer functionality, and engaging crash mechanics built for scale.",
    image: aviatorImg,
  },
  {
    name: "Teen Patti Game Development",
    desc: "Immersive multiplayer Teen Patti with real-time tables and secure transactions.",
    image: teenPattiImg,
  },
  {
    name: "Ludo Game Development",
    desc: "Engaging Ludo with online multiplayer, chat, and smooth animations.",
    image: ludoImg,
  },
  {
    name: "Colour Prediction Game Development",
    desc: "Fast-paced prediction game with secure backend and real-time results.",
    image: colourPredictionImg,
  },
  {
    name: "Crash Game Development",
    desc: "Real-time multiplayer crash game with provably fair algorithms.",
    image: crashGameImg,
  },
  {
    name: "Poker Game Development",
    desc: "Professional poker rooms with AI opponents and tournament modes.",
    image: pokerImg,
  },
  {
    name: "Rummy Game Development",
    desc: "Classic rummy with smart matching, leaderboard, and anti-fraud system.",
    image: rummyImg,
  },
  {
    name: "Andar Bahar Game Development",
    desc: "Fast-deal Andar Bahar with live dealer integration and secure RNG.",
    image: andarBaharImg,
  },
  {
    name: "Roulette Game Development",
    desc: "Premium roulette with 3D visuals, live rooms, and multi-language support.",
    image: rouletteImg,
  },
  {
    name: "Blackjack Game Development",
    desc: "Strategic blackjack with card counting prevention and multiplayer tables.",
    image: blackjackImg,
  },
  {
    name: "Dragon Tiger Game Development",
    desc: "Quick-result Dragon Tiger with live streaming and secure payouts.",
    image: dragonTigerImg,
  },
  {
    name: "Matka Game Development",
    desc: "Reliable Matka platform with result tracking, charts, and admin panel.",
    image: matkaImg,
  },
  {
    name: "Spin Wheel Game Development",
    desc: "Exciting spin-the-wheel with rewards system and social sharing.",
    image: spinWheelImg,
  },
  {
    name: "Multiplayer Game Development",
    desc: "Custom multiplayer games with matchmaking, voice chat, and crossplay.",
    image: multiplayerImg,
  },
  {
    name: "Unity Game Development",
    desc: "Full-cycle Unity game development for mobile, web, and desktop platforms.",
    image: unityGameImg,
  },
  {
    name: "Baccarat Game Development",
    desc: "Build a premium real-time Baccarat game with secure betting, multiplayer support, and smooth casino-grade gameplay.",
    image: baccaratImg,
  },
];

export default function GameDevelopment() {
  const openCalendly = () => {
    window.location.href = "/#contact";
  };
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: `${5 + ((i * 17 + 7) % 90)}%`,
        top: `${5 + ((i * 13 + 3) % 85)}%`,
        duration: `${8 + ((i * 3) % 14)}s`,
        delay: `${(i * 1.3) % 8}s`,
        size: `${2 + (i % 3)}px`,
      })),
    []
  );

  return (
    <section className="gd-section" id="game-development">
      {/* Background animations */}
      <div className="gd-bg" aria-hidden="true">
        <div className="gd-bg__glow gd-bg__glow--1" />
        <div className="gd-bg__glow gd-bg__glow--2" />
        <div className="gd-bg__glow gd-bg__glow--3" />
        <div className="gd-bg__grid" />
        <div className="gd-bg__beam gd-bg__beam--1" />
        <div className="gd-bg__beam gd-bg__beam--2" />
        {particles.map((p) => (
          <div
            key={p.id}
            className="gd-particle"
            style={{
              left: p.left,
              top: p.top,
              animationDuration: p.duration,
              animationDelay: p.delay,
              width: p.size,
              height: p.size,
            }}
          />
        ))}
      </div>

      <div className="services-container gd-content">
        {/* Header */}
        <div className="gd-header">
          <Reveal>
            <span className="services-eyebrow services-eyebrow--no-line gd-eyebrow" style={{ justifyContent: "center" }}>
              Game Development
            </span>
          </Reveal>
          <Reveal style={{ transitionDelay: "0.05s" }}>
            <h2 className="services-title gd-title">
              Ready to Build Your Next-Generation Games That Players Love ?
            </h2>
          </Reveal>
        </div>

        {/* Games grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {games.map((g, i) => (
              <Reveal key={g.name} style={{ transitionDelay: `${0.03 * (i % 6)}s` }}>
                <div onClick={openCalendly} role="button" tabIndex={0} className="h-full">
                  <ServiceCard 
                    service={{ title: g.name, description: g.desc, image: g.image }} 
                    index={i} 
                    categoryTitle="Game Dev" 
                  />
                </div>
              </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
