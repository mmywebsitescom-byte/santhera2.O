import { motion } from 'motion/react';
import { Users } from 'lucide-react';
import { TEAMS } from '../data/hackfestData';
import { useSiteContent } from '../context/ContentContext';

export default function Teams() {
  const { content } = useSiteContent();
  const displayTeams = (content?.teams && content.teams.length > 0) ? content.teams : TEAMS;

  return (
    <section
      id="teams"
      className="py-20 sm:py-28 px-4 sm:px-6 md:px-12 bg-transparent relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#D4AF37]/40 bg-[#D4AF37]/8 text-[#F5D061] font-rajdhani text-xs font-bold uppercase tracking-[0.2em] mb-4">
            <Users className="w-3.5 h-3.5" />
            <span>ROSTER // SHORTLISTED SQUADS</span>
          </div>
          <h2 className="sf-gothic-title text-4xl sm:text-5xl md:text-6xl sf-text-gold mb-3">
            Featured Squads
          </h2>
          <p className="font-rajdhani text-neutral-400 text-sm max-w-lg mx-auto">
            The shortlisted engineering squads deployed in the battleground.
          </p>
        </div>

        {/* Team Names Grid — name only */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {displayTeams.map((team, idx) => (
            <motion.div
              key={team.id || idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="relative group p-4 border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 bg-[#0d1117]/80 hover:bg-[#D4AF37]/5 transition-all duration-200 sf-clip-angled-sm"
            >
              {/* Number */}
              <span className="block font-rajdhani text-[10px] text-[#D4AF37]/50 tracking-[0.25em] uppercase font-bold mb-1">
                SQUAD {team.number}
              </span>
              {/* Team name */}
              <span className="block font-cinzel font-black text-sm text-white group-hover:text-[#F5D061] transition-colors uppercase leading-tight">
                {team.name}
              </span>
              {/* Category */}
              <span className="block font-rajdhani text-[10px] text-neutral-500 mt-1 truncate">
                {team.category}
              </span>
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#D4AF37]/30 group-hover:border-[#D4AF37]/80 transition-colors" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
