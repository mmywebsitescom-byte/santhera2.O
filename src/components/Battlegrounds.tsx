import { motion } from 'motion/react';
import { Swords, ChevronLeft, Shield, Zap, Brain, Globe, Cpu, Leaf, ArrowRight, Star, Lock } from 'lucide-react';
import { CHALLENGES } from '../data/hackfestData';
import { Challenge } from '../types';

interface BattlegroundsPageProps {
  onBack: () => void;
  onOpenRegister: (challenge?: Challenge) => void;
  isLocked?: boolean;
  lockedMessage?: string;
}

const TRACK_ICONS: Record<string, React.ReactNode> = {
  'ai-ml': <Brain className="w-7 h-7" />,
  'web-app': <Globe className="w-7 h-7" />,
  'cyber-security': <Shield className="w-7 h-7" />,
  'iot-robotics': <Cpu className="w-7 h-7" />,
  'green-tech': <Leaf className="w-7 h-7" />,
};

const DIFFICULTY_COLOR: Record<string, string> = {
  'Advanced': 'text-[#FF4655] border-[#FF4655]/60 bg-[#FF4655]/10',
  'Intermediate': 'text-[#F5D061] border-[#F5D061]/60 bg-[#F5D061]/10',
  'All Levels': 'text-[#55FF55] border-[#55FF55]/60 bg-[#55FF55]/10',
};

export default function BattlegroundsPage({ onBack, onOpenRegister, isLocked, lockedMessage }: BattlegroundsPageProps) {
  if (isLocked) {
    return (
      <div className="relative min-h-screen w-full bg-[#050608] text-[#F5F5F5] flex flex-col items-center justify-center overflow-x-hidden">
        {/* Ambient glows */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-[#FF4655]/8 blur-[160px]" />
          <div className="absolute bottom-1/3 left-0 w-[600px] h-[600px] rounded-full bg-[#D4AF37]/5 blur-[180px]" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(212,175,55,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.5) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-xl w-full mx-auto px-6 text-center flex flex-col items-center gap-6"
        >
          <div className="w-24 h-24 rounded-full bg-[#FF4655]/10 border-2 border-[#FF4655]/50 flex items-center justify-center shadow-[0_0_50px_rgba(255,70,85,0.3)] mb-2">
            <Lock className="w-10 h-10 text-[#FF4655]" />
          </div>
          <div className="space-y-1">
            <p className="font-rajdhani text-[#FF4655] text-xs tracking-[0.3em] uppercase font-bold">CLASSIFICATION: RESTRICTED</p>
            <h1 className="sf-gothic-title text-4xl sm:text-5xl sf-text-gold">Battlegrounds</h1>
            <p className="font-rajdhani text-xs tracking-[0.2em] text-[#D4AF37]/70 uppercase font-bold">ACCESS DENIED</p>
          </div>
          <div className="p-6 border border-[#FF4655]/30 bg-[#FF4655]/5 sf-clip-angled-sm max-w-md w-full">
            <p className="font-rajdhani text-neutral-300 text-sm leading-relaxed">
              {lockedMessage || 'BATTLEGROUNDS INTEL IS CLASSIFIED. CHECK BACK CLOSER TO THE EVENT DATE.'}
            </p>
          </div>
          <button
            id="battlegrounds-back-locked-btn"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-[#D4AF37]/70 hover:text-[#F5D061] font-rajdhani font-bold text-xs tracking-[0.2em] uppercase transition-colors group mt-2"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            RETURN TO MAIN ARENA
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-[#050608] text-[#F5F5F5] overflow-x-hidden">
      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-[#D4AF37]/6 blur-[160px]" />
        <div className="absolute bottom-1/3 left-0 w-[600px] h-[600px] rounded-full bg-[#FF4655]/5 blur-[180px]" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-[#D4AF37]/4 blur-[160px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(212,175,55,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <button
            id="battlegrounds-back-btn"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-[#D4AF37]/70 hover:text-[#F5D061] font-rajdhani font-bold text-xs tracking-[0.2em] uppercase mb-8 transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            BACK TO MAIN ARENA
          </button>

          <div className="flex items-center gap-4 mb-3">
            <div className="w-10 h-10 border border-[#D4AF37]/50 sf-clip-angled-sm flex items-center justify-center bg-[#D4AF37]/10">
              <Swords className="w-5 h-5 text-[#F5D061]" />
            </div>
            <p className="font-rajdhani text-[#D4AF37] text-xs tracking-[0.3em] uppercase font-bold">HACKVERSE &apos;26</p>
          </div>

          <h1 className="sf-gothic-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl sf-text-gold mb-4">
            Battlegrounds
          </h1>
          <p className="font-rajdhani text-neutral-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            Five elite combat domains. Choose your battleground wisely — each track tests a different dimension of engineering mastery. Only the most prepared squads will claim the bounty.
          </p>

          <div className="flex flex-wrap gap-6 mt-6">
            {[
              { label: 'COMBAT TRACKS', value: '5' },
              { label: 'PRIZE POOL', value: '1,50,000+' },
              { label: 'DURATION', value: '24 HOURS' },
              { label: 'TEAM SIZE', value: '2-4 WARRIORS' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="sf-gothic-title text-2xl sm:text-3xl text-[#F5D061]">{stat.value}</span>
                <span className="font-rajdhani text-[10px] text-neutral-500 tracking-[0.2em] uppercase font-bold">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent mb-12" />

        {/* Challenge Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {CHALLENGES.map((challenge, idx) => {
            const diffClass = DIFFICULTY_COLOR[challenge.difficulty] ?? 'text-neutral-300 border-neutral-500/50 bg-neutral-500/10';
            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="battlegrounds-card"
              >
                {/* Image strip */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={challenge.image}
                    alt={challenge.title}
                    className="w-full h-full object-cover brightness-50 scale-105 hover:scale-110 transition-transform duration-700"
                  />
                  {/* Number */}
                  <div className="absolute top-4 left-4">
                    <span className="sf-gothic-title text-5xl text-[#D4AF37]/30 select-none leading-none">
                      {challenge.number}
                    </span>
                  </div>
                  {/* Difficulty */}
                  <div className="absolute top-4 right-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 border text-[10px] font-rajdhani font-black tracking-[0.2em] uppercase ${diffClass}`}>
                      <Star className="w-2.5 h-2.5" />
                      {challenge.difficulty}
                    </span>
                  </div>
                  {/* Track icon */}
                  <div className="absolute bottom-4 left-4 w-12 h-12 bg-[#060A10]/90 border border-[#D4AF37]/40 sf-clip-angled-sm flex items-center justify-center text-[#F5D061]">
                    {TRACK_ICONS[challenge.id] ?? <Zap className="w-6 h-6" />}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060A10] via-[#060A10]/30 to-transparent" />
                </div>

                {/* Card body */}
                <div className="p-5 sm:p-6">
                  <div className="mb-1">
                    <span className="font-rajdhani text-[#D4AF37]/60 text-[10px] tracking-[0.25em] uppercase font-bold">
                      {challenge.category}
                    </span>
                  </div>
                  <h2 className="font-cinzel font-black text-lg sm:text-xl text-white tracking-wide mb-2 uppercase">
                    {challenge.title}
                  </h2>
                  <p className="font-rajdhani text-neutral-400 text-sm leading-relaxed mb-4">
                    {challenge.shortDescription}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {challenge.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 border border-[#D4AF37]/20 text-[#D4AF37]/70 font-mono text-[10px] tracking-wide"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Requirements preview */}
                  <div className="mb-5 space-y-1.5">
                    {challenge.requirements.slice(0, 2).map((req, i) => (
                      <div key={i} className="flex gap-2.5 items-start">
                        <span className="text-[#D4AF37] text-xs mt-0.5 shrink-0">&#9658;</span>
                        <span className="font-rajdhani text-neutral-500 text-xs leading-relaxed">{req}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <button
                    id={`battleground-enter-${challenge.id}-btn`}
                    onClick={() => onOpenRegister(challenge)}
                    className="w-full h-11 sf-btn-crimson sf-clip-angled flex items-center justify-center gap-2.5 text-xs tracking-[0.18em] font-cinzel"
                  >
                    <Swords className="w-4 h-4 text-[#FFE082]" />
                    <span>ENTER THIS BATTLEGROUND</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-14 text-center"
        >
          <p className="font-rajdhani text-neutral-500 text-sm mb-5 tracking-wider">
            CANT DECIDE? REGISTER AND PICK YOUR TRACK ON ARRIVAL.
          </p>
          <button
            id="battlegrounds-join-battle-btn"
            onClick={() => onOpenRegister()}
            className="h-14 px-12 sf-btn-gold sf-clip-angled text-sm font-cinzel tracking-[0.18em] inline-flex items-center gap-3"
          >
            <Swords className="w-5 h-5" />
            JOIN THE BATTLE - ITS FREE
          </button>
        </motion.div>
      </div>
    </div>
  );
}
