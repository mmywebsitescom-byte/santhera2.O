import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface SiteContent {
  eventInfo: {
    name: string;
    shortName: string;
    titleGothic?: string;
    titleAccent?: string;
    tagline: string;
    dates: string;
    venue: string;
    location: string;
    prizePool: string;
    hours: number;
    participants: number;
    edition: string;
    countdownTargetDate?: string;
    [key: string]: unknown;
  };
  eventControl?: {
    countdownTargetDate?: string;
    battlegroundsLocked?: boolean;
    battlegroundsLockedMessage?: string;
    sponsorsLocked?: boolean;
    sponsorsLockedMessage?: string;
    [key: string]: unknown;
  };
  battlegrounds?: {
    title?: string;
    subtitle?: string;
    description?: string;
    tracksCount?: string;
    prizePool?: string;
    duration?: string;
    teamSize?: string;
    bottomCtaText?: string;
    bottomCtaButton?: string;
    [key: string]: unknown;
  };
  hero: {
    titleGothic?: string;
    titleAccent?: string;
    subheadline: string;
    description: string;
    seatsClaimed: number;
    seatsTotal: number;
    capText?: string;
    joinBattleLabel?: string;
    battlegroundsLabel?: string;
    timelineLabel?: string;
    [key: string]: unknown;
  };
  navbar: {
    brandName: string;
    brandAccent?: string;
    brandSubline: string;
    siteLogoUrl?: string;
    [key: string]: unknown;
  };
  mission: {
    badge: string;
    title: string;
    description: string;
    pillar1Title: string;
    pillar1Desc: string;
    pillar2Title: string;
    pillar2Desc: string;
    pillar3Title: string;
    pillar3Desc: string;
    communityBadge?: string;
    communityTitle?: string;
    communityDesc?: string;
    communityBtnLabel?: string;
    communityUrl?: string;
    communityScheduleBtnLabel?: string;
    communityScheduleUrl?: string;
    [key: string]: unknown;
  };
  stats: {
    hours: string;
    hoursLabel: string;
    hoursSub: string;
    prizePool: string;
    prizePoolLabel: string;
    prizePoolSub: string;
    hackers: string;
    hackersLabel: string;
    hackersSub: string;
    tracks: string;
    tracksLabel: string;
    tracksSub: string;
    [key: string]: unknown;
  };
  prizes: {
    poolTotal: string;
    first: string;
    firstSubtitle: string;
    firstDesc: string;
    second: string;
    secondSubtitle: string;
    secondDesc: string;
    third: string;
    thirdSubtitle: string;
    thirdDesc: string;
    special: string;
    specialSubtitle: string;
    specialDesc: string;
    [key: string]: unknown;
  };
  teams: Array<{
    id: string;
    number: string;
    name: string;
    category: string;
  }>;
  faq: Array<{
    id: string;
    question: string;
    answer: string;
    category: string;
  }>;
  footer: {
    contactEmail: string;
    contactPhone: string;
    address: string;
    copyright: string;
    systemStatusText?: string;
    discord?: string;
    github?: string;
    twitter?: string;
    linkedin?: string;
    [key: string]: unknown;
  };
  registrationForm?: {
    isOpen?: boolean;
    title?: string;
    subtitle?: string;
    noticeBanner?: string;
    closedMessage?: string;
    minMembers?: number;
    maxMembers?: number;
    requireGithub?: boolean;
    termsText?: string;
    submitButtonText?: string;
    allowSolo?: boolean;
    [key: string]: unknown;
  };
  challenges?: Array<{
    id: string;
    number?: string;
    title: string;
    category: string;
    difficulty?: string;
    shortDescription?: string;
    problemStatement?: string;
    requirements?: string[];
    recommendedTech?: string[];
    [key: string]: unknown;
  }>;
  timeline?: Array<{
    id: string;
    day: string;
    time: string;
    title: string;
    description: string;
    milestone?: boolean;
    [key: string]: unknown;
  }>;
  sponsors?: Array<{
    id?: string;
    name: string;
    tier: string;
    category?: string;
    logo?: string;
    logoUrl?: string;
    websiteUrl?: string;
    [key: string]: unknown;
  }>;
  loadingScreen?: {
    enabled?: boolean;
    logoUrl?: string;
    showLogo?: boolean;
    presentsText?: string;
    titleGothic?: string;
    titleAccent?: string;
    tagline?: string;
    durationMs?: number;
    allowSkip?: boolean;
    [key: string]: unknown;
  };
  adminSettings?: {
    email?: string;
    passcode?: string;
    [key: string]: unknown;
  };
  registrations?: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

export const initialFallbackContent: SiteContent = {
  eventInfo: {
    name: "TECHXERA HACKFEST '26",
    shortName: "HACKFEST '26",
    titleGothic: "𝚂𝚈𝙽𝚃𝙷𝙰𝚁𝙰2.0",
    titleAccent: "2026",
    tagline: "BUILD. BREAK. INNOVATE.",
    dates: "OCTOBER 16 – 18, 2026",
    venue: "Government College of Engineering Kalahandi",
    location: "Bhawanipatna, Odisha",
    prizePool: "₹1,50,000+",
    hours: 24,
    participants: 200,
    edition: "EDITION 04"
  },
  eventControl: {
    countdownTargetDate: "2026-10-16T09:00:00Z",
    battlegroundsLocked: false,
    battlegroundsLockedMessage: "BATTLEGROUNDS INTEL IS CLASSIFIED. CHECK BACK CLOSER TO THE EVENT DATE.",
    sponsorsLocked: false,
    sponsorsLockedMessage: "SPONSOR ALLIANCES ARE CURRENTLY CLASSIFIED. OFFICIAL PARTNERS WILL BE UNVEILED CLOSER TO LAUNCH."
  },
  battlegrounds: {
    title: "Battlegrounds",
    subtitle: "HACKVERSE '26",
    description: "Five elite combat domains. Choose your battleground wisely — each track tests a different dimension of engineering mastery. Only the most prepared squads will claim the bounty.",
    tracksCount: "5",
    prizePool: "1,50,000+",
    duration: "24 HOURS",
    teamSize: "2-4 WARRIORS",
    bottomCtaText: "CANT DECIDE? REGISTER AND PICK YOUR TRACK ON ARRIVAL.",
    bottomCtaButton: "JOIN THE BATTLE - ITS FREE"
  },
  hero: {
    titleGothic: "𝚂𝚈𝙽𝚃𝙷𝙰𝚁𝙰2.0",
    titleAccent: "2026",
    subheadline: "WHERE WARRIORS CODE // 24 HOURS OF CODE, HARDWARE & INTELLIGENCE",
    description: "Assemble your squad of 2 to 4 engineers at the Government College of Engineering Kalahandi bamboo arena. Non-stop battleground programming, classified quests, and ₹1,50,000+ bounty pool.",
    seatsClaimed: 184,
    seatsTotal: 200,
    capText: "92% CAP // WARRIORS STANDING BY",
    joinBattleLabel: "JOIN THE BATTLE",
    battlegroundsLabel: "BATTLEGROUNDS",
    timelineLabel: "TIMELINE"
  },
  navbar: {
    brandName: "HACKVERSE",
    brandAccent: "'26",
    brandSubline: "BATTLEGROUND // GCEK",
    siteLogoUrl: ""
  },
  mission: {
    badge: "INTEL BRIEF // THE CODEBREAKERS DOCTRINE",
    title: "The Arena of Pure Engineering",
    description: "Forged in the heart of Kalahandi, HackVerse '26 unites 200 of the nation's elite developers, security researchers, and systems architects for an unrelenting 24-hour sprint. Build real solutions, challenge the status quo, and forge your legacy.",
    pillar1Title: "BATTLE TESTED",
    pillar1Desc: "Live evaluation under intense pressure and real-time adversary simulations.",
    pillar2Title: "NO SLEEP CODE",
    pillar2Desc: "24 continuous hours of architecture design, prototyping, and deployment.",
    pillar3Title: "REAL IMPACT",
    pillar3Desc: "Solve mission-critical problem statements with industry mentors and partners."
  },
  stats: {
    hours: "24H",
    hoursLabel: "COMBAT DURATION",
    hoursSub: "NON-STOP SPRINT",
    prizePool: "₹1.5L+",
    prizePoolLabel: "TOTAL BOUNTY POOL",
    prizePoolSub: "GRANTS & CREDITS",
    hackers: "200+",
    hackersLabel: "ELITE WARRIORS",
    hackersSub: "SELECTIVE SCREENING",
    tracks: "5",
    tracksLabel: "BATTLEGROUND TRACKS",
    tracksSub: "CROSS-DOMAIN"
  },
  prizes: {
    poolTotal: "₹1,50,000+",
    first: "₹50,000",
    firstSubtitle: "+ VC BACKING & INCUBATION",
    firstDesc: "The grand victor of HackVerse '26. Direct cash grant wire, official HackVerse champion trophy, and VC investor term-sheet screening.",
    second: "₹30,000",
    secondSubtitle: "+ CLOUD CREDITS",
    secondDesc: "Runner up champions of the arena. Direct cash wire, cloud compute grant package, and silver trophy.",
    third: "₹20,000",
    thirdSubtitle: "+ MENTORSHIP & SWAG",
    thirdDesc: "Second runner up. Direct cash bounty wire, hardware developer toolkits, and bronze trophy.",
    special: "₹50,000",
    specialSubtitle: "TRACK BOUNTIES",
    specialDesc: "Best All-Women Squad, Best Freshman Hack, Best Hardware Integration, and Community Choice."
  },
  teams: [
    { id: "team-01", number: "01", name: "NEURAL NEXUS", category: "AI & MACHINE LEARNING" },
    { id: "team-02", number: "02", name: "CYBER PHANTOM", category: "CYBER SECURITY" },
    { id: "team-03", number: "03", name: "AEROBOTIX", category: "IOT & ROBOTICS" },
    { id: "team-04", number: "04", name: "SOLARIS FORGE", category: "WEB & APP DEVELOPMENT" },
    { id: "team-05", number: "05", name: "QUANTUM SENTINELS", category: "DEFENSIVE SECURITY" },
    { id: "team-06", number: "06", name: "KINETIC OVERLOAD", category: "SYSTEMS & EMBEDDED" },
    { id: "team-07", number: "07", name: "ZERO KNOWLEDGE", category: "CRYPTOGRAPHY" },
    { id: "team-08", number: "08", name: "IRON DRAGON", category: "AUTONOMOUS AGENTS" },
    { id: "team-09", number: "09", name: "HYPERION OPS", category: "CLOUD DISTRIBUTED" },
    { id: "team-10", number: "10", name: "VOID WALKER", category: "BIO-TELEMETRY" }
  ],
  faq: [
    {
      id: "faq-1",
      question: "Who can enlist in HackVerse '26?",
      answer: "Any undergraduate or postgraduate college student, as well as recent graduates and independent researchers. Teams must be 2 to 4 warriors.",
      category: "Eligibility"
    },
    {
      id: "faq-2",
      question: "Is there any registration or entry fee?",
      answer: "Zero fee. HackVerse '26 is 100% free to enter. All meals, hydration, snacks, combat badges, and swag are provided free of cost to shortlisted squads.",
      category: "Fees"
    },
    {
      id: "faq-3",
      question: "What is the team size and composition constraint?",
      answer: "Teams must consist of 2 to 4 members. Inter-college teams are fully permitted and encouraged.",
      category: "Teams"
    },
    {
      id: "faq-4",
      question: "Where is the physical battleground located?",
      answer: "The battleground is hosted at the Government College of Engineering Kalahandi (GCEK), Bhawanipatna, Odisha. High-speed networking, power grids, and designated rest dorms will be active.",
      category: "Logistics"
    },
    {
      id: "faq-5",
      question: "Can I participate solo if I don't have a clan?",
      answer: "Yes! You can register individually, and our harmonization session during check-in will match you with complementary warriors looking for squad mates.",
      category: "Teams"
    },
    {
      id: "faq-6",
      question: "What tech stacks are permitted in the quests?",
      answer: "All modern stacks are allowed: Rust, Python, Go, TypeScript, C++, Solidity, ROS, PyTorch, React, Flutter, and embedded firmwares. You must write the code during the 24-hour sprint.",
      category: "Tech"
    }
  ],
  footer: {
    contactEmail: "codebreakers@gcekbpatna.ac.in",
    contactPhone: "+91 98765 43210",
    address: "Government College of Engineering Kalahandi, Bhawanipatna, Odisha - 766002",
    copyright: "© 2026 HACKVERSE // CODEBREAKERS CLUB GCEK. ALL RIGHTS RESERVED.",
    systemStatusText: "SYSTEM STATUS: REGISTRATIONS OPEN",
    discord: "https://discord.gg",
    github: "https://github.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com"
  },
  registrationForm: {
    isOpen: true,
    title: "WARRIOR REGISTRATION // SQUAD ENLISTMENT",
    subtitle: "Enlist your squad for HackVerse '26. Offline battleground at GCEK Kalahandi.",
    noticeBanner: "⚡ FREE REGISTRATION — MEALS, SWAGS & DORM ACCOMMODATION PROVIDED",
    closedMessage: "Registrations for HackVerse '26 are currently closed. Check back soon or contact support.",
    minMembers: 1,
    maxMembers: 4,
    requireGithub: false,
    termsText: "I certify that all squad members are active university students or researchers and agree to the battleground rules.",
    submitButtonText: "CONFIRM SQUAD ENLISTMENT",
    allowSolo: true
  },
  challenges: [
    {
      id: "ai-ml",
      number: "01",
      title: "AI & MACHINE LEARNING",
      category: "INTELLIGENCE SYSTEMS",
      difficulty: "Advanced",
      shortDescription: "Build intelligent, autonomous systems that solve high-friction real-world problems using state-of-the-art models."
    },
    {
      id: "web-app",
      number: "02",
      title: "WEB & APP DEVELOPMENT",
      category: "DIGITAL INFRASTRUCTURE",
      difficulty: "All Levels",
      shortDescription: "Create useful, blazing-fast, and resilient digital products that scale to millions of concurrent users with zero downtime."
    },
    {
      id: "cyber-security",
      number: "03",
      title: "CYBER SECURITY",
      category: "DEFENSIVE & OFFENSIVE TECH",
      difficulty: "Advanced",
      shortDescription: "Design cryptographic protocols, threat detection tools, and hardened solutions that safeguard digital autonomy."
    },
    {
      id: "iot-robotics",
      number: "04",
      title: "IOT & ROBOTICS",
      category: "CYBER-PHYSICAL SYSTEMS",
      difficulty: "Intermediate",
      shortDescription: "Connect microcontrollers, sensor meshes, and robotics to cloud orchestrators to transform physical environments."
    },
    {
      id: "open-innovation",
      number: "05",
      title: "OPEN INNOVATION",
      category: "MOONSHOT & EXPERIMENTAL",
      difficulty: "All Levels",
      shortDescription: "Bring your boldest, uncategorizable idea. From decentralized protocols to neurotech and green computing."
    }
  ],
  timeline: [
    {
      id: "d1-reg",
      day: "DAY 01",
      time: "09:00 AM",
      title: "Check-In & Hardware Station Setup",
      description: "Physical badge collection, hacker kit distribution, and developer network onboarding at GCEK Arena.",
      milestone: false
    },
    {
      id: "d1-ceremony",
      day: "DAY 01",
      time: "10:00 AM",
      title: "Opening Keynote & Challenge Briefing",
      description: "Welcome addresses, problem track reveals, rules of engagement, and sponsor API key distribution.",
      milestone: true
    },
    {
      id: "d1-hack-begins",
      day: "DAY 01",
      time: "11:00 AM",
      title: "THE 24-HOUR CLOCK STARTS",
      description: "Official commencement of hacking. Git repositories initialize and cloud credits unlock.",
      milestone: true
    },
    {
      id: "d1-mentor-1",
      day: "DAY 01",
      time: "04:00 PM",
      title: "Mentor Round: Architecture Review",
      description: "Industry veterans conduct desk reviews to stress-test data schemas and execution scope.",
      milestone: false
    },
    {
      id: "d2-submission",
      day: "DAY 02",
      time: "11:00 AM",
      title: "CODE FREEZE & FINAL SUBMISSION",
      description: "All GitHub repositories, walkthrough videos, and deployed URLs locked into the judging portal.",
      milestone: true
    },
    {
      id: "d2-awards",
      day: "DAY 02",
      time: "04:00 PM",
      title: "Grand Finale, Awards & Closing Ceremony",
      description: "Announcement of ₹1,50,000+ prize winners, track laurels, and closing celebration.",
      milestone: true
    }
  ],
  sponsors: [
    {
      id: "sp-1",
      name: "NEO COMPUTE LABS",
      tier: "Title Partner",
      category: "High-Performance Cloud Infrastructure"
    },
    {
      id: "sp-2",
      name: "CYBERNETIC VENTURES",
      tier: "Title Partner",
      category: "Pre-Seed Hacker Capital & Incubation"
    },
    {
      id: "sp-3",
      name: "QUANTUM PROTOCOL",
      tier: "Platinum",
      category: "Zero-Knowledge Cryptography"
    },
    {
      id: "sp-4",
      name: "ROBOTIX FOUNDATION",
      tier: "Platinum",
      category: "Embedded Systems & Hardware Labs"
    },
    {
      id: "sp-5",
      name: "DEVNEXUS",
      tier: "Gold",
      category: "Developer Tooling & SDKs"
    },
    {
      id: "sp-6",
      name: "SYNAPSE AI",
      tier: "Ecosystem",
      category: "Model API & Grant Partner"
    }
  ],
  loadingScreen: {
    enabled: true,
    logoUrl: "",
    showLogo: true,
    presentsText: "TECHXERA PRESENTS",
    titleGothic: "𝚂𝚈𝙽𝚃𝙷𝙰𝚁𝙰2.0",
    titleAccent: "2026",
    tagline: "BUILD THE FUTURE • ENTER THE ARENA",
    durationMs: 4600,
    allowSkip: true
  },
  adminSettings: {
    email: "techxerahack@gmail.com",
    passcode: "Techxera@gmail.2026"
  },
  registrations: []
};

interface ContentContextType {
  content: SiteContent;
  refreshContent: () => Promise<void>;
  loading: boolean;
}

const ContentContext = createContext<ContentContextType>({
  content: initialFallbackContent,
  refreshContent: async () => {},
  loading: false,
});

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(initialFallbackContent);
  const [loading, setLoading] = useState(true);

  const refreshContent = useCallback(async () => {
    // 1. Try fetching from Supabase Cloud Database first
    try {
      const { data: sbRow, error: sbErr } = await supabase
        .from('site_content')
        .select('content')
        .eq('id', 'hackverse_2026')
        .maybeSingle();

      if (!sbErr && sbRow?.content && typeof sbRow.content === 'object') {
        const data = sbRow.content as Record<string, any>;
        setContent((prev) => ({
          ...prev,
          ...data,
          eventInfo: { ...prev.eventInfo, ...(data.eventInfo || {}) },
          eventControl: { ...prev.eventControl, ...(data.eventControl || {}) },
          hero: { ...prev.hero, ...(data.hero || {}) },
          navbar: { ...prev.navbar, ...(data.navbar || {}) },
          mission: { ...prev.mission, ...(data.mission || {}) },
          stats: { ...prev.stats, ...(data.stats || {}) },
          prizes: { ...prev.prizes, ...(data.prizes || {}) },
          footer: { ...prev.footer, ...(data.footer || {}) },
          registrationForm: { ...prev.registrationForm, ...(data.registrationForm || {}) },
          battlegrounds: { ...prev.battlegrounds, ...(data.battlegrounds || {}) },
          challenges: Array.isArray(data.challenges) ? data.challenges : prev.challenges,
          timeline: Array.isArray(data.timeline) ? data.timeline : prev.timeline,
          sponsors: Array.isArray(data.sponsors) ? data.sponsors : prev.sponsors,
          adminSettings: { ...prev.adminSettings, ...(data.adminSettings || {}) },
          loadingScreen: { ...prev.loadingScreen, ...(data.loadingScreen || {}) },
          teams: Array.isArray(data.teams) ? data.teams : prev.teams,
          faq: Array.isArray(data.faq) ? data.faq : prev.faq,
        }));
        setLoading(false);
        return;
      }
    } catch (sbErr) {
      console.warn('Supabase content fetch notice, trying local API:', sbErr);
    }

    // 2. Fallback to local server API / content.json
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object') {
          setContent((prev) => ({
            ...prev,
            ...data,
            eventInfo: { ...prev.eventInfo, ...(data.eventInfo || {}) },
            eventControl: { ...prev.eventControl, ...(data.eventControl || {}) },
            hero: { ...prev.hero, ...(data.hero || {}) },
            navbar: { ...prev.navbar, ...(data.navbar || {}) },
            mission: { ...prev.mission, ...(data.mission || {}) },
            stats: { ...prev.stats, ...(data.stats || {}) },
            prizes: { ...prev.prizes, ...(data.prizes || {}) },
            footer: { ...prev.footer, ...(data.footer || {}) },
            registrationForm: { ...prev.registrationForm, ...(data.registrationForm || {}) },
            battlegrounds: { ...prev.battlegrounds, ...(data.battlegrounds || {}) },
            challenges: Array.isArray(data.challenges) ? data.challenges : prev.challenges,
            timeline: Array.isArray(data.timeline) ? data.timeline : prev.timeline,
            sponsors: Array.isArray(data.sponsors) ? data.sponsors : prev.sponsors,
            adminSettings: { ...prev.adminSettings, ...(data.adminSettings || {}) },
            loadingScreen: { ...prev.loadingScreen, ...(data.loadingScreen || {}) },
            teams: Array.isArray(data.teams) ? data.teams : prev.teams,
            faq: Array.isArray(data.faq) ? data.faq : prev.faq,
          }));
        }
      }
    } catch (err) {
      console.warn('API content fetch notice: using built-in content state.', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshContent();

    // Supabase Realtime Channel: Listen for immediate database updates across all clients
    let channel: any = null;
    try {
      channel = supabase
        .channel('public:site_content_live')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'site_content' },
          (payload) => {
            if (payload?.new && (payload.new as any)?.content) {
              const data = (payload.new as any).content;
              setContent((prev) => ({
                ...prev,
                ...data,
                eventInfo: { ...prev.eventInfo, ...(data.eventInfo || {}) },
                eventControl: { ...prev.eventControl, ...(data.eventControl || {}) },
                hero: { ...prev.hero, ...(data.hero || {}) },
                navbar: { ...prev.navbar, ...(data.navbar || {}) },
                mission: { ...prev.mission, ...(data.mission || {}) },
                stats: { ...prev.stats, ...(data.stats || {}) },
                prizes: { ...prev.prizes, ...(data.prizes || {}) },
                footer: { ...prev.footer, ...(data.footer || {}) },
                registrationForm: { ...prev.registrationForm, ...(data.registrationForm || {}) },
                battlegrounds: { ...prev.battlegrounds, ...(data.battlegrounds || {}) },
                challenges: Array.isArray(data.challenges) ? data.challenges : prev.challenges,
                timeline: Array.isArray(data.timeline) ? data.timeline : prev.timeline,
                sponsors: Array.isArray(data.sponsors) ? data.sponsors : prev.sponsors,
                adminSettings: { ...prev.adminSettings, ...(data.adminSettings || {}) },
                loadingScreen: { ...prev.loadingScreen, ...(data.loadingScreen || {}) },
                teams: Array.isArray(data.teams) ? data.teams : prev.teams,
                faq: Array.isArray(data.faq) ? data.faq : prev.faq,
              }));
            } else {
              refreshContent();
            }
          }
        )
        .subscribe();
    } catch (e) {
      console.warn("Realtime subscription notice:", e);
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [refreshContent]);

  return (
    <ContentContext.Provider value={{ content, refreshContent, loading }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useSiteContent = () => useContext(ContentContext);
