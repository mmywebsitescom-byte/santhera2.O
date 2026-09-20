import { motion } from 'motion/react';
import { Users } from 'lucide-react';
import { MENTORS_JUDGES } from '../data/hackfestData';

export default function Mentors() {
  return (
    <section
      id="mentors"
      className="py-20 sm:py-28 px-4 sm:px-6 md:px-12 bg-transparent relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#101010] border-2 border-[#FFAA00] text-[#FFDF78] font-mono text-xs font-bold uppercase tracking-wider mb-3 shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000]">
              <Users className="w-3.5 h-3.5 text-[#55FF55]" />
              <span>FACULTY & JURY // MENTOR COUNCIL</span>
            </div>
            <h2 className="font-mono font-black text-4xl sm:text-6xl md:text-7xl text-white tracking-tight leading-tight uppercase [text-shadow:_3px_3px_0_#000,-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000]">
              MENTORS & <span className="text-[#55FF55]">JUDGES</span>
            </h2>
          </div>
          <p className="font-mono text-xs sm:text-sm text-neutral-300 max-w-sm leading-relaxed [text-shadow:_1px_1px_0_#000]">
            Distinguished tech leads, venture partners, and research engineers evaluating your implementations.
          </p>
        </div>

        {/* Master Profile Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MENTORS_JUDGES.map((master, idx) => (
            <motion.div
              key={master.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="bg-[#2B2B2B] border-4 border-t-[#4a4a4a] border-l-[#4a4a4a] border-r-[#151515] border-b-[#151515] p-5 shadow-[4px_4px_0px_#000] flex flex-col justify-between hover:-translate-y-1 transition-transform"
            >
              <div>
                {/* Photo & Role Bar */}
                <div className="flex items-center gap-3.5 mb-3.5">
                  <img
                    src={master.image}
                    alt={master.name}
                    className="w-16 h-16 object-cover border-2 border-black shadow-[2px_2px_0px_#000]"
                    loading="lazy"
                  />
                  <div>
                    <span className="bg-[#FFAA00] text-black font-mono font-black text-[10px] px-2 py-0.5 border border-black shadow-[1px_1px_0_#000] inline-block mb-1">
                      {master.badge}
                    </span>
                    <h3 className="font-mono font-black text-base text-white uppercase leading-tight [text-shadow:_1px_1px_0_#000]">
                      {master.name}
                    </h3>
                    <div className="font-mono text-xs text-[#55FF55] mt-0.5">
                      {master.role}
                    </div>
                  </div>
                </div>

                <div className="font-mono text-[11px] text-[#FFDF78] font-bold mb-2">
                  {master.company}
                </div>

                {/* Expertise Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t-2 border-[#383838]">
                  {master.expertise.map((spec) => (
                    <span
                      key={spec}
                      className="px-2 py-0.5 bg-[#1B1B1B] text-neutral-300 border border-[#444] font-mono text-[10px]"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
