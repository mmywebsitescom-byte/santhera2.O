import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Shield, X, ExternalLink, Gift, Sparkles } from 'lucide-react';
import { SPONSORS } from '../data/hackfestData';
import { useSiteContent } from '../context/ContentContext';

export default function Sponsors() {
  const { content } = useSiteContent();
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [partnerEmail, setPartnerEmail] = useState('');
  const [partnerOrg, setPartnerOrg] = useState('');
  const [partnerSubmitted, setPartnerSubmitted] = useState(false);

  const rawSponsors = (content.sponsors && content.sponsors.length > 0)
    ? content.sponsors
    : SPONSORS;

  const allSponsors = rawSponsors.map((s, idx) => ({
    id: s.id || `sp-${idx}`,
    name: s.name,
    tier: s.tier || 'Gold',
    category: s.category || (s as any).perk || 'Developer Ecosystem & Grants',
    perk: (s as any).perk || 'Official Arena Combat Partner',
    logoUrl: s.logoUrl || (s as any).logo || '',
    logoText: s.name.split(' ').map((w: string) => w[0]).join('').slice(0, 4) || 'HV',
    websiteUrl: s.websiteUrl || '',
  }));

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerEmail || !partnerOrg) return;
    setPartnerSubmitted(true);
    setTimeout(() => {
      setPartnerModalOpen(false);
      setPartnerSubmitted(false);
      setPartnerEmail('');
      setPartnerOrg('');
    }, 1800);
  };

  const getTierBadgeBg = (tier: string) => {
    const t = tier.toLowerCase();
    if (t.includes('title')) return 'bg-[#FFAA00] text-black';
    if (t.includes('platinum')) return 'bg-[#E2E8F0] text-black';
    if (t.includes('gold')) return 'bg-[#FFDF78] text-black';
    return 'bg-[#55FF55] text-black';
  };

  return (
    <section
      id="sponsors"
      className="py-20 sm:py-28 px-4 sm:px-6 md:px-12 bg-transparent relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-14 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#101010] border-2 border-[#FFAA00] text-[#FFDF78] font-mono text-xs font-bold uppercase tracking-wider mb-3 shadow-[2px_2px_0px_#000] [text-shadow:_1px_1px_0_#000]">
              <Shield className="w-3.5 h-3.5 text-[#55FF55]" />
              <span>ECOSYSTEM // INDUSTRY PARTNERS</span>
            </div>
            <h2 className="font-mono font-black text-4xl sm:text-6xl md:text-7xl text-white tracking-tight leading-tight uppercase [text-shadow:_3px_3px_0_#000,-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000]">
              SPONSORS & <span className="text-[#55FF55]">ALLIES</span>
            </h2>
            <p className="font-mono text-xs sm:text-sm text-neutral-300 mt-2 max-w-xl [text-shadow:_1px_1px_0_#000]">
              Backed by leading venture funds, cloud infrastructure providers, and engineering labs.
            </p>
          </div>
          <button
            onClick={() => setPartnerModalOpen(true)}
            className="self-start md:self-end px-6 py-3 bg-[#DBDBDB] hover:bg-[#EAEAEA] text-black font-mono font-black text-xs uppercase tracking-wider border-3 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[3px_3px_0px_#000] cursor-pointer active:translate-y-0.5 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>BECOME A SPONSOR</span>
          </button>
        </div>

        {/* Uniform Partners Grid — Exactly matching the Special Bounties retro card style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allSponsors.map((sponsor) => (
            <motion.div
              key={sponsor.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-[#2B2B2B] border-4 border-t-[#4a4a4a] border-l-[#4a4a4a] border-r-[#151515] border-b-[#151515] p-5 shadow-[6px_6px_0px_#000] flex flex-col justify-between relative group hover:-translate-y-1 transition-transform"
            >
              <div>
                {/* Top Badge & Tier Icon */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`${getTierBadgeBg(
                      sponsor.tier
                    )} font-mono font-black text-[10px] px-2 py-0.5 border border-black shadow-[2px_2px_0px_#000] uppercase tracking-wider`}
                  >
                    {sponsor.tier}
                  </span>
                  {sponsor.websiteUrl ? (
                    <a
                      href={sponsor.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#55FF55] hover:text-white transition-colors"
                      title="Visit Sponsor Site"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  ) : (
                    <Gift className="w-5 h-5 text-[#55FF55]" />
                  )}
                </div>

                {/* Logo Box in Retro Recessed Style */}
                <div className="w-full h-24 bg-[#101010] border-2 border-black p-3 flex items-center justify-center shadow-[inset_2px_2px_4px_rgba(0,0,0,0.8)] my-3">
                  {sponsor.logoUrl ? (
                    <img
                      src={sponsor.logoUrl}
                      alt={sponsor.name}
                      className="max-h-16 max-w-[85%] object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                    />
                  ) : (
                    <span className="font-mono font-black text-xl text-[#55FF55] tracking-wider uppercase [text-shadow:_1px_1px_0_#000]">
                      {sponsor.logoText}
                    </span>
                  )}
                </div>

                {/* Large Title */}
                <div className="font-mono font-black text-2xl sm:text-3xl text-white tracking-wide mt-2 uppercase [text-shadow:_2px_2px_0_#000]">
                  {sponsor.name}
                </div>

                {/* Description Paragraph */}
                <p className="font-mono text-xs text-neutral-300 mt-2 leading-relaxed [text-shadow:_1px_1px_0_#000]">
                  {sponsor.category}
                </p>

                {/* Star Bullet List matching the reference screenshot */}
                <ul className="mt-4 space-y-2 font-mono text-xs text-neutral-200">
                  <li className="flex items-start gap-2">
                    <span className="text-[#FFAA00] shrink-0">★</span>
                    <span>{sponsor.perk || "Ecosystem API & Dev Compute Grants"}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#FFAA00] shrink-0">★</span>
                    <span>Direct Hacker Outreach & Incubation</span>
                  </li>
                  {sponsor.websiteUrl && (
                    <li className="flex items-start gap-2">
                      <span className="text-[#FFAA00] shrink-0">★</span>
                      <a
                        href={sponsor.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#55FF55] hover:underline flex items-center gap-1 font-bold"
                      >
                        <span>Official Partner Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                  )}
                </ul>
              </div>

              {/* Bottom decorative bar */}
              <div className="mt-5 pt-3 border-t-2 border-[#383838] flex items-center justify-between font-mono text-[10px] text-neutral-400">
                <span className="text-[#FFAA00] font-bold">VERIFIED ALLY</span>
                <span>HACKVERSE '26</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Partner Inquiry Modal */}
      <AnimatePresence>
        {partnerModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 overflow-y-auto select-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPartnerModalOpen(false)}
              className="fixed inset-0 bg-black/80"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-md bg-[#C6C6C6] border-4 border-t-[#FFFFFF] border-l-[#FFFFFF] border-r-[#555555] border-b-[#555555] shadow-[8px_8px_0px_#000] z-10"
            >
              <div className="bg-[#2A2A2A] text-white px-3 py-2 flex items-center justify-between border-b-2 border-[#555555]">
                <span className="font-mono text-xs font-bold uppercase">
                  PARTNERSHIP ENLISTMENT PROTOCOL
                </span>
                <button
                  onClick={() => setPartnerModalOpen(false)}
                  className="w-6 h-6 bg-[#DBDBDB] text-black font-black flex items-center justify-center border border-black"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 sm:p-5">
                {partnerSubmitted ? (
                  <div className="text-center py-4 font-mono">
                    <div className="text-[#55FF55] font-black text-sm uppercase mb-1">
                      INQUIRY TRANSMITTED!
                    </div>
                    <p className="text-xs text-neutral-800">
                      Our sponsorship coordinators will contact you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handlePartnerSubmit} className="space-y-3 font-mono text-xs">
                    <div>
                      <label className="block text-black font-bold uppercase mb-1">
                        Organization / Enterprise Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={partnerOrg}
                        onChange={(e) => setPartnerOrg(e.target.value)}
                        placeholder="e.g. AWS, Solana, Google Cloud"
                        className="w-full bg-[#101010] border-3 border-t-[#222222] border-l-[#222222] border-r-[#555555] border-b-[#555555] text-[#55FF55] p-2 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-black font-bold uppercase mb-1">
                        Corporate Contact Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={partnerEmail}
                        onChange={(e) => setPartnerEmail(e.target.value)}
                        placeholder="sponsor@enterprise.com"
                        className="w-full bg-[#101010] border-3 border-t-[#222222] border-l-[#222222] border-r-[#555555] border-b-[#555555] text-[#55FF55] p-2 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#5B8731] hover:bg-[#689B37] text-white font-mono font-black text-xs uppercase tracking-wider border-3 border-t-[#85B745] border-l-[#85B745] border-r-[#2C4813] border-b-[#2C4813] shadow-[3px_3px_0px_#000] [text-shadow:_1px_1px_0_#000] cursor-pointer"
                    >
                      SUBMIT SPONSORSHIP INTEREST
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
