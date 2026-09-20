import { useEffect, useState, useRef } from 'react';
import { useInView } from 'motion/react';
import { Clock, Users, Flame, Trophy, Terminal } from 'lucide-react';
import { useSiteContent } from '../context/ContentContext';

interface StatItemProps {
  target: number;
  suffix?: string;
  prefix?: string;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

function StatItem({ target, suffix = '', prefix = '', label, sublabel, icon: Icon }: StatItemProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const duration = 1600;
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const easeOut = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(start + (target - start) * easeOut);

      setCount(current);

      if (frame >= totalFrames) {
        clearInterval(timer);
        setCount(target);
      }
    }, frameRate);

    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <div
      ref={ref}
      className="bg-[#2B2B2B] border-4 border-t-[#4a4a4a] border-l-[#4a4a4a] border-r-[#151515] border-b-[#151515] p-5 shadow-[4px_4px_0px_#000] hover:-translate-y-1 transition-transform select-none"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-8 h-8 bg-[#101010] border-2 border-[#555555] flex items-center justify-center text-[#55FF55] shadow-[1px_1px_0_#000]">
          <Icon className="w-4 h-4" />
        </div>
        <span className="font-mono text-[10px] tracking-wider text-[#FFDF78] font-bold uppercase [text-shadow:_1px_1px_0_#000]">
          {sublabel}
        </span>
      </div>

      <div className="flex items-baseline gap-1 font-mono">
        {prefix && (
          <span className="text-2xl sm:text-3xl font-black text-[#FFAA00]">
            {prefix}
          </span>
        )}
        <span className="font-mono text-4xl sm:text-5xl font-black tracking-tight text-[#55FF55] [text-shadow:_2px_2px_0_#000,-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000]">
          {count}
        </span>
        {suffix && (
          <span className="text-2xl sm:text-3xl font-black text-[#FFAA00]">
            {suffix}
          </span>
        )}
      </div>

      <div className="mt-2 font-mono text-sm sm:text-base font-black tracking-wider text-white uppercase [text-shadow:_1px_1px_0_#000]">
        {label}
      </div>
    </div>
  );
}

export default function Stats() {
  const { content } = useSiteContent();
  const stats = content?.stats || {};

  return (
    <section id="stats" className="py-20 sm:py-28 px-4 sm:px-6 md:px-12 bg-transparent relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#101010] border-2 border-[#FFAA00] text-[#FFDF78] font-mono text-xs font-bold uppercase tracking-wider mb-3 shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000]">
              <Terminal className="w-3.5 h-3.5 text-[#55FF55]" />
              <span>METRICS // PROTOCOL BENCHMARKS</span>
            </div>
            <h2 className="font-mono font-black text-4xl sm:text-6xl md:text-7xl text-white tracking-tight leading-tight uppercase [text-shadow:_3px_3px_0_#000,-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000]">
              HACKATHON <span className="text-[#55FF55]">BENCHMARKS</span>
            </h2>
          </div>
          <p className="font-mono text-xs sm:text-sm text-neutral-300 max-w-sm leading-relaxed [text-shadow:_1px_1px_0_#000]">
            Statewide engineering participation, verified mentor council, and direct startup incubation grants.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatItem
            target={parseInt(stats.hours) || 24}
            label={stats.hoursLabel || "HOURS"}
            sublabel={stats.hoursSub || "NON-STOP SPRINT"}
            icon={Clock}
          />
          <StatItem
            target={parseInt(stats.hackers) || 200}
            suffix="+"
            label={stats.hackersLabel || "BUILDERS"}
            sublabel={stats.hackersSub || "SHORTLISTED SQUADS"}
            icon={Users}
          />
          <StatItem
            target={parseInt(stats.tracks) || 5}
            suffix=" TRACKS"
            label={stats.tracksLabel || "QUESTS"}
            sublabel={stats.tracksSub || "CLASSIFIED TRACKS"}
            icon={Flame}
          />
          <StatItem
            target={1.5}
            prefix="₹"
            suffix="L+"
            label={stats.prizePoolLabel || "STATE PRIZES"}
            sublabel={stats.prizePoolSub || "CASH & GRANTS"}
            icon={Trophy}
          />
        </div>
      </div>
    </section>
  );
}
