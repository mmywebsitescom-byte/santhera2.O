import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Atom, 
  FileCode2, 
  Binary, 
  Flame, 
  BrainCircuit, 
  Database, 
  Layers, 
  Radio, 
  Zap,
  Terminal
} from 'lucide-react';
import { useSiteContent } from '../context/ContentContext';
import { ARSENAL_ITEMS } from '../data/hackfestData';

export default function Arsenal() {
  const { content } = useSiteContent();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Use content from admin panel if available, otherwise fall back to static data
  const arsenalItems = Array.isArray(content?.arsenal) && content.arsenal.length > 0
    ? content.arsenal
    : ARSENAL_ITEMS.map((item) => ({
        ...item,
        adoption: item.stats?.power ?? 90,
      }));

  const categories = ['ALL', 'AI & AGENTS', 'FRAMEWORKS', 'SYSTEMS & LANGUAGES', 'DATA & CLOUD'];

  const filteredItems = selectedCategory === 'ALL'
    ? arsenalItems
    : arsenalItems.filter((item) => item.category === selectedCategory);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Atom': return <Atom className="w-5 h-5 text-[#55FF55]" />;
      case 'FileCode2': return <FileCode2 className="w-5 h-5 text-[#FFAA00]" />;
      case 'Binary': return <Binary className="w-5 h-5 text-[#55FF55]" />;
      case 'Flame': return <Flame className="w-5 h-5 text-[#FFAA00]" />;
      case 'BrainCircuit': return <BrainCircuit className="w-5 h-5 text-[#55FF55]" />;
      case 'Database': return <Database className="w-5 h-5 text-[#FFAA00]" />;
      case 'Layers': return <Layers className="w-5 h-5 text-[#55FF55]" />;
      case 'Radio': return <Radio className="w-5 h-5 text-[#FFAA00]" />;
      default: return <Zap className="w-5 h-5 text-[#55FF55]" />;
    }
  };

  return (
    <section
      id="arsenal"
      className="py-20 sm:py-28 px-4 sm:px-6 md:px-12 bg-transparent relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#101010] border-2 border-[#FFAA00] text-[#FFDF78] font-mono text-xs font-bold uppercase tracking-wider mb-3 shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000]">
              <Terminal className="w-3.5 h-3.5 text-[#55FF55]" />
              <span>TOOLKIT // TECH STACK MATRIX</span>
            </div>
            <h2 className="font-mono font-black text-4xl sm:text-6xl md:text-7xl text-white tracking-tight leading-tight uppercase [text-shadow:_3px_3px_0_#000,-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000]">
              DEVELOPER <span className="text-[#55FF55]">ARSENAL</span>
            </h2>
          </div>
          <p className="font-mono text-xs sm:text-sm text-neutral-300 max-w-sm leading-relaxed [text-shadow:_1px_1px_0_#000]">
            Recommended battle frameworks, autonomous AI agent SDKs, cloud compute primitives, and hardware toolchains.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2.5 mb-10 select-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 sm:px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border-3 ${
                selectedCategory === cat
                  ? 'bg-[#5B8731] text-white border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000]'
                  : 'bg-[#2B2B2B] text-neutral-300 hover:text-white border-t-[#4a4a4a] border-l-[#4a4a4a] border-r-[#151515] border-b-[#151515] shadow-[2px_2px_0px_#000]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Arsenal Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id || item.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              className="bg-[#2B2B2B] border-4 border-t-[#4a4a4a] border-l-[#4a4a4a] border-r-[#151515] border-b-[#151515] p-4 sm:p-5 shadow-[4px_4px_0px_#000] flex flex-col justify-between hover:-translate-y-1 transition-transform"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 bg-[#101010] border-2 border-[#555555] flex items-center justify-center shadow-[1px_1px_0_#000]">
                    {getIcon(item.icon)}
                  </div>
                  <span className="bg-[#101010] text-[#55FF55] font-mono font-bold text-[10px] px-2 py-0.5 border border-black">
                    {item.tier}
                  </span>
                </div>

                <div className="font-mono text-[10px] text-[#FFAA00] uppercase font-bold tracking-wider mb-1">
                  {item.category}
                </div>

                <h3 className="font-mono font-black text-base sm:text-lg text-white uppercase [text-shadow:_1px_1px_0_#000]">
                  {item.name}
                </h3>

                <p className="font-mono text-xs text-neutral-300 mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t-2 border-[#383838] flex items-center justify-between font-mono text-[10px] text-neutral-400">
                <span>{(item.adoption ?? (item as any).stats?.power ?? 90)}% ADOPTION</span>
                <span className="text-[#55FF55]">SUPPORTED</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
