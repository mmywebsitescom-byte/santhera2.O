import { motion } from 'motion/react';
import { Trophy, Award, Medal, Gift, Sparkles } from 'lucide-react';
import { EVENT_INFO } from '../data/hackfestData';
import { useSiteContent } from '../context/ContentContext';

export default function Prizes() {
  const { content } = useSiteContent();
  const prizes = content?.prizes || {};
  const totalPrizePool = prizes.poolTotal || EVENT_INFO.stats.prizePool || '₹1,50,000+';

  return (
    <section
      id="prizes"
      className="py-20 sm:py-24 px-4 sm:px-6 md:px-12 bg-transparent relative z-[2]"
    >
      <div className="max-w-7xl mx-auto relative z-[2]">
        {/* HackVerse Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#101010] border-2 border-[#FFAA00] text-[#FFDF78] font-mono text-xs font-bold uppercase tracking-wider mb-3 shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000]">
              <Trophy className="w-3.5 h-3.5 text-[#FFAA00]" />
              <span>REWARDS MATRIX // GRANTS & BOUNTIES</span>
            </div>
            <h2 className="font-mono font-black text-4xl sm:text-6xl md:text-7xl text-white tracking-tight leading-tight uppercase [text-shadow:_3px_3px_0_#000,-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000]">
              STATE <span className="text-[#FFAA00]">PRIZE POOL</span>
            </h2>
          </div>
          <p className="font-mono text-xs sm:text-sm text-neutral-300 max-w-md leading-relaxed [text-shadow:_1px_1px_0_#000]">
            Over {totalPrizePool} in state capital grants, compute clusters, trophies, and fast-track seed investment.
          </p>
        </div>

        {/* 1st Place Champion Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 bg-[#141418]/85 backdrop-blur-md border-4 border-t-[#FFE285] border-l-[#FFE285] border-r-[#8F5500] border-b-[#8F5500] p-6 sm:p-8 shadow-[6px_6px_0px_#000] relative overflow-hidden"
        >
          {/* Subtle amber glow in center */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFAA00]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFAA00] text-black font-mono font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_#000] border border-black">
                <Trophy className="w-4 h-4 text-black" />
                <span>FIRST PLACE // CHAMPION</span>
              </div>

              <h3 className="font-mono font-black text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-none [text-shadow:_2px_2px_0_#000]">
                {prizes.first || "₹50,000"} <span className="text-[#55FF55] text-2xl sm:text-3xl">{prizes.firstSubtitle || "+ VC BACKING"}</span>
              </h3>

              <p className="font-mono text-xs sm:text-sm text-neutral-200 leading-relaxed">
                {prizes.firstDesc ||
                  "The grand victor of HackVerse '26. Cash grant wire, official HackVerse champion trophy, direct VC investor term-sheet screening, and priority incubator residency."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {[
                  `${prizes.first || '₹50,000'} Direct Cash Prize Wire`,
                  '₹2,00,000 Cloud Compute Credits',
                  'Direct VC Term-Sheet Screening',
                  'Exclusive Gold Trophy & Custom Badges',
                ].map((perk, idx) => (
                  <div key={idx} className="flex items-center gap-2 font-mono text-xs text-[#FFDF78]">
                    <Sparkles className="w-3.5 h-3.5 text-[#55FF55] shrink-0" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gold Pixel Trophy Box */}
            <div className="w-36 h-36 sm:w-44 sm:h-44 bg-[#101010] border-4 border-t-[#222222] border-l-[#222222] border-r-[#555555] border-b-[#555555] shadow-[4px_4px_0px_#000] flex flex-col items-center justify-center p-3 text-center shrink-0">
              <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-[#FFAA00] [filter:drop-shadow(0_0_10px_#FFAA00)]" />
              <span className="font-mono font-black text-sm sm:text-base text-white mt-2 [text-shadow:_1px_1px_0_#000]">
                1ST PLACE
              </span>
              <span className="font-mono text-[9px] text-[#55FF55] font-bold">
                STATE CHAMPION
              </span>
            </div>
          </div>
        </motion.div>

        {/* 2nd Place, 3rd Place & Swags Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Runner Up // 2nd Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-[#141418]/85 backdrop-blur-md border-4 border-t-[#4a4a4a] border-l-[#4a4a4a] border-r-[#151515] border-b-[#151515] p-5 shadow-[4px_4px_0px_#000] flex flex-col justify-between hover:-translate-y-1 transition-transform"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="bg-[#DBDBDB] text-black font-mono font-black text-[10px] px-2 py-0.5 border border-black shadow-[2px_2px_0px_#000]">
                  RUNNER UP // 2ND PLACE
                </span>
                <Award className="w-5 h-5 text-[#DBDBDB]" />
              </div>

              <div className="font-mono font-black text-3xl sm:text-4xl text-white tracking-wide mt-2 [text-shadow:_2px_2px_0_#000]">
                {prizes.second || "₹30,000"}
              </div>
              <p className="font-mono text-xs text-neutral-300 mt-2 leading-relaxed">
                {prizes.secondDesc || "For the second highest scoring engineering team across all tracks."}
              </p>

              <ul className="mt-4 space-y-2 font-mono text-xs text-neutral-200">
                <li className="flex items-center gap-2">
                  <span className="text-[#55FF55]">✔</span>
                  <span>{prizes.second || "₹30,000"} Cash Grant</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#55FF55]">✔</span>
                  <span>₹1,00,000 Cloud Compute Credits</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#55FF55]">✔</span>
                  <span>Silver Runner-Up Trophies</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Third Place // 2nd Runner Up */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-[#141418]/85 backdrop-blur-md border-4 border-t-[#4a4a4a] border-l-[#4a4a4a] border-r-[#151515] border-b-[#151515] p-5 shadow-[4px_4px_0px_#000] flex flex-col justify-between hover:-translate-y-1 transition-transform"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="bg-[#B87333] text-white font-mono font-black text-[10px] px-2 py-0.5 border border-black shadow-[2px_2px_0px_#000]">
                  THIRD PLACE // 2ND RUNNER UP
                </span>
                <Medal className="w-5 h-5 text-[#B87333]" />
              </div>

              <div className="font-mono font-black text-3xl sm:text-4xl text-white tracking-wide mt-2 [text-shadow:_2px_2px_0_#000]">
                {prizes.third || "₹20,000"}
              </div>
              <p className="font-mono text-xs text-neutral-300 mt-2 leading-relaxed">
                {prizes.thirdDesc || "For the third highest scoring squad with exceptional implementation craft."}
              </p>

              <ul className="mt-4 space-y-2 font-mono text-xs text-neutral-200">
                <li className="flex items-center gap-2">
                  <span className="text-[#55FF55]">✔</span>
                  <span>{prizes.third || "₹20,000"} Cash Grant</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#55FF55]">✔</span>
                  <span>Hardware Prototyping Kits</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#55FF55]">✔</span>
                  <span>Bronze Laurels & Winner Badges</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Swag Kits & Verified State Certificates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#141418]/85 backdrop-blur-md border-4 border-t-[#4a4a4a] border-l-[#4a4a4a] border-r-[#151515] border-b-[#151515] p-5 shadow-[4px_4px_0px_#000] flex flex-col justify-between hover:-translate-y-1 transition-transform"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="bg-[#55FF55] text-black font-mono font-black text-[10px] px-2 py-0.5 border border-black shadow-[2px_2px_0px_#000]">
                  SPECIAL BOUNTIES
                </span>
                <Gift className="w-5 h-5 text-[#55FF55]" />
              </div>

              <div className="font-mono font-black text-2xl sm:text-3xl text-white tracking-wide mt-2 [text-shadow:_1px_1px_0_#000]">
                {prizes.special || "₹50,000"}
              </div>
              <p className="font-mono text-xs text-neutral-300 mt-2 leading-relaxed">
                {prizes.specialDesc ||
                  "Best All-Women Squad, Best Freshman Hack, Best Hardware Integration, and Community Choice awards."}
              </p>

              <ul className="mt-4 space-y-2 font-mono text-xs text-neutral-200">
                <li className="flex items-center gap-2">
                  <span className="text-[#FFAA00]">★</span>
                  <span>Official HackVerse '26 Squad T-Shirt</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#FFAA00]">★</span>
                  <span>Die-Cut Holographic Sticker Packs</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#FFAA00]">★</span>
                  <span>Verified State Participation Certificate</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
