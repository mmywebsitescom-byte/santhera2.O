interface WarriorSilhouetteProps {
  className?: string;
  variant?: 'hero-standing' | 'combat-stance' | 'dual-duel' | 'guardian';
  glowColor?: 'crimson' | 'ember' | 'blue';
}

export default function WarriorSilhouette({
  className = '',
  variant = 'hero-standing',
  glowColor = 'crimson',
}: WarriorSilhouetteProps) {
  const getGlowFilter = () => {
    switch (glowColor) {
      case 'ember':
        return 'drop-shadow(0 0 15px rgba(255, 85, 0, 0.6)) drop-shadow(0 0 35px rgba(255, 40, 0, 0.3))';
      case 'blue':
        return 'drop-shadow(0 0 15px rgba(14, 165, 233, 0.6)) drop-shadow(0 0 35px rgba(2, 132, 199, 0.3))';
      case 'crimson':
      default:
        return 'drop-shadow(0 0 18px rgba(220, 38, 38, 0.7)) drop-shadow(0 0 40px rgba(185, 28, 28, 0.4))';
    }
  };

  if (variant === 'combat-stance') {
    // Combat ready silhouette (original low stance with energized dual digital blades)
    return (
      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ filter: getGlowFilter() }}
      >
        <defs>
          <linearGradient id="bladeGradStance" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="50%" stopColor="#FF5500" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>
          <radialGradient id="rimGlowStance" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#DC2626" stopOpacity="0.8" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient backlight */}
        <circle cx="250" cy="230" r="140" fill="url(#rimGlowStance)" opacity="0.3" />

        {/* Head & Hood Silhouette */}
        <path
          d="M245 125 C230 130 220 145 220 165 C220 180 230 195 240 200 C242 201 258 201 260 200 C270 195 280 180 280 165 C280 145 270 130 255 125 Z"
          fill="#060606"
          stroke="#DC2626"
          strokeWidth="1.5"
        />

        {/* Cyber Eyes / Visor slit */}
        <path d="M236 160 L248 162" stroke="#FF5500" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M252 162 L264 160" stroke="#FF5500" strokeWidth="2.5" strokeLinecap="round" />

        {/* Neck & Shoulder Armor */}
        <path
          d="M232 195 L200 225 L160 270 L185 285 L220 250 L230 280 L270 280 L280 250 L315 285 L340 270 L300 225 L268 195 Z"
          fill="#050505"
          stroke="#DC2626"
          strokeWidth="1.5"
        />

        {/* Torso & Robes */}
        <path
          d="M225 245 L190 340 L210 390 L245 350 L255 350 L290 390 L310 340 L275 245 Z"
          fill="#030303"
          stroke="#991B1B"
          strokeWidth="1.2"
        />

        {/* Front Combat Leg */}
        <path
          d="M210 370 L160 410 L120 460 L165 470 L195 435 L230 380 Z"
          fill="#050505"
          stroke="#DC2626"
          strokeWidth="1.2"
        />

        {/* Back Leg Extended Stance */}
        <path
          d="M275 375 L330 420 L380 465 L410 465 L360 410 L290 370 Z"
          fill="#050505"
          stroke="#DC2626"
          strokeWidth="1.2"
        />

        {/* Digital Katana / Code Blade 1 */}
        <path
          d="M165 275 L70 210 L30 170 L35 165 L85 200 L180 265 Z"
          fill="url(#bladeGradStance)"
          opacity="0.9"
        />

        {/* Dual Blade 2 (Raised Guard) */}
        <path
          d="M330 275 L420 200 L465 145 L460 140 L410 190 L320 265 Z"
          fill="url(#bladeGradStance)"
          opacity="0.9"
        />
      </svg>
    );
  }

  // Default: Hero Standing mysterious silhouette with backlit crimson aura and cloak
  return (
    <svg
      viewBox="0 0 600 700"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ filter: getGlowFilter() }}
    >
      <defs>
        <radialGradient id="heroBackAura" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#DC2626" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#FF5500" stopOpacity="0.45" />
          <stop offset="75%" stopColor="#7F1D1D" stopOpacity="0.15" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="bladeGradHero" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="30%" stopColor="#FF5500" />
          <stop offset="70%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#7F1D1D" />
        </linearGradient>

        <linearGradient id="rimRedHero" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#DC2626" />
          <stop offset="50%" stopColor="#FF5500" />
          <stop offset="100%" stopColor="#DC2626" />
        </linearGradient>
      </defs>

      {/* Atmospheric Moon/Aura behind head */}
      <circle cx="300" cy="240" r="160" fill="url(#heroBackAura)" />

      {/* Rim light aura ring */}
      <circle
        cx="300"
        cy="240"
        r="150"
        stroke="#DC2626"
        strokeWidth="1"
        strokeDasharray="6 12"
        opacity="0.4"
      />

      {/* Flowing Scarf / Shadow Ribbon */}
      <path
        d="M280 180 C240 185 200 170 170 145 C150 128 140 95 120 70 C145 90 180 120 220 135 C250 148 275 160 280 180 Z"
        fill="#DC2626"
        opacity="0.75"
      />
      <path
        d="M320 180 C360 185 400 170 430 145 C450 128 460 95 480 70 C455 90 420 120 380 135 C350 148 325 160 320 180 Z"
        fill="#FF5500"
        opacity="0.55"
      />

      {/* Head / Hood Silhouette */}
      <path
        d="M295 120 C270 125 255 145 255 175 C255 195 268 215 285 225 C295 228 305 228 315 225 C332 215 345 195 345 175 C345 145 330 125 305 120 Z"
        fill="#040404"
        stroke="url(#rimRedHero)"
        strokeWidth="2.5"
      />

      {/* Martial Shadow Visor Eyes */}
      <path
        d="M275 178 L292 181"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{ filter: 'drop-shadow(0 0 6px #FFFFFF)' }}
      />
      <path
        d="M308 181 L325 178"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{ filter: 'drop-shadow(0 0 6px #FFFFFF)' }}
      />

      {/* Shoulder Pauldrons & Cloak Silhouette */}
      <path
        d="M255 210 L195 245 L130 310 L175 350 L230 285 L260 340 L340 340 L370 285 L425 350 L470 310 L405 245 L345 210 Z"
        fill="#050505"
        stroke="#DC2626"
        strokeWidth="2"
      />

      {/* Armored Chest & Shadow Robes */}
      <path
        d="M250 270 L210 440 L240 560 L295 490 L305 490 L360 560 L390 440 L350 270 Z"
        fill="#020202"
        stroke="#B91C1C"
        strokeWidth="1.5"
      />

      {/* Wide Cloak Flaps descending */}
      <path
        d="M175 340 L140 480 L120 650 L200 660 L230 520 L205 380 Z"
        fill="#040404"
        stroke="#7F1D1D"
        strokeWidth="1"
      />
      <path
        d="M425 340 L460 480 L480 650 L400 660 L370 520 L395 380 Z"
        fill="#040404"
        stroke="#7F1D1D"
        strokeWidth="1"
      />

      {/* Legs & Combat Boots */}
      <path
        d="M255 490 L235 590 L220 680 L270 690 L285 600 L295 490 Z"
        fill="#050505"
        stroke="#DC2626"
        strokeWidth="1.5"
      />
      <path
        d="M345 490 L365 590 L380 680 L330 690 L315 600 L305 490 Z"
        fill="#050505"
        stroke="#DC2626"
        strokeWidth="1.5"
      />

      {/* Ground Shadow Smoke Reflection */}
      <ellipse cx="300" cy="685" rx="180" ry="14" fill="#000000" opacity="0.95" />

      {/* Vertical Great Sword / Code Blade embedded into ground */}
      <path
        d="M298 250 L298 670 L302 670 L302 250 Z"
        fill="url(#bladeGradHero)"
        opacity="0.95"
      />
      {/* Sword Guard */}
      <path
        d="M275 295 L325 295"
        stroke="#DC2626"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Sword Pommel Glow */}
      <circle cx="300" cy="245" r="5" fill="#FFFFFF" style={{ filter: 'drop-shadow(0 0 8px #FF5500)' }} />
    </svg>
  );
}
