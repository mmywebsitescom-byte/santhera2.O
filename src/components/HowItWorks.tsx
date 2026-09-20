import { motion } from 'motion/react';
import { 
  UserCheck, 
  Users, 
  Crosshair, 
  Cpu, 
  Sparkles, 
  ShieldCheck, 
  Swords, 
  Trophy, 
  Flame,
  Terminal
} from 'lucide-react';
import { HOW_IT_WORKS_STEPS } from '../data/hackfestData';

export default function HowItWorks() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'UserCheck': return <UserCheck className="w-4 h-4 text-[#55FF55]" />;
      case 'Users': return <Users className="w-4 h-4 text-[#FFAA00]" />;
      case 'Crosshair': return <Crosshair className="w-4 h-4 text-[#55FF55]" />;
      case 'Cpu': return <Cpu className="w-4 h-4 text-[#FFAA00]" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-[#55FF55]" />;
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4 text-[#FFAA00]" />;
      case 'Swords': return <Swords className="w-4 h-4 text-[#55FF55]" />;
      case 'Trophy': return <Trophy className="w-4 h-4 text-[#FFAA00]" />;
      default: return <Flame className="w-4 h-4 text-[#55FF55]" />;
    }
  };

  return (
    <section
      id="how-it-works"
      className="py-20 sm:py-28 px-4 sm:px-6 md:px-12 bg-transparent relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#101010] border-2 border-[#FFAA00] text-[#FFDF78] font-mono text-xs font-bold uppercase tracking-wider mb-3 shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000]">
              <Terminal className="w-3.5 h-3.5 text-[#55FF55]" />
              <span>ROADMAP // HACKATHON PHASES</span>
            </div>
            <h2 className="font-mono font-black text-4xl sm:text-6xl md:text-7xl text-white tracking-tight leading-tight uppercase [text-shadow:_3px_3px_0_#000,-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000]">
              THE BUILDER <span className="text-[#55FF55]">PATHWAY</span>
            </h2>
          </div>
          <p className="font-mono text-xs sm:text-sm text-neutral-300 max-w-sm leading-relaxed [text-shadow:_1px_1px_0_#000]">
            From squad registration to offline checkpoint syncs, project presentations, and podium awards.
          </p>
        </div>

        {/* 8 Nodes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {HOW_IT_WORKS_STEPS.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
              className="bg-[#2B2B2B] border-4 border-t-[#4a4a4a] border-l-[#4a4a4a] border-r-[#151515] border-b-[#151515] p-4 sm:p-5 shadow-[4px_4px_0px_#000] flex flex-col justify-between hover:-translate-y-1 transition-transform"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 bg-[#101010] border-2 border-[#555555] flex items-center justify-center shadow-[1px_1px_0_#000]">
                    {getIcon(step.iconName)}
                  </div>
                  <span className="bg-[#FFAA00] text-black font-mono font-black text-[10px] px-2 py-0.5 border border-black shadow-[1px_1px_0_#000]">
                    PHASE {step.number}
                  </span>
                </div>

                <div className="font-mono text-[10px] text-[#55FF55] uppercase font-bold tracking-wider mb-1">
                  {step.tagline}
                </div>

                <h3 className="font-mono font-black text-base sm:text-lg text-white uppercase [text-shadow:_1px_1px_0_#000]">
                  {step.title}
                </h3>

                <p className="font-mono text-xs text-neutral-300 mt-2 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t-2 border-[#383838] flex items-center justify-between font-mono text-[10px] text-neutral-400">
                <span>STEP 0{idx + 1} OF 08</span>
                <span className="text-[#55FF55]">● ACTIVE</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
