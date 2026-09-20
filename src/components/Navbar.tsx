import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, X, Swords, Camera } from 'lucide-react';
import { useSiteContent } from '../context/ContentContext';

interface NavbarProps {
  onOpenRegister: () => void;
  activeSection: string;
  onOpenBattlegrounds: () => void;
  onOpenGallery: () => void;
}

export default function Navbar({ onOpenRegister, activeSection, onOpenBattlegrounds, onOpenGallery }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { content } = useSiteContent();
  const navbar = content?.navbar || {};

  const navLinks = [
    { name: 'ABOUT', href: '#mission' },
    { name: 'QUESTS', href: '#challenges' },
    { name: 'ARSENAL', href: '#arsenal' },
    { name: 'TIMELINE', href: '#timeline' },
    { name: 'PRIZES', href: '#prizes' },
    { name: 'SPONSORS', href: '#sponsors' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full max-w-full border-b border-[#D4AF37]/35 shadow-[0_8px_30px_rgba(0,0,0,0.9)] bg-[#0c1017]/95 backdrop-blur-md">
      {/* Main Navigation Bar */}
      <div className="w-full max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Logo / Brand */}
        <a
          href="#hero"
          className="flex items-center gap-2 group cursor-pointer select-none shrink-0 -ml-1 sm:-ml-2"
        >
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-b from-[#241a14] to-[#0f0c08] border border-[#D4AF37] sf-clip-angled-sm shadow-[0_0_15px_rgba(212,175,55,0.3)] flex items-center justify-center overflow-hidden">
            {navbar.siteLogoUrl ? (
              <img
                src={String(navbar.siteLogoUrl)}
                alt="Site Logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <Swords className="w-4 h-4 sm:w-5 sm:h-5 text-[#F5D061] group-hover:rotate-45 group-hover:scale-110 transition-all duration-300" />
            )}
            <span className="absolute -top-0.5 -right-0.5 w-1 h-1 bg-[#D4AF37]" />
            <span className="absolute -bottom-0.5 -left-0.5 w-1 h-1 bg-[#D4AF37]" />
          </div>
          <div className="flex flex-col">
            <span className="font-cinzel font-black text-base sm:text-lg tracking-[0.14em] sf-text-gold leading-none">
              {navbar.brandName || "HACKVERSE"}{' '}
              <span className="text-[#FF4655]">{navbar.brandAccent || "'26"}</span>
            </span>
            <span className="font-rajdhani text-[9px] sm:text-[10px] tracking-[0.25em] text-[#D4AF37]/80 font-bold uppercase leading-none mt-1">
              {navbar.brandSubline || "BATTLEGROUND // GCEK"}
            </span>
          </div>
        </a>

        {/* Center Nav Links (Desktop) */}
        <nav
          className="hidden lg:flex items-center justify-center gap-1 xl:gap-2 flex-1 mx-2 lg:mx-4 shrink-0"
          aria-label="Main Navigation"
        >
          {/* BATTLEGROUNDS — gold swords pill */}
          <button
            id="nav-battlegrounds-btn"
            onClick={onOpenBattlegrounds}
            className="relative px-3 py-1.5 font-cinzel font-bold text-xs uppercase tracking-[0.15em] transition-all duration-200 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer text-[#F5D061] bg-[#D4AF37]/10 border border-[#D4AF37]/50 hover:border-[#D4AF37] hover:bg-[#D4AF37]/20 hover:[text-shadow:0_0_12px_rgba(212,175,55,0.8)] sf-clip-angled-sm shadow-[0_0_8px_rgba(212,175,55,0.1)] hover:shadow-[0_0_16px_rgba(212,175,55,0.25)]"
          >
            <Swords className="w-3 h-3" />
            <span>BATTLEGROUNDS</span>
          </button>

          {/* Scroll-anchor links */}
          {navLinks.map((link) => {
            const isActive = activeSection.toUpperCase() === link.name;
            return (
              <a
                key={link.name}
                href={link.href}
                className={`relative px-2.5 py-1.5 font-cinzel font-bold text-xs uppercase tracking-[0.15em] transition-all duration-200 inline-flex items-center gap-1 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'text-[#F5D061] [text-shadow:0_0_12px_rgba(212,175,55,0.6)]'
                    : 'text-neutral-300 hover:text-[#F5D061] hover:[text-shadow:0_0_10px_rgba(212,175,55,0.4)]'
                }`}
              >
                <span>{link.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute -bottom-1 left-2 right-2 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent shadow-[0_0_8px_#D4AF37]"
                  />
                )}
              </a>
            );
          })}

          {/* GALLERY — teal camera style */}
          <button
            id="nav-gallery-btn"
            onClick={onOpenGallery}
            className="relative px-3 py-1.5 font-cinzel font-bold text-xs uppercase tracking-[0.15em] transition-all duration-200 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer text-[#4ECDC4] bg-[#4ECDC4]/8 border border-dashed border-[#4ECDC4]/40 hover:border-[#4ECDC4]/80 hover:bg-[#4ECDC4]/15 hover:[text-shadow:0_0_12px_rgba(78,205,196,0.7)]"
          >
            <Camera className="w-3 h-3" />
            <span>GALLERY</span>
          </button>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
          {/* Crimson Register Button */}
          <button
            id="navbar-register-btn"
            onClick={onOpenRegister}
            className="h-9 sm:h-10 px-4 sm:px-6 sf-btn-crimson sf-clip-angled-sm flex items-center gap-2 text-xs sm:text-sm transition-all cursor-pointer"
          >
            <span className="font-cinzel tracking-[0.16em]">REGISTER</span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 bg-[#141a24] border border-[#D4AF37]/40 sf-clip-angled-sm flex items-center justify-center text-[#F5D061] cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#0c1017]/98 border-t border-[#D4AF37]/35 border-b-2 border-b-[#D4AF37]/50 shadow-[0_12px_30px_rgba(0,0,0,0.95)] overflow-hidden"
          >
            <div className="px-4 py-5 space-y-2 max-h-[75vh] overflow-y-auto">
              {/* Mobile BATTLEGROUNDS — gold */}
              <button
                id="mobile-nav-battlegrounds-btn"
                onClick={() => { setMobileMenuOpen(false); onOpenBattlegrounds(); }}
                className="w-full text-left font-cinzel font-bold text-xs uppercase tracking-[0.16em] text-[#F5D061] bg-[#D4AF37]/8 hover:bg-[#D4AF37]/15 p-2.5 border-l-2 border-[#D4AF37]/60 hover:border-[#D4AF37] transition-all cursor-pointer flex items-center gap-2"
              >
                <Swords className="w-3.5 h-3.5" /> BATTLEGROUNDS
              </button>

              {/* Mobile GALLERY — teal dashed */}
              <button
                id="mobile-nav-gallery-btn"
                onClick={() => { setMobileMenuOpen(false); onOpenGallery(); }}
                className="w-full text-left font-cinzel font-bold text-xs uppercase tracking-[0.16em] text-[#4ECDC4] bg-[#4ECDC4]/5 hover:bg-[#4ECDC4]/12 p-2.5 border-l-2 border-dashed border-[#4ECDC4]/50 hover:border-[#4ECDC4] transition-all cursor-pointer flex items-center gap-2"
              >
                <Camera className="w-3.5 h-3.5" /> GALLERY
              </button>

              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block font-cinzel font-bold text-xs uppercase tracking-[0.16em] text-neutral-300 hover:text-[#F5D061] hover:bg-[#141a24]/60 p-2.5 border-l-2 border-transparent hover:border-[#D4AF37] transition-all"
                >
                  {link.name}
                </a>
              ))}

              <div className="pt-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenRegister();
                  }}
                  className="w-full py-3.5 sf-btn-crimson sf-clip-angled text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>REGISTER YOUR SQUAD</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
