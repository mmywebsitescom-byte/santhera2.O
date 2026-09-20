import { Challenge, TimelineEvent, Team, MentorJudge, GalleryItem, Sponsor, FAQItem } from '../types';

export const EVENT_INFO = {
  name: "TECHXERA HACKFEST '26",
  shortName: "HACKFEST '26",
  tagline: "BUILD. BREAK. INNOVATE.",
  secondaryTagline: "48 HOURS. ONE PROBLEM. ONE SOLUTION.",
  dates: "OCTOBER 16 – 18, 2026",
  venue: "INNOVATION ARENA & GLOBAL CYBERSPACES",
  location: "BENGALURU TECH DISTRICT / HYBRID",
  edition: "EDITION 04",
  stats: {
    hours: 48,
    participants: 100,
    challenges: 20,
    prizePool: "₹1,00,000+",
  },
  // Target date for countdown (relative calculation ensures it always displays nicely)
  targetDate: "2026-10-16T09:00:00Z",
};

export const CHALLENGES: Challenge[] = [
  {
    id: 'ai-ml',
    number: '01',
    title: 'AI & MACHINE LEARNING',
    category: 'INTELLIGENCE SYSTEMS',
    shortDescription: 'Build intelligent, autonomous systems that solve high-friction real-world problems using state-of-the-art models.',
    difficulty: 'Advanced',
    skills: ['PyTorch', 'LLMs & Agents', 'Computer Vision', 'FastAPI', 'Vector DBs'],
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    problemStatement: 'Modern industrial, biomedical, and socio-economic systems produce petabytes of complex multi-modal telemetry. Current deterministic software fails when edge conditions change unexpectedly.',
    requirements: [
      'Multi-modal pipeline processing text, sensor, visual, or audio streams.',
      'Sub-200ms latency inference using edge quantization or optimized serving.',
      'Explainable AI metrics explaining decision pathways to operators.',
      'Evaluation benchmark showing resilience against noisy or adversarial inputs.'
    ],
    recommendedTech: ['Python / PyTorch', 'Gemini 1.5 Pro / Flash', 'LangGraph / LlamaIndex', 'Milvus / Qdrant', 'WebAssembly runtime'],
    judgingCriteria: [
      'Novelty of algorithmic solution (30%)',
      'Real-world operational viability (25%)',
      'Latency & efficiency benchmarks (25%)',
      'Human-in-the-loop UX (20%)'
    ],
    expectedOutput: 'Working prototype container with live API demonstration and benchmark report.'
  },
  {
    id: 'web-app',
    number: '02',
    title: 'WEB & APP DEVELOPMENT',
    category: 'DIGITAL INFRASTRUCTURE',
    shortDescription: 'Create useful, blazing-fast, and resilient digital products that scale to millions of concurrent users with zero downtime.',
    difficulty: 'All Levels',
    skills: ['TypeScript', 'Next.js / Vite', 'Distributed Systems', 'Tailwind', 'Realtime WebSockets'],
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop',
    problemStatement: 'Distributed teams and mission-critical workflows suffer from fragmented tooling, high cognitive friction, and clunky legacy interfaces that slow down human collaboration.',
    requirements: [
      'Collaborative real-time synchronization (CRDT or conflict-free sync).',
      'Offline-first architecture with progressive background sync.',
      'Accessible, tactile design achieving 95+ Lighthouse audit scores.',
      'Granular permission and multi-tenant security architecture.'
    ],
    recommendedTech: ['React / Vite / TypeScript', 'Tailwind CSS', 'Node.js / Go', 'PostgreSQL / Supabase', 'WebSockets / WebRTC'],
    judgingCriteria: [
      'UI/UX craftsmanship and fluid micro-interactions (30%)',
      'Architecture scalability and latency resilience (30%)',
      'Feature completeness within 48-hour scope (25%)',
      'Clean modular codebase & documentation (15%)'
    ],
    expectedOutput: 'Deployed web application with interactive collaborative multi-user demo.'
  },
  {
    id: 'cyber-security',
    number: '03',
    title: 'CYBER SECURITY',
    category: 'DEFENSIVE & OFFENSIVE TECH',
    shortDescription: 'Design cryptographic protocols, threat detection tools, and hardened solutions that safeguard digital autonomy.',
    difficulty: 'Advanced',
    skills: ['Rust', 'Zero-Knowledge Proofs', 'Threat Intelligence', 'eBPF', 'Network Analysis'],
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
    problemStatement: 'As software complexity multiplies and autonomous agents proliferate, identity spoofing, credential theft, and supply-chain vulnerabilities compromise global digital safety.',
    requirements: [
      'Automated vulnerability mitigation or real-time anomaly detection engine.',
      'Cryptographically verifiable zero-trust identity assertion.',
      'Low CPU overhead execution suitable for enterprise cloud environments.',
      'Reproducible proof-of-exploit or defensive security hardening test.'
    ],
    recommendedTech: ['Rust / C++', 'eBPF / Linux Kernel APIs', 'Snort / Suricata integration', 'ZK-SNARKs / Circom', 'Docker / K8s security'],
    judgingCriteria: [
      'Cryptographic or defensive soundness (35%)',
      'Detection accuracy & false-positive minimization (30%)',
      'Performance impact on host machine (20%)',
      'Security audit report & documentation (15%)'
    ],
    expectedOutput: 'Reproducible security agent/tool with live test vector demonstration.'
  },
  {
    id: 'iot-robotics',
    number: '04',
    title: 'IOT & ROBOTICS',
    category: 'CYBER-PHYSICAL SYSTEMS',
    shortDescription: 'Connect microcontrollers, sensor meshes, and robotics to cloud orchestrators to transform physical environments.',
    difficulty: 'Intermediate',
    skills: ['Embedded C/C++', 'ROS 2', 'MQTT / WebSockets', 'Hardware Prototyping', 'Spatial Compute'],
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop',
    problemStatement: 'Physical factories, smart cities, and agricultural fields remain detached from actionable predictive intelligence due to brittle device connectivity and power limits.',
    requirements: [
      'Integration between edge hardware (simulated or physical) and dashboard.',
      'Fault-tolerant data queuing over intermittent network conditions.',
      'Low power consumption design with energy budgeting.',
      'Actionable command-and-control telemetry with emergency kill switches.'
    ],
    recommendedTech: ['ESP32 / Raspberry Pi', 'MQTT / gRPC', 'ROS 2 / Gazebo Sim', 'React Dashboard', 'Grafana / InfluxDB'],
    judgingCriteria: [
      'Hardware-software integration fidelity (35%)',
      'Reliability under simulated packet loss (25%)',
      'Sensory data visualization (20%)',
      'Physical safety fail-safes (20%)'
    ],
    expectedOutput: 'Live hardware rig or high-fidelity ROS/Gazebo simulation with sensor streaming.'
  },
  {
    id: 'open-innovation',
    number: '05',
    title: 'OPEN INNOVATION',
    category: 'MOONSHOT & EXPERIMENTAL',
    shortDescription: 'Bring your boldest, uncategorizable idea. From decentralized protocols to neurotech and green computing.',
    difficulty: 'All Levels',
    skills: ['Creativity', 'Cross-Disciplinary', 'Rapid Prototyping', 'User Research', 'Full-Stack'],
    image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=1200&auto=format&fit=crop',
    problemStatement: 'Groundbreaking inventions rarely fit into traditional categories. We give fearless hackers blank-canvas freedom to test radical hypotheses.',
    requirements: [
      'Demonstrable prototype addressing a verified societal or technological challenge.',
      'Clear thesis on why existing approaches fail.',
      'Feasibility roadmap explaining how 48 hours is only the starting point.',
      'Compelling, high-fidelity demo showcasing real execution capability.'
    ],
    recommendedTech: ['Any modern language, framework, API, or hardware platform.'],
    judgingCriteria: [
      'Originality and audacious ambition (40%)',
      'Depth of functional execution within 48h (30%)',
      'Potential impact and viability (20%)',
      'Presentation clarity and stage presence (10%)'
    ],
    expectedOutput: 'Functioning prototype with live product narrative.'
  }
];

export const TIMELINE_EVENTS: TimelineEvent[] = [
  // DAY 01
  {
    id: 'd1-reg',
    day: 'DAY 01',
    time: '09:00 AM',
    title: 'Check-In & Hardware Station Setup',
    description: 'Physical badge collection, hacker kit distribution, and developer network onboarding at the Techxera Arena.',
    milestone: false
  },
  {
    id: 'd1-ceremony',
    day: 'DAY 01',
    time: '10:00 AM',
    title: 'Opening Keynote & Challenge Briefing',
    description: 'Welcome addresses, problem track reveals, rules of engagement, and sponsor API key distribution.',
    milestone: true
  },
  {
    id: 'd1-hack-begins',
    day: 'DAY 01',
    time: '11:00 AM',
    title: 'THE 48-HOUR CLOCK STARTS',
    description: 'Official commencement of hacking. Git repositories initialize and cloud credits unlock.',
    milestone: true
  },
  {
    id: 'd1-team-form',
    day: 'DAY 01',
    time: '02:00 PM',
    title: 'Team Harmonization & Architect Office Hours',
    description: 'Solo hackers match with complementary skillsets; lead system architects review technical blueprints.',
    milestone: false
  },
  {
    id: 'd1-mentor-1',
    day: 'DAY 01',
    time: '08:00 PM',
    title: 'Mentor Round 1: Architecture Review',
    description: 'Industry veterans conduct 1-on-1 desk reviews to stress-test data schemas and execution scope.',
    milestone: false
  },
  // DAY 02
  {
    id: 'd2-checkpoint',
    day: 'DAY 02',
    time: '10:00 AM',
    title: 'Development Checkpoint & Midpoint Sync',
    description: 'First code freeze checkpoint. Teams submit MVP baseline commits to verify pipeline health.',
    milestone: false
  },
  {
    id: 'd2-mentor-2',
    day: 'DAY 02',
    time: '01:00 PM',
    title: 'Mentor Round 2: Pitch & Product Strategy',
    description: 'Design leads and VC mentors coach teams on product storytelling, UI polish, and demo rehearsals.',
    milestone: false
  },
  {
    id: 'd2-final-phase',
    day: 'DAY 02',
    time: '06:00 PM',
    title: 'Final Development Sprint',
    description: 'Midnight coding push, deployment hardening, edge testing, and late-night pizza & energy drinks.',
    milestone: true
  },
  // DAY 03
  {
    id: 'd3-submission',
    day: 'DAY 03',
    time: '10:00 AM',
    title: 'CODE FREEZE & FINAL SUBMISSION',
    description: 'All GitHub repositories, walkthrough videos, and deployed URLs locked into the judging portal.',
    milestone: true
  },
  {
    id: 'd3-demos',
    day: 'DAY 03',
    time: '12:00 PM',
    title: 'Live Project Demonstrations & Science Fair',
    description: 'Interactive exhibition stalls where teams pitch hands-on to attendees and technical evaluators.',
    milestone: false
  },
  {
    id: 'd3-judging',
    day: 'DAY 03',
    time: '03:00 PM',
    title: 'Top 10 Mainstage Finalist Defense',
    description: 'Selected teams present 4-minute live demos on the central stage followed by rapid-fire judge Q&A.',
    milestone: true
  },
  {
    id: 'd3-awards',
    day: 'DAY 03',
    time: '06:00 PM',
    title: 'Grand Finale, Awards & Closing Gala',
    description: 'Announcement of ₹1,00,000+ prize winners, track laurels, and closing celebration party.',
    milestone: true
  }
];

export const TEAMS: Team[] = [
  {
    id: 'team-01',
    number: 'TEAM 01',
    name: 'NEURAL NEXUS',
    project: 'AI Factory Safety Monitor',
    category: 'AI & MACHINE LEARNING',
    members: ['Aarav Sharma', 'Meera Nair', 'Rohan Das', 'Kavya Pillai'],
    summary: 'Computer-vision driven hazard detection for high-voltage industrial plants with real-time audio alarms.',
    stack: ['YOLOv9', 'PyTorch', 'WebAssembly', 'React'],
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'team-02',
    number: 'TEAM 02',
    name: 'QUANTUM FORGE',
    project: 'Zero-Knowledge Health Passports',
    category: 'CYBER SECURITY',
    members: ['Vikram Sen', 'Ananya Iyer', 'Devraj Patel', 'Siddharth Rao'],
    summary: 'Cryptographically private medical record exchange that proves vaccination and consent without revealing identity.',
    stack: ['Rust', 'Circom', 'Solana', 'Tailwind'],
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'team-03',
    number: 'TEAM 03',
    name: 'CYBERPULSE',
    project: 'Autonomous Drone Fleet Dispatch',
    category: 'IOT & ROBOTICS',
    members: ['Tanya George', 'Nikhil Joshi', 'Arjun Kapoor', 'Pooja Hegde'],
    summary: 'Autonomous mesh-networked drone navigation system for flood relief medicine drop with collision avoidance.',
    stack: ['ROS 2', 'PX4 Autopilot', 'MQTT', 'Mapbox GL'],
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'team-04',
    number: 'TEAM 04',
    name: 'HYPERLOOP DEV',
    project: 'Realtime Collaborative Kernel Debugger',
    category: 'WEB & APP DEVELOPMENT',
    members: ['Sahil Varma', 'Divya Menon', 'Kunal Ghosh', 'Rhea Chakraborty'],
    summary: 'Browser-based multiplayer kernel tracing playground with shared visual flame graphs.',
    stack: ['TypeScript', 'eBPF', 'WebSockets', 'Canvas API'],
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'team-05',
    number: 'TEAM 05',
    name: 'SYNAPSE LABS',
    project: 'Neuro-Somatic VR Rehabilitation',
    category: 'OPEN INNOVATION',
    members: ['Aditya Roy', 'Sneha Kulkarni', 'Farhan Akhtar', 'Ishita Banik'],
    summary: 'Bio-feedback limb rehabilitation training app with spatial audio and adaptive neuromuscular games.',
    stack: ['Three.js', 'WebXR', 'Emotiv EEG', 'FastAPI'],
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop'
  }
];

export const MENTORS_JUDGES: MentorJudge[] = [
  {
    id: 'judge-1',
    name: 'Dr. Aris Thorne',
    role: 'Distinguished AI Researcher',
    company: 'DeepScale Labs',
    expertise: ['Generative AI', 'Model Quantization', 'Autonomous Robotics'],
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
    linkedin: 'https://linkedin.com',
    badge: 'Judge'
  },
  {
    id: 'judge-2',
    name: 'Elena Rostova',
    role: 'VP of Engineering',
    company: 'HyperVenture Infrastructure',
    expertise: ['Distributed Systems', 'Cloud Native', 'Kubernetes'],
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop',
    linkedin: 'https://linkedin.com',
    badge: 'Judge'
  },
  {
    id: 'judge-3',
    name: 'Karthik Raman',
    role: 'Principal Security Architect',
    company: 'CyberShield Global',
    expertise: ['Zero-Trust', 'Penetration Testing', 'Cryptographic Hardening'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
    linkedin: 'https://linkedin.com',
    badge: 'Judge'
  },
  {
    id: 'mentor-1',
    name: 'Zane Gallagher',
    role: 'Founding Partner & Angel',
    company: 'Apex Seed Capital',
    expertise: ['Venture Pitching', 'Product Market Fit', 'Go-To-Market'],
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop',
    linkedin: 'https://linkedin.com',
    badge: 'Mentor'
  },
  {
    id: 'mentor-2',
    name: 'Maya Lin',
    role: 'Design Director & Human Interface Lead',
    company: 'Form & Flow Design',
    expertise: ['Design Systems', 'Micro-Interactions', 'Spatial UI'],
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=600&auto=format&fit=crop',
    linkedin: 'https://linkedin.com',
    badge: 'Mentor'
  },
  {
    id: 'mentor-3',
    name: 'Marcus Vance',
    role: 'Staff Roboticist & Hardware Lead',
    company: 'Nexus Dynamics',
    expertise: ['Embedded C', 'Edge TPU', 'ROS 2 Sim'],
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&auto=format&fit=crop',
    linkedin: 'https://linkedin.com',
    badge: 'Mentor'
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Midnight Coding Rush',
    category: 'EVENT',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1000&auto=format&fit=crop',
    caption: 'Devs pushing final algorithmic updates during the 24-hour sprint mark.',
    year: '2025'
  },
  {
    id: 'g2',
    title: 'Mainstage Keynote & Track Reveal',
    category: 'EVENT',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1000&auto=format&fit=crop',
    caption: '100+ innovators gather under the main stage lights as challenges are unveiled.',
    year: '2025'
  },
  {
    id: 'g3',
    title: 'Hardware Prototyping Workshop',
    category: 'WORKSHOPS',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1000&auto=format&fit=crop',
    caption: 'Live debugging on ESP32 microcontrollers and sensor matrices.',
    year: '2025'
  },
  {
    id: 'g4',
    title: 'Grand Champions Trophy Moment',
    category: 'WINNERS',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1000&auto=format&fit=crop',
    caption: 'Team CyberMatrix receiving the 1st prize grant of ₹1,00,000.',
    year: '2025'
  },
  {
    id: 'g5',
    title: 'Architect Collaboration Huddle',
    category: 'TEAMS',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop',
    caption: 'High-focus whiteboarding session translating system topology into microservices.',
    year: '2025'
  },
  {
    id: 'g6',
    title: 'Robotics Autonomous Test Run',
    category: 'PROJECTS',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000&auto=format&fit=crop',
    caption: 'Live field demonstration of an obstacle-dodging robotic companion.',
    year: '2025'
  }
];

export const SPONSORS: Sponsor[] = [
  { id: 's1', name: 'NEXUS CLOUD', tier: 'Title Partner', logoText: 'NEXUS // CLOUD', perk: '₹5,00,000 Cloud Compute Credits' },
  { id: 's2', name: 'CYBERDYNAMICS', tier: 'Title Partner', logoText: 'CYBERDYNAMICS', perk: 'Title Hardware Lab Sponsor' },
  { id: 's3', name: 'APEX VENTURES', tier: 'Platinum', logoText: 'APEX VENTURES', perk: 'Fast-track Seed Investment' },
  { id: 's4', name: 'SYNTHETIC AI', tier: 'Platinum', logoText: 'SYNTHETIC.AI', perk: 'Unlimited LLM API Tokens' },
  { id: 's5', name: 'QUANTUM OS', tier: 'Gold', logoText: 'QUANTUM.OS', perk: 'Developer Workstations' },
  { id: 's6', name: 'HARDWARE ZERO', tier: 'Gold', logoText: 'HW:ZERO', perk: 'Microcontroller Kits' },
  { id: 's7', name: 'VECTOR DB', tier: 'Ecosystem', logoText: 'VECTOR:DB', perk: 'Enterprise Managed Instances' },
  { id: 's8', name: 'SECURENET', tier: 'Ecosystem', logoText: 'SECURE//NET', perk: 'Security Audit Tooling' }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Who can participate?',
    answer: 'Techxera Hackfest is open to university students, recent graduates, independent builders, professional developers, designers, and researchers across the globe. Anyone with passion and grit is welcome.',
    category: 'Eligibility'
  },
  {
    question: 'How many members can be in a team?',
    answer: 'Teams can consist of 1 to 4 members. You can register with a pre-formed team or apply as a solo builder and match with teammates during our Day 01 Team Harmonization session.',
    category: 'Teams'
  },
  {
    question: 'Is the Hackathon online or offline?',
    answer: 'Techxera Hackfest 2026 operates in a hybrid format. 100 shortlisted physical participants will hack at the Bengaluru Innovation Arena with full hardware & stay provisions, while international and remote cohorts participate via our synchronized cyber platform.',
    category: 'Logistics'
  },
  {
    question: 'What technologies can we use?',
    answer: 'You are completely free to use any modern programming languages, libraries, public APIs, cloud infrastructure, AI models, and open-source frameworks. All code must be written during the 48 hours.',
    category: 'Tech'
  },
  {
    question: 'What are the judging criteria?',
    answer: 'Submissions are evaluated on 4 primary dimensions: Innovation & Ambition (30%), Technical Depth & Execution (30%), Practical Impact & Viability (25%), and Design / UX Craftsmanship (15%).',
    category: 'Judging'
  },
  {
    question: 'Is there an entry fee?',
    answer: 'No. Registration and participation are 100% free for all selected builders. We provide meals, beverages, high-speed fiber internet, hardware lab access, cloud credits, and official swags at zero cost.',
    category: 'Fees'
  },
  {
    question: 'What should we submit?',
    answer: 'Before code freeze, your team must submit: 1) A public GitHub repository with commit history, 2) A deployed live demo URL or APK, 3) A 2-minute walkthrough video, and 4) A clear project README detailing problem, solution, and architecture.',
    category: 'Submissions'
  },
  {
    question: 'Can beginners participate?',
    answer: 'Absolutely! We have dedicated beginner tracks, round-the-clock technical mentors, interactive starter workshops, and a dedicated "Best Beginner Team" prize of ₹15,000 to jumpstart your builder journey.',
    category: 'Eligibility'
  }
];

export const HOW_IT_WORKS_STEPS = [
  {
    number: '01',
    title: 'REGISTER',
    tagline: 'Enter the Shadow Arena',
    description: 'Claim your individual warrior credentials or recruit your preliminary cohort. Pass the screening gate to receive your encrypted arena pass.',
    iconName: 'UserCheck'
  },
  {
    number: '02',
    title: 'FORM YOUR SQUAD',
    tagline: 'Assemble 1 to 4 Warriors',
    description: 'Harmonize complemental combat skillsets across algorithmic intelligence, systems engineering, cryptography, and tactile interface craft.',
    iconName: 'Users'
  },
  {
    number: '03',
    title: 'CHOOSE YOUR BATTLEGROUND',
    tagline: 'Lock In One of 5 Arenas',
    description: 'Select your frontline domain: AI & Machine Learning, Digital Infrastructure, Cybersecurity, Cyber-Physical Robotics, or Open Innovation.',
    iconName: 'Crosshair'
  },
  {
    number: '04',
    title: 'BUILD',
    tagline: '48 Hours of Relentless Combat',
    description: 'Execute under the pressure of the clock. Forge architecture, write production tests, and deploy resilient containers with zero downtime.',
    iconName: 'Cpu'
  },
  {
    number: '05',
    title: 'GET MENTORED',
    tagline: 'Guidance from the Masters',
    description: 'Engage with veteran architects, distinguished researchers, and venture scouts to stress-test your design, throughput, and thesis.',
    iconName: 'Sparkles'
  },
  {
    number: '06',
    title: 'SUBMIT',
    tagline: 'Code Freeze & Repositories Locked',
    description: 'Commit your final builds to the immutable ledger. Verify live deployment endpoints, architectural blueprints, and demonstration videos.',
    iconName: 'ShieldCheck'
  },
  {
    number: '07',
    title: 'FACE THE FINAL JUDGING',
    tagline: 'Mainstage Showdown',
    description: 'Top squads demonstrate functioning prototypes live on the mainstage arena, facing rapid cross-examination from master judges.',
    iconName: 'Swords'
  },
  {
    number: '08',
    title: 'BECOME A CHAMPION',
    tagline: 'Glory & ₹1,00,000+ Prize Grant',
    description: 'Stand on the grand podium. Secure direct capital grants, cloud clusters, VC term-sheet pitches, and immortalize your squad.',
    iconName: 'Trophy'
  }
];

export const ARSENAL_ITEMS: import('../types').ArsenalItem[] = [
  {
    id: 'ars-react',
    name: 'React 19 & Next.js',
    category: 'FRAMEWORKS',
    tier: 'Legendary',
    icon: 'Atom',
    description: 'Ultra-low latency reactive rendering engines with server actions and edge streaming.',
    stats: { power: 94, velocity: 98 }
  },
  {
    id: 'ars-ts',
    name: 'TypeScript & Node.js',
    category: 'SYSTEMS & LANGUAGES',
    tier: 'Legendary',
    icon: 'FileCode2',
    description: 'Strict compile-time type safety with asynchronous non-blocking runtime event loops.',
    stats: { power: 96, velocity: 95 }
  },
  {
    id: 'ars-python',
    name: 'Python & PyTorch',
    category: 'AI & AGENTS',
    tier: 'Legendary',
    icon: 'Binary',
    description: 'Tensor computation kernels with GPU acceleration for training and quantized inference.',
    stats: { power: 99, velocity: 90 }
  },
  {
    id: 'ars-rust',
    name: 'Rust & C++',
    category: 'SYSTEMS & LANGUAGES',
    tier: 'Legendary',
    icon: 'Flame',
    description: 'Zero-cost abstractions and memory safety without garbage collection for high-frequency compute.',
    stats: { power: 98, velocity: 99 }
  },
  {
    id: 'ars-agents',
    name: 'Gemini 1.5 & AI Agents',
    category: 'AI & AGENTS',
    tier: 'Epic',
    icon: 'BrainCircuit',
    description: 'Multi-modal reasoning pipelines with 1M+ context window and autonomous tool execution.',
    stats: { power: 97, velocity: 92 }
  },
  {
    id: 'ars-supabase',
    name: 'Supabase & PostgreSQL',
    category: 'DATA & CLOUD',
    tier: 'Epic',
    icon: 'Database',
    description: 'Distributed relational store with real-time change data capture, vector extensions, and auth.',
    stats: { power: 91, velocity: 93 }
  },
  {
    id: 'ars-docker',
    name: 'Docker & Kubernetes',
    category: 'DATA & CLOUD',
    tier: 'Epic',
    icon: 'Layers',
    description: 'Immutable containerization for hermetic, reproducible cloud cluster orchestration.',
    stats: { power: 93, velocity: 88 }
  },
  {
    id: 'ars-ros',
    name: 'ROS 2 & WebSockets',
    category: 'SYSTEMS & LANGUAGES',
    tier: 'Rare',
    icon: 'Radio',
    description: 'Real-time robotics communication middleware for sensory streams and actuator telemetry.',
    stats: { power: 89, velocity: 94 }
  }
];

