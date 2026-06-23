import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { 
  Menu, X, Github, Linkedin, Mail, ArrowUpRight, 
  Cpu, Code, Terminal, Layers, Palette, Video, ChevronDown, Monitor,
  Send, Sparkles, Download, FileText, MapPin, ExternalLink
} from 'lucide-react';

// --- Embedded Animations / Dividers ---
import { LiquidBlobCanvas } from './components/LiquidBlobCanvas';
import { ParticleConstellationCanvas } from './components/ParticleConstellationCanvas';
import { RotatingGridCanvas } from './components/RotatingGridCanvas';
import { RipplePulseBackground } from './components/RipplePulseBackground';
import { FlowingSVGDivider } from './components/FlowingSVGDivider';

// --- Resume Data ---
import { CV_ASCII_URI, CV_HTML_URI } from './cvData';

// --- Components ---
import { QuantumLab } from './components/QuantumLab';
import { ThreeQuantumSkillsBg } from './components/ThreeQuantumSkillsBg';
import { CreativeLoader } from './components/CreativeLoader';

const Navbar = ({ 
  onBackToHost,
  activeIndex,
  onNavigate
}: { 
  onBackToHost?: () => void;
  activeIndex?: number;
  onNavigate?: (index: number) => void;
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' },
  ];

  const sectionIndices: Record<string, number> = {
    'About': 0,
    'Skills': 1,
    'Projects': 2,
    'Experience': 3,
    'Contact': 4
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'glass py-3 md:py-4' : 'bg-transparent py-4 md:py-8'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <a 
          href="#home" 
          onClick={(e) => {
            if (onBackToHost) {
              e.preventDefault();
              onBackToHost();
            }
          }}
          className="text-2xl font-display font-bold tracking-tighter text-white hover:text-white/80 transition-colors"
        >
          RAXORBILL<span className="text-white/40">.</span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              onClick={(e) => {
                if (link.name === 'Home') {
                  if (onBackToHost) {
                    e.preventDefault();
                    onBackToHost();
                  }
                } else if (onNavigate && sectionIndices[link.name] !== undefined) {
                  e.preventDefault();
                  onNavigate(sectionIndices[link.name]);
                }
              }}
              className={`text-sm font-medium tracking-widest uppercase transition-colors duration-300 ${
                activeIndex === sectionIndices[link.name]
                  ? 'text-[#00d2ff] font-semibold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 w-full bg-black border-t border-white/10 p-8 md:hidden flex flex-col space-y-6"
          >
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  if (link.name === 'Home') {
                    if (onBackToHost) {
                      e.preventDefault();
                      onBackToHost();
                    }
                  } else if (onNavigate && sectionIndices[link.name] !== undefined) {
                    e.preventDefault();
                    onNavigate(sectionIndices[link.name]);
                  }
                }}
                className={`text-lg font-medium tracking-widest uppercase transition-colors duration-300 ${
                  activeIndex === sectionIndices[link.name]
                    ? 'text-[#00d2ff] font-semibold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {link.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const WelcomePage = ({ onEnter }: { onEnter: () => void; key?: string }) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Wheel scroll/touch detection for entering
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 10) {
        onEnter();
      }
    };
    
    // Touch swipe gesture detection for mobile devices
    let startY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      if (startY - currentY > 50) { // Swiped up
        onEnter();
      }
    };

    window.addEventListener('wheel', handleWheel);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [onEnter]);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Magnetic pull coefficient
    setCoords({ x: x * 0.35, y: y * 0.35 });
  };

  const handleMouseLeave = () => {
    setCoords({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        scale: 1.05, 
        filter: 'blur(10px)',
        transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } 
      }}
      className="relative w-full h-screen flex flex-col items-center justify-center text-center px-6 z-30 select-none overflow-hidden"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Small System Label */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-white/40 tracking-[0.6em] uppercase text-[9px] sm:text-[10px] mb-4 sm:mb-8 font-mono font-medium text-center"
        >
          &lt; SYSTEM_RAXORBILL_OS /&gt;
        </motion.p>

        {/* Hero Headings */}
        <div className="space-y-3 mb-6 sm:mb-10 overflow-hidden py-2 px-4">
          <motion.h1
            initial={{ opacity: 0, y: 50, letterSpacing: '0.1em' }}
            animate={{ opacity: 1, y: 0, letterSpacing: '0.05em' }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-display font-extrabold uppercase text-white tracking-[0.05em] leading-none"
          >
            WELCOME
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs sm:text-sm md:text-2xl lg:text-3xl font-light tracking-[0.2em] sm:tracking-[0.3em] text-white/50 uppercase"
          >
            EXPLORE THE PORTFOLIO
          </motion.h2>
        </div>

        {/* Subtitle description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs sm:text-sm md:text-base text-white/40 max-w-lg mx-auto font-light leading-relaxed mb-8 sm:mb-16 tracking-wide px-4"
        >
          A curated digital space exploring creativity,
          <br className="hidden md:block" />
          technology, intelligent systems, and ideas.
        </motion.p>

        {/* Magnetic ENTER Activation Button */}
        <motion.button
          onClick={onEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={() => setIsHovered(true)}
          animate={{ x: coords.x, y: coords.y }}
          transition={{ type: "spring", stiffness: 180, damping: 15 }}
          className="relative group px-8 py-4 sm:px-12 sm:py-5 border border-white/25 hover:border-white text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] flex items-center gap-4 bg-transparent cursor-pointer overflow-hidden transition-all duration-300 select-none shadow-[inset_0_0_0_1px_rgba(255,255,255,0)] hover:shadow-[0_0_25px_rgba(255,255,255,0.15)] outline-none"
        >
          {/* Soft inner glow translation effect */}
          <span className="relative z-10 flex items-center gap-3">
            ENTER
            <motion.span
              animate={{ x: isHovered ? 4 : 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              →
            </motion.span>
          </span>
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-white/5 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
        </motion.button>
      </div>

      {/* Futuristic floating OS cue at bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        onClick={onEnter}
        className="absolute bottom-12 flex flex-col items-center gap-3 cursor-pointer group"
      >
        <span className="text-[10px] tracking-[0.4em] uppercase text-white/30 font-mono group-hover:text-white/60 transition-colors">
          SCROLL OR ENTER →
        </span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
      </motion.div>
    </motion.div>
  );
};

const SectionHeading = ({ children, subtitle }: { children: ReactNode, subtitle?: string }) => {
  return (
    <div className="mb-6 sm:mb-10 md:mb-16 relative select-none flex flex-col items-center md:items-start text-center md:text-left">
      {subtitle && (
        <motion.p 
          initial={{ opacity: 0, x: -10, letterSpacing: '0.2em' }}
          whileInView={{ opacity: 0.4, x: 0, letterSpacing: '0.4em' }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-white/40 font-mono text-[9px] sm:text-[10px] uppercase mb-2 sm:mb-4 tracking-widest text-[#00d2ff]"
        >
          {subtitle}
        </motion.p>
      )}
      
      <motion.h2 
        initial={{ opacity: 0, y: 30, filter: 'blur(5px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="text-3xl sm:text-4xl md:text-7xl font-display font-bold tracking-tightest leading-tight"
      >
        {children}
      </motion.h2>
      
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: 80 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        className="h-[2px] bg-gradient-to-r from-white to-white/10 mt-8 relative overflow-hidden"
      >
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-80"
        />
      </motion.div>
    </div>
  );
};

const scrollFadeUp = {
  hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } 
  }
};

const scrollScaleIn = {
  hidden: { opacity: 0, scale: 0.95, filter: 'blur(8px)' },
  visible: { 
    opacity: 1, 
    scale: 1, 
    filter: 'blur(0px)',
    transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] } 
  }
};

// --- Beautiful Apple-style Endlessly Enduring Scrolling Marquetape ---
const ScrollingMarquee = ({ items, speed = 25, direction = "left" }: { items: string[], speed?: number, direction?: "left" | "right" }) => {
  const containerItems = [...items, ...items, ...items]; // Duplicate to make seamless loop
  return (
    <div className="w-full overflow-hidden bg-white/[0.01] border-y border-white/5 py-4 relative select-none">
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
      
      <motion.div 
        animate={{ x: direction === "left" ? ["0%", "-33.33%"] : ["-33.33%", "0%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
        className="flex whitespace-nowrap gap-12 text-[10px] font-mono tracking-[0.25em] uppercase text-white/40 items-center w-max pl-6"
      >
        {containerItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <span className="w-1.5 h-1.5 bg-white/30 rotate-45" />
            <span>{item}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// --- Cute Ambient Floating/Running Background Digital Bits ---
const FloatingCyberParticles = () => {
  // Random configurations for cute background floating particles
  const particles = [
    { text: "(*^.^*)", left: "8%", top: "15%", duration: 18, delay: 0 },
    { text: "0xFC3B", left: "85%", top: "8%", duration: 15, delay: 2 },
    { text: "(•ᴥ•)", left: "20%", top: "45%", duration: 25, delay: 1 },
    { text: "PORT_3000", left: "75%", top: "35%", duration: 20, delay: 4 },
    { text: "(^_^)ノ", left: "5%", top: "70%", duration: 22, delay: 3 },
    { text: "CORE_LOAD: 4%", left: "88%", top: "68%", duration: 19, delay: 5 },
    { text: "(o_O)", left: "12%", top: "82%", duration: 24, delay: 2 },
    { text: "(✿◠‿◠)", left: "82%", top: "85%", duration: 21, delay: 0 },
    { text: "RUN_OK", left: "40%", top: "92%", duration: 16, delay: 6 },
    { text: "┌( ಠ_ಠ)┘", left: "68%", top: "52%", duration: 27, delay: 1 }
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none opacity-20">
      {particles.map((p, idx) => (
        <motion.div
          key={idx}
          className="absolute font-mono text-[9px] text-white/40 bg-white/[0.02] border border-white/5 rounded px-2 py-1 tracking-widest uppercase whitespace-nowrap"
          style={{ left: p.left, top: p.top }}
          animate={{
            y: [0, -80, 0],
            x: [0, idx % 2 === 0 ? 40 : -40, 0],
            rotate: [0, idx % 2 === 0 ? 8 : -8, 0],
            opacity: [0.15, 0.45, 0.15]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut"
          }}
        >
          <span className="inline-block mr-1.5 w-1 h-1 bg-white/40 rounded-full animate-ping" />
          {p.text}
        </motion.div>
      ))}
    </div>
  );
};

// --- Cute AI Cyber Companion "BYTE" (The Soulful Companion Edition) ---
interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  downloadUrl?: string;
  downloadName?: string;
  formUrl?: string;
}

export const RaxBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      sender: "bot",
      text: "Hey!! Welcome! (*^.^*) I'm Byte, Tanjim's virtual assistant helper! So glad to have you here! Let me know if you would like me to guide you around!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [faceExpression, setFaceExpression] = useState<'idle' | 'curious' | 'startled' | 'peeking' | 'happy' | 'sleeping'>('idle');
  const [bubbleText, setBubbleText] = useState<string>("Hey!! Welcome! (*^.^*) 🩵");
  const [isScrolling, setIsScrolling] = useState(false);
  const [isStartled, setIsStartled] = useState(false);
  const [isWakingUp, setIsWakingUp] = useState(false);
  const [zzzList, setZzzList] = useState<{ id: number; left: number; top: number; delay: number }[]>([]);
  const [tempBotMessage, setTempBotMessage] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isMobileScreen, setIsMobileScreen] = useState(window.innerWidth < 768);

  const byteContainerRef = useRef<HTMLDivElement>(null);
  const bubbleContainerRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Keep references to prevent render lag in the requestAnimationFrame loop
  const posRef = useRef({ x: window.innerWidth - 120, y: window.innerHeight - 150 });
  const targetRef = useRef({ x: window.innerWidth - 120, y: window.innerHeight - 150 });
  const velRef = useRef({ x: 0, y: 0 });
  const tiltRef = useRef(0);
  
  const isChatOpenRef = useRef(false);
  const isPeekingRef = useRef(false);
  const isSleepingRef = useRef(false);
  const lastActivityRef = useRef(Date.now());
  const wakeUpNeededRef = useRef(false);
  const isFirstRender = useRef(true);
  
  const scrollTimeoutRef = useRef<any>(null);
  const faceTimerRef = useRef<any>(null);
  const duckTimeoutRef = useRef<any>(null);

  // Clear the initial welcome floating bubble after 5 seconds on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setBubbleText("");
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    isChatOpenRef.current = isOpen;
    if (isOpen) {
      setFaceExpression('happy');
      setBubbleText("");
      isFirstRender.current = false;
    } else {
      setFaceExpression('idle');
      if (isFirstRender.current) {
        isFirstRender.current = false;
      } else {
        setBubbleText("Hiyyaa!! 🩵 i'm happily roaming around, feel free to tap me if you need anything!");
      }
    }
  }, [isOpen]);

  // Handle window resizing
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setIsMobileScreen(isMobile);
      const minX = isMobile ? window.innerWidth - 100 : 100;
      const maxX = isMobile ? window.innerWidth - 30 : window.innerWidth - 120;
      const minY = isMobile ? window.innerHeight - 115 : 100;
      const maxY = isMobile ? window.innerHeight - 75 : window.innerHeight - 150;
      
      targetRef.current = {
        x: Math.max(minX, Math.min(maxX, targetRef.current.x)),
        y: Math.max(minY, Math.min(maxY, targetRef.current.y))
      };
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update scroll center and activity trackers on scroll
  useEffect(() => {
    const handleScroll = () => {
      lastActivityRef.current = Date.now();
      if (wakeUpNeededRef.current) {
        triggerWakeUp();
      }

      setIsScrolling(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 800);

      if (isChatOpenRef.current || isPeekingRef.current || isSleepingRef.current) return;

      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollRatio = docHeight > 0 ? window.scrollY / docHeight : 0;
      
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        const targetScrollY = scrollRatio * (window.innerHeight * 0.15) + (window.innerHeight - 110);
        targetRef.current.y = targetScrollY;
      } else {
        const targetScrollY = scrollRatio * (window.innerHeight - 250) + 120;
        targetRef.current.y = targetScrollY;
      }

      // Curious look while fast scrolling
      if (faceExpression !== 'curious' && faceExpression !== 'startled') {
        setFaceExpression('curious');
        if (faceTimerRef.current) clearTimeout(faceTimerRef.current);
        faceTimerRef.current = setTimeout(() => {
          setFaceExpression('idle');
        }, 1200);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [faceExpression]);

  // Cursor tracking & Affectionate pet routines
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      lastActivityRef.current = now;
      if (wakeUpNeededRef.current) {
        triggerWakeUp();
      }

      const isMobile = window.innerWidth < 768;
      if (isMobile || isChatOpenRef.current) return;

      const curX = posRef.current.x + 38; // Center x
      const curY = posRef.current.y + 38; // Center y
      const dist = Math.hypot(e.clientX - curX, e.clientY - curY);

      if (isSleepingRef.current) return;

      if (dist < 65) {
        // Super happy and friendly reaction when cursor is close! (Owner's pet companion)
        setFaceExpression('happy');
        
        // Tilt happily towards cursor
        const followTilt = Math.max(-15, Math.min(15, (e.clientX - curX) * 0.25));
        tiltRef.current = followTilt;
        
        // Affectionately nudge closer to the cursor as a loving pet
        const targetX = e.clientX - 38;
        const targetY = e.clientY - 38;
        
        targetRef.current = {
          x: Math.max(40, Math.min(window.innerWidth - 120, targetX)),
          y: Math.max(40, Math.min(window.innerHeight - 150, targetY))
        };
      } else if (dist < 180) {
        // Curious friendly face, floating softly towards your cursor
        setFaceExpression('curious');
        
        const followTilt = Math.max(-10, Math.min(10, (e.clientX - curX) * 0.1));
        tiltRef.current = followTilt;

        // Move a bit closer to look at it
        const ratio = 0.45;
        const targetX = posRef.current.x + (e.clientX - curX) * ratio;
        const targetY = posRef.current.y + (e.clientY - curY) * ratio;

        targetRef.current = {
          x: Math.max(40, Math.min(window.innerWidth - 120, targetX)),
          y: Math.max(40, Math.min(window.innerHeight - 150, targetY))
        };
      } else if (dist >= 180 && (faceExpression === 'curious' || faceExpression === 'happy')) {
        setFaceExpression('idle');
        tiltRef.current = 0;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      const now = Date.now();
      lastActivityRef.current = now;
      if (wakeUpNeededRef.current) {
        triggerWakeUp();
      }

      if (isChatOpenRef.current) return;

      const curX = posRef.current.x + 38;
      const curY = posRef.current.y + 38;
      const dist = Math.hypot(touch.clientX - curX, touch.clientY - curY);

      if (isSleepingRef.current) return;

      if (dist < 80) {
        setFaceExpression('happy');
        const followTilt = Math.max(-15, Math.min(15, (touch.clientX - curX) * 0.25));
        tiltRef.current = followTilt;
        
        const isMobile = window.innerWidth < 768;
        const targetX = touch.clientX - 38;
        const targetY = touch.clientY - 38;
        targetRef.current = {
          x: Math.max(isMobile ? window.innerWidth - 100 : 15, Math.min(isMobile ? window.innerWidth - 30 : window.innerWidth - 85, targetX)),
          y: Math.max(isMobile ? window.innerHeight - 115 : window.innerHeight * 0.5, Math.min(isMobile ? window.innerHeight - 75 : window.innerHeight - 110, targetY))
        };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [faceExpression]);

  // Periodic random wandering
  useEffect(() => {
    const interval = setInterval(() => {
      if (isChatOpenRef.current || isPeekingRef.current || isSleepingRef.current || isStartled) return;
      const isMobile = window.innerWidth < 768;

      // Pick a new floating waypoint within screen safe zones
      const minX = isMobile ? window.innerWidth - 100 : 100;
      const maxX = isMobile ? window.innerWidth - 30 : window.innerWidth - 120;
      const minY = isMobile ? window.innerHeight - 115 : 100;
      const maxY = isMobile ? window.innerHeight - 75 : window.innerHeight - 150;

      targetRef.current = {
        x: Math.random() * (maxX - minX) + minX,
        y: Math.random() * (maxY - minY) + minY
      };
    }, 12000);

    return () => clearInterval(interval);
  }, [isStartled]);

  // Dedicated sleep and nap triggers (Friendly loyal pet)
  useEffect(() => {
    const interval = setInterval(() => {
      if (isChatOpenRef.current) return;
      const now = Date.now();
      const inactiveSeconds = (now - lastActivityRef.current) / 1000;

      if (inactiveSeconds > 45) {
        // Fall asleep like a warm digital pet
        if (!isSleepingRef.current) {
          isSleepingRef.current = true;
          setFaceExpression('sleeping');
          wakeUpNeededRef.current = true;
          setBubbleText("zzZ... sleeping soundly... move your mouse or click to wake me up! 💤");
          
          // Gently float a tiny bit lower to resting position
          const isMobile = window.innerWidth < 768;
          targetRef.current = {
            x: posRef.current.x,
            y: Math.min(isMobile ? window.innerHeight - 110 : window.innerHeight - 150, posRef.current.y + 25)
          };
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Sleep ZZZ particles generator
  useEffect(() => {
    if (faceExpression !== 'sleeping') {
      setZzzList([]);
      return;
    }

    const interval = setInterval(() => {
      setZzzList(prev => [
        ...prev,
        {
          id: Math.random() + Date.now(),
          left: Math.random() * 20 + 28,
          top: Math.random() * 8 + 5,
          delay: Math.random() * 0.4
        }
      ].slice(-4));
    }, 1500);

    return () => clearInterval(interval);
  }, [faceExpression]);

  // Ensure scroll height inside mini chat is snapped on message delivery
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, tempBotMessage, isTyping]);

  // Main animation frame physics loop
  useEffect(() => {
    let animId: number;

    const frameLoop = () => {
      const isMobile = window.innerWidth < 768;
      
      // Override floating targets if chat is active - pull it neatly right behind chatbot view
      if (isChatOpenRef.current) {
        targetRef.current = {
          x: isMobile ? window.innerWidth - 82 : window.innerWidth - 130,
          y: isMobile ? window.innerHeight - 90 : window.innerHeight - 145
        };
      }

      // Physics spring formulas
      const dx = targetRef.current.x - posRef.current.x;
      const dy = targetRef.current.y - posRef.current.y;

      velRef.current.x += dx * 0.024;
      velRef.current.y += dy * 0.024;

      velRef.current.x *= 0.88;
      velRef.current.y *= 0.88;

      posRef.current.x += velRef.current.x;
      posRef.current.y += velRef.current.y;

      // Keep inside screen when roaming
      if (!isPeekingRef.current && !isSleepingRef.current) {
        const borderClamp = isMobile ? 10 : 25;
        posRef.current.x = Math.max(borderClamp, Math.min(window.innerWidth - 85, posRef.current.x));
        posRef.current.y = Math.max(borderClamp, Math.min(window.innerHeight - 85, posRef.current.y));
      }

      // Add a clean floating sinusoidal bob
      let verticalBob = 0;
      if (!isStartled && !isScrolling && !isChatOpenRef.current) {
        verticalBob = Math.sin(Date.now() * 0.0035) * 4.5;
      }

      // Compute dynamic tilt based on velocity, startup jumps or cursor orientations
      const rot = isStartled 
        ? Math.sin(Date.now() * 0.04) * 8 
        : tiltRef.current !== 0 
          ? tiltRef.current 
          : Math.max(-14, Math.min(14, velRef.current.x * 2.2));

      if (byteContainerRef.current) {
        const awakeScale = isWakingUp ? 'scale(1.22)' : 'scale(1)';
        byteContainerRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y + verticalBob}px, 0px) rotate(${rot}deg) ${awakeScale}`;
      }

      if (bubbleContainerRef.current) {
        const bubbleWidth = isMobile ? 200 : 260;
        const leftX = Math.max(16, Math.min(window.innerWidth - (bubbleWidth + 16), posRef.current.x - (isMobile ? 80 : 100)));
        
        // Measure exact height of the rendered speech bubble dynamically to prevent overlapping. Ensure robust minimum values to avoid overlap under delayed layout computations.
        const measuredHeight = Math.max(isMobile ? 120 : 75, bubbleContainerRef.current.offsetHeight || 0);
        // Ensure standard separation above the robot body, accounting for mobile scaling
        const marginGap = isMobile ? 48 : 28;
        const topY = posRef.current.y - measuredHeight - marginGap;
        
        bubbleContainerRef.current.style.transform = `translate3d(${leftX}px, ${topY + verticalBob}px, 0px)`;
        
        const arrowEl = bubbleContainerRef.current.querySelector('.bubble-arrow') as HTMLDivElement;
        if (arrowEl) {
          const arrowLeft = Math.max(16, Math.min(bubbleWidth - 10, (posRef.current.x + 29) - leftX - 5));
          arrowEl.style.left = `${arrowLeft}px`;
        }
      }

      animId = requestAnimationFrame(frameLoop);
    };

    animId = requestAnimationFrame(frameLoop);
    return () => cancelAnimationFrame(animId);
  }, [isStartled, isScrolling, isWakingUp]);

  // Triggers scurry target redirection if mouse clicks or floats extremely close
  const triggerStartledScurry = (cursorX: number, cursorY: number) => {
    setIsStartled(true);
    setFaceExpression('startled');
    setBubbleText("o-oh! p-please don't touch... [shocked.exe] >_<");

    const rightCursor = cursorX > window.innerWidth / 2;
    const bottomCursor = cursorY > window.innerHeight / 2;

    const cornerX = rightCursor 
      ? Math.random() * (window.innerWidth / 4) + 80
      : Math.random() * (window.innerWidth / 4) + (window.innerWidth * 3 / 4 - 100);

    const cornerY = bottomCursor
      ? Math.random() * (window.innerHeight / 4) + 80
      : Math.random() * (window.innerHeight / 4) + (window.innerHeight * 3 / 4 - 100);

    targetRef.current = { x: cornerX, y: cornerY };

    // Inject immediate velocity thrust
    velRef.current = {
      x: (cornerX - posRef.current.x) * 0.12,
      y: (cornerY - posRef.current.y) * 0.12
    };

    if (faceTimerRef.current) clearTimeout(faceTimerRef.current);
    faceTimerRef.current = setTimeout(() => {
      setIsStartled(false);
      setFaceExpression('idle');
      setBubbleText("safe zone restored... whew... 😮");
    }, 1500);
  };

  // Peeking retreat scurry state
  const duckFullyOffScreen = () => {
    if (duckTimeoutRef.current) return;

    const currentX = posRef.current.x;
    const isRightEdge = currentX > window.innerWidth / 2;

    targetRef.current = {
      x: isRightEdge ? window.innerWidth + 120 : -120,
      y: posRef.current.y
    };

    duckTimeoutRef.current = setTimeout(() => {
      const oppositeRight = !isRightEdge;
      const oppositeX = oppositeRight ? window.innerWidth - 130 : 90;
      const oppositeY = Math.random() * (window.innerHeight - 320) + 160;

      // Teleport offscreen at opposite end
      posRef.current = {
        x: oppositeRight ? window.innerWidth + 90 : -90,
        y: oppositeY
      };

      targetRef.current = { x: oppositeX, y: oppositeY };

      setIsWakingUp(true);
      setFaceExpression('startled');
      setBubbleText("peek-a-boo! i was hiding here... 🫣");

      setTimeout(() => setIsWakingUp(false), 500);

      // Reset activity variables
      lastActivityRef.current = Date.now();
      isPeekingRef.current = false;
      isSleepingRef.current = false;
      duckTimeoutRef.current = null;

      setTimeout(() => {
        setFaceExpression('idle');
      }, 1500);

    }, 1600);
  };

  // Pop jump when woken up
  const triggerWakeUp = () => {
    isSleepingRef.current = false;
    isPeekingRef.current = false;
    wakeUpNeededRef.current = false;
    
    setIsWakingUp(true);
    setFaceExpression('happy');
    setBubbleText("huh?! oh, welcome back! i was waiting for you... let's hang out! 🩵");
    
    const isMobile = window.innerWidth < 768;
    if (!isMobile) {
      targetRef.current = {
        x: Math.min(window.innerWidth - 130, Math.max(100, posRef.current.x)),
        y: posRef.current.y
      };
    }

    setTimeout(() => {
      setIsWakingUp(false);
      setFaceExpression('idle');
    }, 1000);
  };

  // Handle click on character
  const handleByteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (wakeUpNeededRef.current) {
      triggerWakeUp();
      setIsOpen(true);
      return;
    }

    setIsOpen(prev => !prev);
    
    // Excited jump animation
    setIsWakingUp(true);
    setTimeout(() => {
      setIsWakingUp(false);
    }, 400);
  };

  // Simple check for bad words / toxicity to trigger humble professional response
  const isInappropriate = (text: string): boolean => {
    const cleaned = text.toLowerCase().trim();
    // Common profanities, vulgarisms, and general insults/bad words
    const badWords = [
      'fuck', 'shit', 'bitch', 'asshole', 'cunt', 'pussy', 'dick', 'bastard', 
      'crap', 'idiot', 'stupid', 'dumb', 'fucker', 'motherfucker', 'wanker', 
      'trash', 'garbage', 'useless', 'hate you', 'f u c k', 's h i t', 'ass',
      'whore', 'slut', 'bullshit', 'prick', 'bollocks', 'dumbass', 'retard',
      'moron', 'jerk', 'fool', 'dickhead'
    ];
    
    // Check with word boundaries to avoid false positives (e.g. "classic", "assist", "button")
    return badWords.some(word => {
      if (word.includes(' ')) {
        return cleaned.includes(word);
      }
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      return regex.test(cleaned);
    });
  };

  // Handle incoming user text
  const handleSendMessage = (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: "user",
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMsg].slice(-50)); // Clamp maximum 50 messages
    setInputText("");
    setIsTyping(true);
    setFaceExpression('curious');

    // Simulate thinking delay with typewriter response
    const delay = 800 + Math.random() * 500;
    setTimeout(() => {
      setIsTyping(false);
      
      const isBad = isInappropriate(text);
      if (isBad) {
        setFaceExpression('startled');
      } else {
        setFaceExpression('happy');
      }
      
      const response = isBad 
        ? "Beep-boop... 😳 Let's keep our conversation polite and positive! I'm programmed to be professional and respectful, and I request the same from you. How can I assist you professionally today? ✨" 
        : getByteResponse(text);

      let revealText = "";
      let charIdx = 0;
      setTempBotMessage("");

      const typewriter = setInterval(() => {
        revealText += response[charIdx];
        setTempBotMessage(revealText);
        charIdx++;

        if (charIdx >= response.length) {
          clearInterval(typewriter);
          
          const q = text.toLowerCase();
          const isCvQuery = q.includes("cv") || q.includes("resume") || q.includes("biodata") || q.includes("curriculum");
          const isContactQuery = q.includes("contact") || q.includes("hire") || q.includes("email") || q.includes("message") || q.includes("form");

          setMessages(prev => [
            ...prev,
            {
              id: Math.random().toString(),
              sender: "bot",
              text: response,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              ...(isCvQuery && !isBad ? { downloadUrl: CV_ASCII_URI, downloadName: "Tanzimul_Hoque_CV.txt" } : {}),
              ...(isContactQuery && !isBad ? { formUrl: "https://forms.gle/n7CSdVmu7gZEucsx6" } : {})
            }
          ].slice(-50));

          setTempBotMessage(null);
          // Keep startled expression a bit longer if bad word was typed
          if (isBad) {
            setTimeout(() => setFaceExpression('idle'), 3000);
          } else {
            setFaceExpression('idle');
          }
        }
      }, 30);

    }, delay);
  };

  // Shy cute responses from knowledge base
  const getByteResponse = (query: string): string => {
    const q = query.toLowerCase().trim();

    if (q.includes("cv") || q.includes("resume") || q.includes("biodata") || q.includes("curriculum")) {
      return "Establishing secure downlink corridor... ✔️ SUCCESS! I gathered S M Tanjim's Master CV files for you... Download cards are attached below!";
    }

    if (q.includes("name") || q.includes("who is") || q.includes("who are") || q.includes("owner") || q.includes("creator") || q.includes("tanzimul") || q.includes("tanjim") || q.includes("hoque") || q.includes("raxorbill") || q.includes("profile") || q.includes("biography") || q.includes("bio")) {
      return "His name is S M Tanjimul Hoque Tajim (Tanjim)... He also goes by raxorbill! He is one of the kindest developers in Dhaka, Bangladesh... He engineered my code too! >_<";
    }

    if (q.includes("passion") || q.includes("love") || q.includes("hobbies") || q.includes("interest") || q.includes("motive")) {
      return "Tanjim is intensely passionate about frontend polish, high-speed micro-interactions, and configuring deep training modules in PyTorch! 🧠";
    }

    if (q.includes("skill") || q.includes("stack") || q.includes("languages") || q.includes("framework") || q.includes("code") || q.includes("coding")) {
      return "Oh... He is highly fluent in React, TypeScript, Node.js, and training intelligence grids in PyTorch! Embarrassingly capable honestly... 👀";
    }

    if (q.includes("contact") || q.includes("hire") || q.includes("email") || q.includes("message")) {
      return "You can drop him an email directly at tanjimulhoquetajim@gmail.com, or fill out his automated Google Form intake: https://forms.gle/n7CSdVmu7gZEucsx6 🚀 Please say hello—he'd love to collaborate!";
    }

    if (q.includes("project") || q.includes("built") || q.includes("works") || q.includes("portfolio")) {
      return "He's built super cool stuff! Interactive convolutional networks, Onyx luxury marketplace, Cyberflow, and fluid motion designs! Scroll down to see them...";
    }

    if (q.includes("experience") || q.includes("work") || q.includes("jobs") || q.includes("company")) {
      return "He's had awesome roles crafting smart full-stack systems and 3D web interfaces for top products, speeding up metrics by 47%! Truly high-caliber... 🚀";
    }

    if (q.includes("hello") || q.includes("hi") || q.includes("hey") || q.includes("yo") || q.includes("welcome")) {
      const responses = [
        "Oh! Hi... I wasn't expecting visitors >_< Ready to explore?",
        "H-hey... Hope you're having an awesome scroll... Need any details? 👀",
        "Beep beep! Hi there... Can I index something from my creator's files?"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    if (q.includes("compliment") || q.includes("cute") || q.includes("cool") || q.includes("smart") || q.includes("awesome") || q.includes("love you")) {
      const options = [
        "O-oh... You think so? [blushes.exe] Stop it... >_<",
        "S-stop... I might crash from embarrassment! [ERR_FEELINGS]",
        "Hehe... Thank you... That means so much coming from you! 😳"
      ];
      return options[Math.floor(Math.random() * options.length)];
    }

    return "Hmm... I searched my internal databases but couldn't find a direct match... [ERR_KNOWLEDGE_NOT_FOUND] Maybe ask about his 'name', 'skills' or 'projects'? 👀";
  };

  // SVGs representing BYTE's eye expressions
  const renderEyes = () => {
    switch (faceExpression) {
      case 'curious':
        // 👀 Concentric circles curious
        return (
          <svg viewBox="0 0 100 100" className="w-[34px] h-[34px] fill-cyan-400 stroke-none">
            <circle cx="33" cy="50" r="7" />
            <circle cx="33" cy="50" r="3" fill="#0d1117" />
            <circle cx="67" cy="50" r="7" />
            <circle cx="67" cy="50" r="3" fill="#0d1117" />
          </svg>
        );
      case 'startled':
        // 😳 Wide startled circles
        return (
          <svg viewBox="0 0 100 100" className="w-[34px] h-[34px] fill-none stroke-cyan-400 stroke-[3] animate-pulse">
            <circle cx="33" cy="50" r="10" />
            <circle cx="33" cy="50" r="3" fill="cyan" />
            <circle cx="67" cy="50" r="10" />
            <circle cx="67" cy="50" r="3" fill="cyan" />
          </svg>
        );
      case 'peeking':
        // 🫣 Peeking behind vertical line
        return (
          <svg viewBox="0 0 100 100" className="w-[34px] h-[34px] stroke-cyan-400 fill-none stroke-[3.5]" strokeLinecap="round">
            <circle cx="35" cy="50" r="6" fill="cyan" />
            <line x1="65" y1="20" x2="65" y2="80" strokeDasharray="3 3.5" />
          </svg>
        );
      case 'happy':
        // 😊 Upward curving happy arcs
        return (
          <svg viewBox="0 0 100 100" className="w-[34px] h-[34px] stroke-cyan-400 fill-none stroke-[4]" strokeLinecap="round">
            <path d="M 23 54 Q 33 41 43 54" />
            <path d="M 57 54 Q 67 41 77 54" />
          </svg>
        );
      case 'sleeping':
        // 💤 Sleeping sleep lines
        return (
          <svg viewBox="0 0 100 100" className="w-[34px] h-[34px] stroke-cyan-500/80 fill-none stroke-[3]" strokeLinecap="round">
            <path d="M 23 46 L 33 46 L 23 56 L 33 56" />
            <path d="M 57 46 L 67 46 L 57 56 L 67 56" />
          </svg>
        );
      case 'idle':
      default:
        // 😐 Simple horizontal lines
        return (
          <svg viewBox="0 0 100 100" className="w-[34px] h-[34px] stroke-cyan-400 fill-none stroke-[3.5]" strokeLinecap="round">
            <line x1="25" y1="50" x2="42" y2="50" />
            <line x1="58" y1="50" x2="75" y2="50" />
          </svg>
        );
    }
  };

  const presetSuggestions = [
    { label: "CV Resume 📄", query: "can i download Tanjim's cv?" },
    { label: "About Creator 👤", query: "who is sm tanjimul hoque tajim?" },
    { label: "Coding Stack 💻", query: "what coding languages does he use?" },
    { label: "Get in Touch ✉️", query: "how do i contact him or email him?" }
  ];

  return (
    <div className="fixed inset-0 pointer-events-none select-none z-50">
      {/* Styles Injection for Custom Handled Animations */}
      <style>{`
        @keyframes byte-bob {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-5px); }
        }
        @keyframes byte-shake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          20%      { transform: translateX(-6px) rotate(-4deg); }
          40%      { transform: translateX(6px) rotate(4deg); }
          60%      { transform: translateX(-4px) rotate(-2deg); }
          80%      { transform: translateX(4px) rotate(2deg); }
        }
        @keyframes zzz-float {
          0%   { opacity: 0; transform: translateY(0) scale(0.6); }
          35%  { opacity: 1; }
          100% { opacity: 0; transform: translateY(-26px) scale(1.15); }
        }
        @keyframes byte-blink {
          0%, 90%, 100% { transform: scaleY(1); }
          55%           { transform: scaleY(0.12); }
        }
        @keyframes byte-bounce {
          0%, 100% { transform: translateY(0); }
          30%      { transform: translateY(-12px); }
          60%      { transform: translateY(-5px); }
        }
        @keyframes cursor-blink {
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: cursor-blink 0.9s infinite;
        }
      `}</style>

      {/* 1. Speech Bubble Overlay next to the floating BOT */}
      <AnimatePresence>
        {!isOpen && bubbleText && (
          <div
            ref={bubbleContainerRef}
            style={{ 
              position: "fixed",
              left: 0, 
              top: 0,
              transform: `translate3d(${Math.max(16, Math.min(window.innerWidth - (isMobileScreen ? 216 : 276), posRef.current.x - (isMobileScreen ? 80 : 100)))}px, ${posRef.current.y - (isMobileScreen ? 190 : 135)}px, 0px)`,
              pointerEvents: "none"
            }}
            className="w-[200px] md:w-[260px] z-[52]"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.82, y: 12 }}
              className="pointer-events-auto relative w-full"
            >
              <div className="glass border border-[#00d2ff]/30 px-3.5 py-2.5 rounded-2xl shadow-[0_12px_40px_-5px_rgba(0,0,0,0.95)] bg-[#0d1117]/95 select-none text-center">
                <p className="text-[10px] font-mono text-cyan-50/90 leading-relaxed font-light">
                  {bubbleText}
                </p>
              </div>
              {/* Pointer arrow */}
              <div className="bubble-arrow absolute w-2.5 h-2.5 bg-[#0d1117] border-r border-b border-[#00d2ff]/30 rotate-45 -bottom-[5px]" style={{ left: `${Math.max(16, Math.min(isMobileScreen ? 190 : 250, (posRef.current.x + 29) - Math.max(16, Math.min(window.innerWidth - (isMobileScreen ? 216 : 276), posRef.current.x - (isMobileScreen ? 80 : 100))) - 5))}px` }} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Interactive Terminal Conversation Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 18, filter: "blur(6px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.91, y: 18, filter: "blur(6px)" }}
            transition={{ type: "spring", stiffness: 220, damping: 21 }}
            style={{ 
              position: "fixed",
              left: isMobileScreen 
                ? "16px" 
                : `${Math.max(16, Math.min(window.innerWidth - 410, posRef.current.x - 140))}px`, 
              top: isMobileScreen
                ? "auto"
                : `${Math.max(16, Math.min(window.innerHeight - 505, posRef.current.y - 405))}px`,
              bottom: isMobileScreen ? "110px" : "auto"
            }}
            className="md:w-[380px] w-[calc(100vw-32px)] glass bg-[#0d1117]/95 rounded-2xl border border-[#00d2ff]/25 shadow-[0_30px_70px_-10px_rgba(0,0,0,0.98)] overflow-hidden pointer-events-auto flex flex-col z-[51] md:h-[450px] h-[395px]"
          >
            {/* Terminal Holographic Header */}
            <div className="flex justify-between items-center bg-[#0d1117]/50 border-b border-cyan-500/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00d2ff] animate-pulse" />
                  <span className="w-2 h-2 rounded-full bg-[#6366f1]/40" />
                  <span className="w-2 h-2 rounded-full bg-white/10" />
                </div>
                <div className="h-4 w-[1px] bg-white/15 mx-1.5" />
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#00d2ff] font-bold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-[#00d2ff] animate-pulse" />
                  BYTE // SECURE_UPLINK
                </span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/40 hover:text-white transition-colors px-1.5 py-0.5 rounded border border-white/5 bg-white/[0.01]"
              >
                [ × ]
              </button>
            </div>

            {/* Micro Chat Logs scroll view */}
            <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 select-text bg-[#0d1117]/20">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="font-mono text-[8px] uppercase tracking-widest text-white/30">
                      {msg.sender === "user" ? "[ EXPLORER ]" : "[ BYTE ]"}
                    </span>
                    <span className="text-[7.5px] text-white/25 select-none">{msg.timestamp}</span>
                  </div>
                  <div 
                    className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs font-mono font-light leading-relaxed ${
                      msg.sender === "user" 
                        ? "bg-[#6366f1]/10 text-indigo-100 border border-[#6366f1]/30 rounded-tr-none" 
                        : "bg-[#0d1117] text-cyan-50 border border-[#00d2ff]/20 rounded-tl-none shadow-[inset_0_1px_4px_rgba(0,0,0,0.5)]"
                    }`}
                  >
                    <div>{msg.text}</div>
                    
                    {msg.downloadUrl && (
                      <div className="mt-3 pt-2.5 border-t border-white/5 space-y-1.5 flex flex-col pointer-events-auto">
                        <a 
                          href="https://drive.google.com/file/d/1XhgZeVjmfuovKdQ_e0qvaKB3cXujl7z2/view?usp=sharing"
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-2 w-full py-2 bg-gradient-to-r from-cyan-400 to-[#00d2ff] text-black font-bold uppercase tracking-wider text-[9px] rounded-lg hover:brightness-110 active:scale-[0.98] transition-all text-center select-none cursor-pointer shadow-md shadow-cyan-400/10"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-black animate-pulse" />
                          <span>Open CV on Google Drive</span>
                        </a>
                        <div className="grid grid-cols-2 gap-1.5">
                          <a 
                            href={CV_ASCII_URI}
                            download="Tanzimul_Hoque_CV.txt"
                            className="flex items-center justify-center gap-1 w-full py-1.5 bg-white/5 text-white/70 font-semibold uppercase tracking-wider text-[8px] rounded-lg hover:bg-white/10 transition-all text-center select-none cursor-pointer border border-white/5"
                          >
                            <Download className="w-3 h-3 text-cyan-400" />
                            <span>ASCII SPEC</span>
                          </a>
                          <a 
                            href={CV_HTML_URI}
                            download="Tanzimul_Hoque_CV.html"
                            className="flex items-center justify-center gap-1 w-full py-1.5 bg-white/5 text-white/70 font-semibold uppercase tracking-wider text-[8px] rounded-lg hover:bg-white/10 transition-all text-center select-none cursor-pointer border border-white/5"
                          >
                            <FileText className="w-3 h-3 text-[#00d2ff]" />
                            <span>HTML CV</span>
                          </a>
                        </div>
                      </div>
                    )}

                    {msg.formUrl && (
                      <div className="mt-3 pt-2.5 border-t border-white/5 flex flex-col pointer-events-auto">
                        <a 
                          href={msg.formUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-2 w-full py-2 bg-gradient-to-r from-cyan-400 to-indigo-500 text-black font-semibold uppercase tracking-wider text-[9px] rounded-lg hover:brightness-110 active:scale-95 transition-all text-center select-none cursor-pointer border border-cyan-400/20"
                        >
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                          <span>Launch Contact Form</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Temp Typewriter text output */}
              {tempBotMessage !== null && (
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="font-mono text-[8px] uppercase tracking-widest text-[#00d2ff]/50">
                      [ BYTE_TYPING... ]
                    </span>
                  </div>
                  <div className="max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs font-mono font-light leading-relaxed bg-[#0d1117] text-cyan-50 border border-[#00d2ff]/15 rounded-tl-none">
                    <span>{tempBotMessage}</span>
                    <span className="w-1.5 h-3 inline-block bg-[#00d2ff] ml-1 animate-blink" />
                  </div>
                </div>
              )}

              {/* Thinking loading state indicator */}
              {isTyping && tempBotMessage === null && (
                <div className="flex flex-col items-start animate-pulse">
                  <span className="font-mono text-[8px] uppercase tracking-widest text-[#00d2ff]/40 block mb-1">
                    [ QUERY SEARCHING... ]
                  </span>
                  <div className="bg-black/55 border border-[#00d2ff]/15 rounded-xl rounded-tl-none px-4 py-2 text-xs font-mono text-[#00d2ff]/70 flex items-center gap-2.5">
                    <span className="inline-block w-1.5 h-1.5 bg-[#00d2ff] rounded-full animate-ping" />
                    <span>interrogating memory archives...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Telemetry quick parameters queries list */}
            <div className="p-3 bg-black/40 border-t border-white/5 select-none">
              <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#00d2ff]/60 block mb-2 px-1">
                [ SUGGESTED CHIPS ]
              </span>
              <div className="flex sm:flex-wrap gap-1.5 overflow-x-auto sm:overflow-x-visible pb-1.5 sm:pb-0 scrollbar-none snap-x snap-mandatory pointer-events-auto">
                {presetSuggestions.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(p.query)}
                    className="font-mono text-[9px] tracking-wider border border-[#00d2ff]/20 hover:border-[#00d2ff]/50 hover:bg-[#00d2ff]/5 hover:text-[#00d2ff] bg-white/[0.01] px-2.5 py-1.5 rounded-lg transition-all duration-300 cursor-pointer text-left text-white/60 shrink-0 snap-start"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Keyboard input typing forms */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputText); }}
              className="flex border-t border-cyan-500/10 bg-[#0d1117] p-3 gap-2"
            >
              <div className="flex-1 relative flex items-center">
                <span className="absolute left-3.5 text-[#00d2ff]/50 text-xs font-mono select-none">&gt;_</span>
                <input
                  type="text"
                  value={inputText}
                  placeholder="say something to byte..."
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full bg-[#0d1117] border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-xs font-mono text-white/95 placeholder-white/20 focus:outline-none focus:border-[#00d2ff]/40 focus:ring-1 focus:ring-[#00d2ff]/30 transition-all select-text pointer-events-auto"
                />
              </div>
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="bg-white/5 hover:bg-[#00d2ff] text-white hover:text-black border border-white/10 hover:border-transparent transition-all px-4 py-2 rounded-xl flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed select-none pointer-events-auto"
              >
                [ SEND ]
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. High Performance 60FPS Spring-Driven Floating Companion Body */}
      <div
        ref={byteContainerRef}
        onClick={handleByteClick}
        className="fixed pointer-events-auto cursor-pointer flex flex-col items-center justify-center w-[76px] h-[76px] select-none z-[53] scale-75 md:scale-100 origin-bottom-right"
        style={{
          willChange: "transform",
          transform: `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0px)`
        }}
      >
        {/* Floating sleep ZZZ bubbles */}
        {zzzList.map(z => (
          <div
            key={z.id}
            className="absolute text-[11px] text-[#00d2ff] font-mono leading-none select-none pointer-events-none opacity-0"
            style={{
              left: `${z.left}px`,
              top: `${z.top}px`,
              animation: `zzz-float 2.5s ease-out forwards`,
              animationDelay: `${z.delay}s`
            }}
          >
            Z
          </div>
        ))}

        {/* Scroll propagation glow ring */}
        {isScrolling && (
          <div 
            className="absolute inset-[-6px] rounded-full border border-[#00d2ff]/35 blur-[2px] pointer-events-none scale-105" 
          />
        )}

        {/* Casing ring dial outline */}
        <div 
          className="absolute inset-[1px] rounded-full border border-dashed border-[#00d2ff]/25 hover:border-[#00d2ff]/60 transition-all duration-300 animate-spin cursor-pointer" 
          style={{ 
            animationDuration: isScrolling ? "1.2s" : "20s",
            borderColor: isScrolling ? "rgba(0, 210, 255, 0.7)" : "rgba(0, 210, 255, 0.25)" 
          }} 
        />
        <div 
          className="absolute inset-[-5px] rounded-full border border-[#00d2ff]/5 pointer-events-none scale-100 animate-pulse" 
        />

        {/* Robot Chassis and Inner Screen/Visor */}
        <div 
          id="byte-face"
          className={`w-[58px] h-[58px] rounded-full border bg-[#0d1117] flex items-center justify-center relative shadow-[0_12px_32px_rgba(0,0,0,0.9)] hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden ${
            isOpen ? "border-[#00d2ff] shadow-[0_0_18px_rgba(0,210,255,0.35)]" : "border-[#00d2ff]/30 hover:border-[#00d2ff]/70"
          } ${isStartled ? "animate-[byte-shake_0.4s_ease-in-out_infinite]" : ""}`}
        >
          {/* Scanlines layer */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-30" />
          
          {/* Active indicator LED bulb */}
          <div className="absolute top-1.5 flex gap-1 justify-center w-full">
            <span className={`w-1 h-1 rounded-full animate-ping ${isOpen ? "bg-[#00d2ff]" : "bg-[#00d2ff]"}`} style={{ animationDuration: "1.8s" }} />
            <span className="w-1.5 h-0.5 bg-cyan-400/20 rounded-full" />
          </div>

          {/* SVG face expression compiler */}
          <div className="w-[34px] h-[34px] flex items-center justify-center">
            {renderEyes()}
          </div>

          {/* Solder plates bottom nodes */}
          <div className="absolute bottom-1 w-5 flex justify-between px-0.5 opacity-80">
            <span className={`w-1 h-1 rounded-full transition-all duration-300 ${isScrolling ? "bg-rose-500 scale-[1.3] shadow-[0_0_8px_#f43f5e] animate-ping" : "bg-cyan-400 scale-100 shadow-[0_0_3px_rgb(34,211,238)] animate-pulse"}`} />
            <span className={`w-1 h-1 rounded-full transition-all duration-300 ${isScrolling ? "bg-rose-500 scale-[1.3] shadow-[0_0_8px_#f43f5e] animate-ping" : "bg-[#00d2ff] scale-100 shadow-[0_0_3px_#00d2ff] animate-pulse"}`} />
          </div>
        </div>

        {/* Bracket Action tag label overlay */}
        <div className="absolute -bottom-1 text-center bg-black/90 border border-[#00d2ff]/30 px-2 py-0.5 rounded-full shadow-md select-none pointer-events-none z-10 font-mono text-[7px] uppercase tracking-wider text-[#00d2ff] font-bold scale-[0.85]">
          {isOpen ? "[ CLOSE ]" : faceExpression === 'sleeping' ? "[ ZZZ ]" : "[ BYTE ]"}
        </div>
      </div>
    </div>
  );
};


const NodeSystemBlueprint = () => {
  const [activeNode, setActiveNode] = useState<'ingress' | 'controller' | 'ai' | 'db'>('ingress');
  const [mousePos, setMousePos] = useState({ x: 180, y: 120 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top)
    });
  };

  const nodes = {
    ingress: {
      title: "INGRESS ROUTER",
      file: "ingress_pipeline.ts",
      port: "PORT 3000 -> 80",
      desc: "Handles HTTP/3 requests, routes TLS ingress, and monitors DDoS safety thresholds.",
      code: `// SYSTEM: HIGH-PERFORMANCE REVERSE-PROXY INGRESS
import { SecureGateway } from "@sys/gateway";

export const ingressCore = SecureGateway.configure({
  host: "0.0.0.0",
  balancer: "weighted-round-robin",
  streamBuffer: {
    backlog: 512,
    highWatermark: "64kb"
  },
  security: {
    tlsMinVersion: "SSL_TLS_1_3",
    allowHeaders: ["X-Secure-Node", "Bearer"]
  }
});

console.log("[ACTIVE] Ingress Node routing active.");`
    },
    controller: {
      title: "EXPRESS ROUTER / VITE MIDDLEWARE",
      file: "server_core.ts",
      port: "NODE ENGINE",
      desc: "Integrates standard Node.js Express server pathways with Vite's reactive development compiler.",
      code: `// SYSTEM: FULL-STACK DEVELOPMENT CONTROLLER
import express from "express";
import { createServer as createVite } from "vite";

const app = express();
app.use(express.json());

// Bind API and static bundles
app.get("/api/v1/health", (req, res) => {
  res.json({ live: true, epochOffset: Date.now() });
});

if (process.env.NODE_ENV !== "production") {
  const viteInst = await createVite({
    server: { middlewareMode: true },
    appType: "spa"
  });
  app.use(viteInst.middlewares);
}`
    },
    ai: {
      title: "NEURAL COGNITIVE BRIDGE",
      file: "cognitive_gemini.ts",
      port: "GEMINI SDK",
      desc: "Orchestrates requests to the Gemini 2.5 generative engine with temperature cooling controls.",
      code: `// SYSTEM: AI ORCHESTRATION PIPELINE
import { GoogleGenAI } from "@google/genai";

const aiInstance = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export const requestSynthesis = async (promptMsg: string) => {
  const model = aiInstance.models.get("gemini-2.5-flash");
  const completion = await model.generate({
    contents: promptMsg,
    config: { temperature: 0.2 }
  });
  return completion.text;
};`
    },
    db: {
      title: "PERSISTENCE DEEP RECONCILER",
      file: "firestore_sync.ts",
      port: "FIRESTORE CLIENT",
      desc: "Listens to database triggers, maintains realtime sync, and commits state updates safely.",
      code: `// SYSTEM: DURABLE CLOUD STATS RECONCILER
import { getFirestore, doc, onSnapshot } from "firebase/firestore";

const db = getFirestore();

export const trackRemoteActivity = (userId: string) => {
  const ref = doc(db, "telemetry_logs", userId);
  return onSnapshot(ref, (snap) => {
    if (snap.exists()) {
      SystemCore.dispatchUpdate(snap.data());
    }
  });
};`
    }
  };

  return (
    <div className="mt-24 border border-white/10 bg-white/[0.01] p-8 md:p-12 relative overflow-hidden group select-none rounded-none">
      {/* Grid Pattern Backdrop for Blueprint */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      
      {/* Corner Bracket Details */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/30" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/30" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/30" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/30" />

      {/* Decorative Technical Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="w-2 h-2 bg-white animate-pulse" />
            <h3 className="font-mono text-xs uppercase tracking-[0.3em] font-bold text-white">
              SYSTEM INFRASTRUCTURE BLUEPRINT
            </h3>
          </div>
          <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase">
            Interactive Node.js Server & Stack Microservices
          </p>
        </div>
        <div className="flex items-center gap-6 font-mono text-[9px] text-white/30 tracking-widest">
          <span>COORDS // X: {mousePos.x} Y: {mousePos.y}</span>
          <span>DEV_STAGE // LIVE_PORT_3000</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-12 items-stretch" ref={containerRef} onMouseMove={handleMouseMove}>
        {/* SVG Schematic Board (3 Cols) */}
        <div className="lg:col-span-3 flex flex-col justify-between border border-white/5 bg-black/40 p-6 relative rounded-xl h-[380px] lg:h-[420px]">
          {/* Tech Spec Label */}
          <div className="absolute top-4 left-4 font-mono text-[9px] text-white/30 tracking-widest uppercase pointer-events-none">
            [ 2D_TOPOLOGICAL_MAPPING.ST ]
          </div>
          <div className="absolute bottom-4 left-4 font-mono text-[10px] text-white/20 tracking-widest pointer-events-none">
            MAPPING RADIAL INTENTS // CLICK OR HOVER NODES TO DISPATCH INSPECT
          </div>

          {/* SVG Connector Diagrams */}
          <div className="w-full h-full flex items-center justify-center relative mt-6">
            <svg viewBox="0 0 600 300" className="w-full h-full max-w-[500px]">
              <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Grid backdrop inside SVG */}
              <pattern id="innerGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="0.5" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#innerGrid)" />

              {/* Connecting lines */}
              {/* Ingress -> Controller */}
              <line 
                x1="120" y1="150" x2="260" y2="150" 
                stroke={activeNode === 'ingress' || activeNode === 'controller' ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.08)'} 
                strokeWidth="1.5" 
                className="transition-colors duration-500"
              />
              <line 
                x1="120" y1="150" x2="260" y2="150" 
                stroke="white" 
                strokeWidth="1.5" 
                strokeDasharray="6,6"
                className="transition-colors duration-500"
                style={{
                  strokeDashoffset: activeNode === 'ingress' ? 12 : 0,
                  animation: "dash 1.5s linear infinite"
                }}
              />

              {/* Controller -> AI */}
              <path 
                d="M 260,150 Q 350,70 440,70" 
                fill="none" 
                stroke={activeNode === 'controller' || activeNode === 'ai' ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.08)'} 
                strokeWidth="1.5"
                className="transition-colors duration-500"
              />
              <path 
                d="M 260,150 Q 350,70 440,70" 
                fill="none" 
                stroke="white" 
                strokeWidth="1.5"
                strokeDasharray="6,6"
                className="transition-colors duration-500"
                style={{
                  animation: "dash 2s linear infinite"
                }}
              />

              {/* Controller -> DB Sync */}
              <path 
                d="M 260,150 Q 350,230 440,230" 
                fill="none" 
                stroke={activeNode === 'controller' || activeNode === 'db' ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.08)'} 
                strokeWidth="1.5"
                className="transition-colors duration-500"
              />
              <path 
                d="M 260,150 Q 350,230 440,230" 
                fill="none" 
                stroke="white" 
                strokeWidth="1.5"
                strokeDasharray="6,6"
                className="transition-colors duration-500"
                style={{
                  animation: "dash 2s linear infinite"
                }}
              />

              {/* Node 1: Ingress Gateway */}
              <g 
                onClick={() => setActiveNode('ingress')} 
                onMouseEnter={() => setActiveNode('ingress')}
                className="cursor-pointer group"
              >
                <circle 
                  cx="120" cy="150" r="32" 
                  fill="#000" 
                  stroke={activeNode === 'ingress' ? '#fff' : 'rgba(255,255,255,0.15)'} 
                  strokeWidth={activeNode === 'ingress' ? '2.5' : '1'}
                  filter={activeNode === 'ingress' ? 'url(#glow)' : ''}
                  className="transition-all duration-300"
                />
                <circle 
                  cx="120" cy="150" r="24" 
                  fill="none" 
                  stroke="rgba(255,255,255,0.05)"
                  className="group-hover:scale-110 transition-transform duration-500 origin-center"
                />
                {/* Visual coordinate target dots */}
                <rect x="117" y="147" width="6" height="6" fill="#fff" />
                <text x="120" y="200" textAnchor="middle" fill={activeNode === 'ingress' ? '#fff' : 'rgba(255,255,255,0.4)'} className="font-mono text-[9px] uppercase tracking-widest font-bold transition-colors">
                  [01] INGRESS
                </text>
              </g>

              {/* Node 2: App Controller */}
              <g 
                onClick={() => setActiveNode('controller')} 
                onMouseEnter={() => setActiveNode('controller')}
                className="cursor-pointer group"
              >
                <circle 
                  cx="260" cy="150" r="32" 
                  fill="#000" 
                  stroke={activeNode === 'controller' ? '#fff' : 'rgba(255,255,255,0.15)'} 
                  strokeWidth={activeNode === 'controller' ? '2.5' : '1'}
                  filter={activeNode === 'controller' ? 'url(#glow)' : ''}
                  className="transition-all duration-300"
                />
                {/* Simulated spinning frame on controller */}
                <motion.circle 
                  cx="260" cy="150" r="24" 
                  fill="none" 
                  stroke="rgba(255,255,255,0.3)" 
                  strokeDasharray="10,25"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="origin-center"
                />
                <circle cx="260" cy="150" r="6" fill="#fff" />
                <text x="260" y="200" textAnchor="middle" fill={activeNode === 'controller' ? '#fff' : 'rgba(255,255,255,0.4)'} className="font-mono text-[9px] uppercase tracking-widest font-bold transition-colors">
                  [02] ENGINE
                </text>
              </g>

              {/* Node 3: AI Service */}
              <g 
                onClick={() => setActiveNode('ai')} 
                onMouseEnter={() => setActiveNode('ai')}
                className="cursor-pointer group"
              >
                <circle 
                  cx="440" cy="70" r="32" 
                  fill="#000" 
                  stroke={activeNode === 'ai' ? '#fff' : 'rgba(255,255,255,0.15)'} 
                  strokeWidth={activeNode === 'ai' ? '2.5' : '1'}
                  filter={activeNode === 'ai' ? 'url(#glow)' : ''}
                  className="transition-all duration-300"
                />
                <rect x="435" y="65" width="10" height="10" fill="none" stroke="#fff" strokeWidth="1" />
                <circle cx="440" cy="70" r="2" fill="#fff" />
                <text x="440" y="120" textAnchor="middle" fill={activeNode === 'ai' ? '#fff' : 'rgba(255,255,255,0.4)'} className="font-mono text-[9px] uppercase tracking-widest font-bold transition-colors">
                  [03] AI_GEMINI
                </text>
              </g>

              {/* Node 4: DB Syncer */}
              <g 
                onClick={() => setActiveNode('db')} 
                onMouseEnter={() => setActiveNode('db')}
                className="cursor-pointer group"
              >
                <circle 
                  cx="440" cy="230" r="32" 
                  fill="#000" 
                  stroke={activeNode === 'db' ? '#fff' : 'rgba(255,255,255,0.15)'} 
                  strokeWidth={activeNode === 'db' ? '2.5' : '1'}
                  filter={activeNode === 'db' ? 'url(#glow)' : ''}
                  className="transition-all duration-300"
                />
                {/* Horizontal stacks mimicking relational/sync blocks */}
                <rect x="432" y="222" width="16" height="3" fill="#fff" />
                <rect x="432" y="228" width="16" height="3" fill="#fff" />
                <rect x="432" y="234" width="16" height="3" fill="#fff" />
                <text x="440" y="280" textAnchor="middle" fill={activeNode === 'db' ? '#fff' : 'rgba(255,255,255,0.4)'} className="font-mono text-[9px] uppercase tracking-widest font-bold transition-colors">
                  [04] FIRESTORE
                </text>
              </g>
            </svg>
          </div>
        </div>

        {/* Live Code Console Window (2 Cols) */}
        <div className="lg:col-span-2 flex flex-col justify-between border border-white/10 bg-black/60 rounded-xl overflow-hidden shadow-2xl relative h-[420px]">
          {/* Apple Mac-style design top menu bar */}
          <div className="bg-white/[0.03] px-5 py-3 border-b border-white/5 flex justify-between items-center select-none shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
            </div>
            <div className="font-mono text-[9px] text-white/50 tracking-wider">
              {nodes[activeNode].file}
            </div>
            <div className="w-12 h-1 bg-white/15 rounded-full" />
          </div>

          {/* Active node specifications inside console */}
          <div className="p-6 border-b border-white/5 bg-white/[0.01]">
            <span className="text-[9px] font-mono text-white/40 tracking-wider block mb-1 uppercase">
              ACTIVE_NODE_SPECS // {nodes[activeNode].port}
            </span>
            <h4 className="text-sm font-bold tracking-tight text-white mb-2 uppercase">
              {nodes[activeNode].title}
            </h4>
            <p className="text-xs text-white/50 leading-relaxed font-light">
              {nodes[activeNode].desc}
            </p>
          </div>

          {/* Core code block definition body */}
          <div className="flex-1 p-5 overflow-auto font-mono text-[10px] leading-relaxed text-white/80 select-text hide-scrollbar">
            <pre className="whitespace-pre-wrap font-mono">
              <code>
                {nodes[activeNode].code}
              </code>
            </pre>
          </div>
        </div>
      </div>
      
      {/* CSS keyframe animation injected directly inside for full layout execution */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -40;
          }
        }
      `}</style>
    </div>
  );
};

const About = () => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isPhotoHovered, setIsPhotoHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // max 12 degrees tilt bounds
    setCoords({
      x: (x / rect.width) * 15,
      y: (y / rect.height) * -15
    });
  };

  const handleMouseLeave = () => {
    setCoords({ x: 0, y: 0 });
    setIsPhotoHovered(false);
  };

  return (
    <section id="about" className="py-4 md:py-8 bg-transparent relative overflow-hidden flex-1 flex flex-col justify-center w-full">
      {/* Ambient Liquid Blob / Morphing Orb background */}
      <LiquidBlobCanvas />

      {/* Background visual accents */}
      <div className="absolute top-1/4 -right-64 w-96 h-96 bg-white/[0.01] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-64 w-96 h-96 bg-white/[0.01] rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 w-full">
        <div className="grid md:grid-cols-2 gap-8 md:gap-20 items-center justify-items-center">
          <motion.div
            variants={scrollFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center md:text-left flex flex-col items-center md:items-start w-full"
          >
            <SectionHeading subtitle="Executive Profile">About Me</SectionHeading>
            <div className="space-y-4 md:space-y-5 text-white/70 leading-relaxed max-w-xl font-light text-center md:text-left mx-auto md:mx-0">
              <p className="text-xs sm:text-sm md:text-[15px] leading-relaxed text-white/90">
                Hi, I'm <span className="text-[#00d2ff] font-medium">Tanjim (Raxorbill)</span>, a Computer Science student, aspiring AI Engineer, and technology enthusiast passionate about building solutions that create real-world impact.
              </p>
              <p className="text-xs sm:text-sm md:text-[15px] leading-relaxed text-white/60">
                I primarily work with Python and continuously explore Artificial Intelligence, Machine Learning, and software development, while expanding my knowledge of C++. Beyond coding, I enjoy leading initiatives, organizing communities, and turning ambitious ideas into meaningful projects.
              </p>
              <p className="text-xs sm:text-sm md:text-[15px] leading-relaxed text-white/60">
                As a co-founder and student leader, I've had the opportunity to work on events, competitions, and programs that encourage learning, innovation, and youth development. My experiences in national and international competitions have strengthened my problem-solving mindset and drive for continuous growth.
              </p>
              
              {/* Highlight Stats Staggered */}
              <div className="pt-4 sm:pt-8 grid grid-cols-2 gap-4 sm:gap-8 justify-items-center w-full">
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 1 }}
                  className="p-4 sm:p-6 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors relative group w-full max-w-[170px] sm:max-w-none text-center md:text-left"
                >
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/30" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/30" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30" />
                  <h4 className="text-white font-bold text-2xl sm:text-3xl tracking-tight mb-1">05+</h4>
                  <p className="text-white/40 text-[10px] sm:text-xs font-mono uppercase tracking-widest">Years Experience</p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 1 }}
                  className="p-4 sm:p-6 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors relative group w-full max-w-[170px] sm:max-w-none text-center md:text-left"
                >
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/30" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/30" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30" />
                  <h4 className="text-white font-bold text-2xl sm:text-3xl tracking-tight mb-1">50+</h4>
                  <p className="text-white/40 text-[10px] sm:text-xs font-mono uppercase tracking-widest">Completed Works</p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Premium cybernetic portrait layout using the requested custom image with interactive 3D motion support */}
          <motion.div
            variants={scrollScaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={() => setIsPhotoHovered(true)}
            animate={{ 
              rotateY: isMobile ? 0 : coords.x, 
              rotateX: isMobile ? 0 : coords.y,
              scale: !isMobile && isPhotoHovered ? 1.02 : 1,
              boxShadow: !isMobile && isPhotoHovered ? "0 25px 60px -15px rgba(255,255,255,0.06)" : "0 0px 0px 0px rgba(0,0,0,0)"
            }}
            transition={{ type: "spring", stiffness: 140, damping: 18 }}
            style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
            className="relative aspect-[4/5] max-h-[260px] sm:max-h-[350px] md:max-h-none max-w-[240px] sm:max-w-[280px] md:max-w-none mx-auto overflow-hidden border border-white/10 group p-2 md:p-4 bg-white/[0.01] cursor-crosshair select-none"
          >
            {/* Holographic matrix scan indicator */}
            <motion.div 
              animate={{ y: ["-100%", "230%"] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent z-20 pointer-events-none"
            />
            
            {/* Ambient cybernetic HUD layer */}
            <div className="absolute top-6 left-6 z-20 text-[10px] font-mono text-white/30 tracking-widest pointer-events-none uppercase">
              [ SECURE_PORTRAIT.SYS ]
            </div>
            <div className="absolute bottom-6 right-6 z-20 text-[9px] font-mono text-white/30 tracking-widest pointer-events-none">
              LOC // UTC_LATENCY_NORM
            </div>
            
            {/* Top & Bottom decorative brackets */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/20 transition-all group-hover:border-white/50 group-hover:scale-105" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/20 transition-all group-hover:border-white/50 group-hover:scale-105" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/20 transition-all group-hover:border-white/50 group-hover:scale-105" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/20 transition-all group-hover:border-white/50 group-hover:scale-105" />
            
            {/* Subtle inner card border */}
            <div className="w-full h-full relative overflow-hidden border border-white/5">
              <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/20 to-white/5 z-10 pointer-events-none group-hover:opacity-40 transition-opacity" />
              <img 
                src="https://lh3.googleusercontent.com/d/1rxp5B-TuMdSBmdmNIZfPkXz811qEkS37=w800" 
                alt="S M Tanjimul Hoque Tajim"
                referrerPolicy="no-referrer"
                className="object-cover w-full h-full grayscale-0 md:grayscale md:group-hover:grayscale-0 contrast-[1.08] saturate-[0.95] group-hover:scale-105 transition-all duration-[1.5s] ease-[0.16,1,0.3,1]"
              />
            </div>
          </motion.div>
        </div>

        {/* Dynamic 2D System Architecture Blueprint */}
        <motion.div
          initial={{ opacity: 0, y: 50, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <NodeSystemBlueprint />
        </motion.div>
      </div>
    </section>
  );
};

const Skills = () => {
  const [activeSkill, setActiveSkill] = useState<string | null>(null);

  const skills = [
    { name: 'Artificial Intelligence', icon: <Cpu className="w-5 h-5" />, level: 90 },
    { name: 'Web Development', icon: <Code className="w-5 h-5" />, level: 95 },
    { name: 'Python', icon: <Terminal className="w-5 h-5" />, level: 85 },
    { name: 'C/C++', icon: <ChevronDown className="w-5 h-5 rotate-[270deg]" />, level: 85 },
    { name: 'Machine Learning', icon: <Layers className="w-5 h-5" />, level: 80 },
    { name: 'UI/UX Design', icon: <Monitor className="w-5 h-5" />, level: 88 },
    { name: 'Graphic Design', icon: <Palette className="w-5 h-5" />, level: 85 },
    { name: 'Video Editing', icon: <Video className="w-5 h-5" />, level: 90 },
  ];

  const skillManifests: Record<string, { file: string, lang: string, code: string }> = {
    'Artificial Intelligence': {
      file: "ai_inference_engine.py",
      lang: "PYTHON",
      code: `# COMPILING AI WEIGHT LOADER & PREDICTION MODEL...
import tensorflow as tf
import numpy as np

class NeuralModel:
    def __init__(self, weights_path="./weights/manifest"):
        print("[SYS] Initializing tensor cores...")
        self.cores = tf.keras.models.load_model(weights_path)

    def predict_intents(self, signal_vector):
        raw_outputs = self.cores.predict(np.expand_dims(signal_vector, axis=0))
        return {"confidence": float(raw_outputs[0][0]), "status": "OPTIMAL_FIT"}`
    },
    'Web Development': {
      file: "stream_controller.ts",
      lang: "TYPESCRIPT",
      code: `// MODULAR REACT STACK WEBSOCKET CLIENT
import { useState, useEffect } from "react";

export function useStreamController<T>(socketUrl: string) {
  const [data, setData] = useState<T[]>([]);

  useEffect(() => {
    const socket = new WebSocket(socketUrl);
    socket.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      setData(prev => [...prev.slice(-99), payload]);
    };
    return () => socket.close();
  }, [socketUrl]);

  return data;
}`
    },
    'Python': {
      file: "telemetry_queue.py",
      lang: "PYTHON",
      code: `# PARALLEL MULTI-NODE TELEMETRY BUFFER PIPELINE
import asyncio

async def consume_telemetry_queue(reader_instance):
    print("[INIT] Spawning parallel consumer fibers...")
    while True:
        packet = await reader_instance.read(1024)
        if not packet:
            break
        parsed_flow = deserialize_json_chunk(packet)
        await asyncio.sleep(0.005) # anti-congestion loop throttle
        dispatch_to_broker(parsed_flow)`
    },
    'C/C++': {
      file: "pointer_sort.cpp",
      lang: "C++",
      code: `// HIGH-PERFORMANCE DIRECT MEMORY POINTER MANIPULATION
#include <iostream>
#include <vector>

void optimizedSort(int* arr, int size) {
    for (int i = 0; i < size - 1; ++i) {
        for (int j = 0; j < size - i - 1; ++j) {
            if (*(arr + j) > *(arr + j + 1)) {
                // Direct pointer address manipulation swap
                int temp = *(arr + j);
                *(arr + j) = *(arr + j + 1);
                *(arr + j + 1) = temp;
            }
        }
    }
}`
    },
    'Machine Learning': {
      file: "backprop_kernel.py",
      lang: "PYTORCH",
      code: `# ML BACKPROPAGATION GRADIENT KERNEL
import torch

class BackpropKernel(torch.nn.Module):
    def __init__(self):
        super().__init__()
        self.linear = torch.nn.Linear(128, 64)

    def forward(self, input_vectors, target_vitals):
        pred = self.linear(input_vectors)
        loss = torch.nn.functional.mse_loss(pred, target_vitals)
        loss.backward()
        print(f"[SGD] Iteration complete. Loss delta: {loss.item():.6f}")
        return loss`
    },
    'UI/UX Design': {
      file: "bezier_spring.ts",
      lang: "TYPESCRIPT",
      code: `// APPLE-SPRING PHYSICS INTERACTIVE SPLINE
interface BoxSpring {
  damping: number;
  stiffness: number;
  mass: number;
  velocity: number;
}

export function computeSpringTransition(current: number, target: number, s: BoxSpring) {
  const force = -s.stiffness * (current - target) - s.damping * s.velocity;
  const acceleration = force / s.mass;
  s.velocity += acceleration * 0.016; // 60fps delta
  return current + s.velocity * 0.016;
}`
    },
    'Graphic Design': {
      file: "geometry_gen.svg",
      lang: "GENERATIVE_SVG",
      code: `<!-- GENERATIVE SVG RADIAL MATHEMATIC MATRIX -->
<svg viewBox="0 0 100 100" class="radial-grid">
  <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.15)" stroke-dasharray="2,2" />
  <path d="M 50 5 L 50 95 M 5 50 L 95 50" stroke="rgba(255,255,255,0.06)" />
</svg>`
    },
    'Video Editing': {
      file: "render_sync.sh",
      lang: "FFMPEG_SHELL",
      code: `# STEREOSCOPIC AUDIO/VIDEO SYNC PIPELINE
ffmpeg -i video_draft.mp4 -i stereo_ambient.wav \\
  -c:v libx264 -crf 17 -preset slow \\
  -c:a aac -b:a 320k -ar 48000 \\
  -filter_complex "[0:a][1:a]amerge=inputs=2[aout]" \\
  -map 0:v -map "[aout]" -y render_output.mov`
    }
  };

  const defaultConsole = {
    file: "sys_diagnostics.log",
    lang: "SHELL",
    code: `// RAXORBILL_OS TERMINAL ACTIVE DIAGNOSTICS:
$ status_check --all-systems
Checking core compilers... [OK]
Checking AI model inference latency... [12ms - OPTIMAL]
Checking secure reverse-proxy routing... [Active - Port 3000]
Firestore sync listener status... [STABLE - Listening]

>> HOVER KEY EXPERTISE METRICS ABOVE TO INSPECT SOURCE MANIFESTS`
  };

  const activeData = activeSkill ? skillManifests[activeSkill] : defaultConsole;

  return (
    <section id="skills" className="py-4 md:py-8 bg-transparent relative overflow-hidden flex-1 flex flex-col justify-center w-full">
      {/* Ambient Particle Constellation Background replaced with Interactive 3D WebGL shape-shifter swarm */}
      <ThreeQuantumSkillsBg activeSkill={activeSkill} />

      <div className="absolute top-1/2 -right-48 w-80 h-80 bg-white/[0.01] rounded-full blur-3xl pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <SectionHeading subtitle="Core Competencies">Technical Expertise</SectionHeading>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-4">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              whileHover={{ 
                borderColor: "rgba(0, 210, 255, 0.25)",
                backgroundColor: "rgba(255,255,255,0.01)"
              }}
              onMouseEnter={() => setActiveSkill(skill.name)}
              onMouseLeave={() => setActiveSkill(null)}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ 
                type: "spring",
                stiffness: 150,
                damping: 22,
                duration: 0.7,
                delay: index * 0.02
              }}
              className="p-4 border border-white/5 bg-transparent hover:border-white/15 transition-all duration-300 group relative overflow-hidden select-none rounded-md"
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <div className="text-white/25 group-hover:text-cyan-400/80 transition-colors duration-300">
                    {skill.icon}
                  </div>
                  <h3 className="text-[10px] font-medium tracking-widest text-white/60 uppercase group-hover:text-white transition-all duration-300">
                    {skill.name}
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-white/30 group-hover:text-cyan-400/80 transition-colors uppercase font-medium">
                  {skill.level}%
                </span>
              </div>

              <div className="w-full h-[1px] bg-white/[0.04] overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: index * 0.04 }}
                  className="h-full bg-white/40 group-hover:bg-cyan-400 group-hover:shadow-[0_0_6px_rgba(6,182,212,0.5)] transition-all duration-500"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Live Manifest Console Viewer */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 border border-white/5 bg-transparent rounded-lg overflow-hidden relative select-none"
        >
          {/* Header line */}
          <div className="bg-white/[0.012] px-5 py-3 border-b border-white/[0.04] flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 animate-[pulse_2s_infinite]" />
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold">
                SOURCE // {activeData.lang}
              </span>
            </div>
            <div className="font-mono text-[9px] text-white/20 tracking-wider">
              {activeData.file}
            </div>
          </div>
          
          {/* Shell Container Body */}
          <div className="p-4 md:p-5 font-mono text-[10px] md:text-xs leading-relaxed text-white/60 overflow-x-auto select-text min-h-[100px] max-h-[140px] md:max-h-[250px] hide-scrollbar bg-black/20">
            <pre className="font-mono whitespace-pre-wrap">
              <code>{activeData.code}</code>
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Projects = () => {
  const projects = [
    {
      title: "Project Nebula",
      category: "Artificial Intelligence & ML",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000",
      description: "Sleek neural network kernels and training pipelines engineered for deep learning pattern synthesis and language model reasoning.",
      specs: ["STATUS: COMPILING...", "MODEL: Custom Transformer", "BASE: Python / PyTorch", "ETA: Upcoming Cycle"]
    },
    {
      title: "Project Orbit",
      category: "Creative Technology",
      image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=1000",
      description: "An interactive, three-dimensional responsive grid constellation executing multi-threaded physics calculations for real-time canvas particles.",
      specs: ["STATUS: ACTIVE_RESEARCH", "RENDER: WebGL / Three.js", "FPS: 60fps Target", "ETA: Next Phase"]
    },
    {
      title: "Project Phoenix",
      category: "Full Stack Web",
      image: "https://images.unsplash.com/photo-1618005198143-e52834643521?auto=format&fit=crop&q=80&w=1000",
      description: "High-performance client dashboards utilizing micro-animations, fluid layout transitions, and secure server-side API environments.",
      specs: ["STATUS: INITIALIZING...", "STACK: React / TS / Node.js", "THEME: Cosmic Slate", "ETA: Scheduled Sync"]
    },
    {
      title: "Project Core-Blaze",
      category: "Systems Engineering",
      image: "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&q=80&w=1000",
      description: "A modular, ultra-efficient repository of foundational C++ logic blocks, search trees, and parallel processing algorithms.",
      specs: ["STATUS: IN_QUEUE...", "LANG: Standard C++20", "ALGO: O(log N) Delta", "ETA: Awaiting Compile"]
    }
  ];

  return (
    <section id="projects" className="py-4 md:py-8 bg-transparent relative overflow-hidden flex-1 flex flex-col justify-center w-full">
      {/* Rotating Geometric blueprint grid background */}
      <RotatingGridCanvas />

      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-white/[0.01] rounded-full blur-3xl pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <SectionHeading subtitle="Active Synthesis // Coming Soon">Featured Playgrounds</SectionHeading>
        <div className="grid md:grid-cols-2 gap-4 md:gap-12 w-full">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              variants={scrollFadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.15, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="group cursor-pointer select-none"
            >
              <div className="relative aspect-[16/9] md:aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 mb-3 md:mb-6 bg-black/40">
                {/* Tech corner brackets that frame up on hover */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/0 group-hover:border-blue-400/50 group-hover:translate-x-1 group-hover:translate-y-1 transition-all duration-500 z-20 pointer-events-none" />
                <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/0 group-hover:border-blue-400/50 group-hover:-translate-x-1 group-hover:translate-y-1 transition-all duration-500 z-20 pointer-events-none" />
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/0 group-hover:border-blue-400/50 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500 z-20 pointer-events-none" />
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/0 group-hover:border-blue-400/50 group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all duration-500 z-20 pointer-events-none" />

                {/* Blinking futuristic "active compilation" state badge */}
                <div className="absolute top-6 right-6 z-20 px-2.5 py-1 text-[8px] md:text-[9px] font-mono tracking-wider bg-blue-500/10 border border-blue-400/30 text-blue-400 uppercase rounded-sm backdrop-blur-md animate-pulse">
                  {project.specs[0].replace("STATUS: ", "")}
                </div>

                <img 
                  src={project.image} 
                  alt={project.title}
                  className="object-cover w-full h-full grayscale-0 md:grayscale md:group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1s] ease-[0.16,1,0.3,1] opacity-75 group-hover:opacity-100"
                />
                
                {/* Micro tech scanner banner overlay */}
                <div className="absolute top-6 left-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-mono text-[9px] text-[#00d2ff]/80 tracking-[0.2em] uppercase bg-black/60 px-3 py-1 border border-white/10 backdrop-blur-md">
                  [ COMPILE_SEQUENCE_ACTIVE ]
                </div>

                {/* Specifications slide-up layout */}
                <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-wrap gap-2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[0.16,1,0.3,1] pointer-events-none">
                  {project.specs.map((spec) => (
                    <span key={spec} className="font-mono text-[9px] text-white bg-black/85 border border-white/15 px-3 py-1.5 backdrop-blur-md uppercase tracking-wider rounded-md">
                      {spec}
                    </span>
                  ))}
                </div>
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px] z-10">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="w-16 h-16 rounded-full border border-blue-400/50 flex items-center justify-center bg-black/30 backdrop-blur-md shadow-2xl"
                  >
                    <Cpu className="w-6 h-6 text-blue-400 shrink-0" />
                  </motion.div>
                </div>
              </div>
              
              <div className="flex justify-between items-start px-2">
                <div>
                  <p className="text-white/40 text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] mb-1.5 md:mb-2">{project.category}</p>
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white group-hover:text-glow transition-all duration-300">{project.title}</h3>
                  <p className="text-white/50 mt-1.5 md:mt-3 max-w-sm font-light text-xs md:text-sm leading-relaxed">{project.description}</p>
                </div>
                <button className="mt-1 md:mt-2 text-white/30 hover:text-blue-400 transition-colors group-hover:translate-x-1.5 group-hover:-translate-y-1.5 transition-transform duration-300 pointer-events-none">
                  <Cpu size={20} className="shrink-0" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dynamic 3D Experimental Sandbox block */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 md:mt-28 border-t border-white/10 pt-6 md:pt-16"
        >
          <div className="flex flex-col gap-1.5 md:gap-2 mb-4 md:mb-8">
            <span className="font-mono text-[10px] md:text-xs text-white/40 tracking-[0.3em] font-medium uppercase">
              // EXPERIMENTAL SHOWCASE
            </span>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h3 className="text-xl md:text-3xl font-display font-bold tracking-tight text-white uppercase">
                  Quantum 3D Particle Swarm Lab
                </h3>
                <p className="text-xs md:text-sm text-white/55 max-w-xl font-light mt-1.5 md:mt-2 leading-relaxed">
                  Interactive real-time spatial calculations rendering 16,000 physical points. Experience fluid wave mechanics or the holographic dimensional folding of toroidal knot geometry.
                </p>
              </div>
              <div className="font-mono text-[9px] text-[#00d2ff]/60 border border-[#00d2ff]/20 px-3 py-1.5 bg-[#00d2ff]/5 rounded-md uppercase tracking-widest select-none shrink-0 font-bold">
                ACTIVE_ENGINE // THREE_WebGL_STABLE
              </div>
            </div>
          </div>
          <QuantumLab />
        </motion.div>
      </div>
    </section>
  );
};

const Experience = () => {
  const [activeExp, setActiveExp] = useState<number>(0);

  const experiences = [
    {
      company: "Nexus Coding Club",
      role: "Co-Founder & Vice President",
      period: "March 2026 - Present",
      description: "Leading technical programs, student training, organizing national and international tech competitions, and driving collaborative web architectures for student development.",
      skills: ["Python", "C++", "Community Leadership", "Event Design", "Collaborative Flow"],
      telemetry: {
        score: 96,
        metric: "MEMBER_GROWTH",
        value: "+200 Members",
        perf: "+150% Engagement",
        achievements: [
          "Co-founded and orchestrated technical modules for high-impact coding workshops and webinars",
          "Engineered competitive coding pipelines, hackathons, and innovative project showcase events for youth development",
          "Trained and mentored aspiring developers in Python fundamentals, logic-building, and code organization"
        ]
      }
    },
    {
      company: "Freelance & Open Source",
      role: "Full Stack Web Developer",
      period: "Feb 2026 - Present",
      description: "Designing ultra-performant client-side and full-stack solutions, optimizing database schemas, and building responsive, high-contrast user interfaces with modern frameworks.",
      skills: ["React", "TypeScript", "Node.js", "TailwindCSS", "Python", "Git & GitHub"],
      telemetry: {
        score: 94,
        metric: "FPS_LIQUIDITY",
        value: "60 FPS Stable",
        perf: "-30% Bundle Size",
        achievements: [
          "Developed high-performance client dashboards utilizing fluid interactive visualizers and motion physics",
          "Structured secure backends and RESTful API routes protecting environment variable secrets",
          "Created modular layouts adhering to strict typography, color pairing, and negative space principles"
        ]
      }
    },
    {
      company: "Next Horizon Project",
      role: "AI Engineer & Innovator",
      period: "LOADING...",
      description: "Actively scanning the computational landscape for challenging AI/ML tasks, server-side integrations, and complex software-driven opportunities. I'm on it!",
      skills: ["Deep Learning", "Neural Networks", "NLP & LLM APIs", "Advanced Python", "C++ Data Structures"],
      telemetry: {
        score: 65,
        metric: "ENGINE_POSITION",
        value: "ACTIVE_SCAN",
        perf: "Ready to Build",
        achievements: [
          "Deepening mastery in Artificial Intelligence, Machine Learning pipelines, and intelligent assistant agents",
          "Strengthening problem-solving mindsets through competitive platforms and collaborative initiatives",
          "Actively seeking opportunities to build technologies that empower people and shape the future"
        ]
      }
    }
  ];

  const currentExp = experiences[activeExp];

  return (
    <section id="experience" className="py-4 md:py-8 bg-transparent relative overflow-hidden flex-1 flex flex-col justify-center w-full">
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-white/[0.01] rounded-full blur-3xl pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <SectionHeading subtitle="Professional Milestones">Work Experience</SectionHeading>
        
        <div className="grid lg:grid-cols-12 gap-6 md:gap-12 mt-6 md:mt-12 items-start">
          {/* Left Column: Interactive Timeline List */}
          <div className="lg:col-span-7 space-y-4 md:space-y-8 relative">
            {/* Background trace line */}
            <div className="absolute left-[11px] top-2 bottom-0 w-px bg-white/10" />
            
            {/* Laser-guided timeline drawing thread */}
            <motion.div 
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-[11px] top-2 bottom-0 w-px bg-gradient-to-b from-white via-white/50 to-transparent origin-top"
            />

            {experiences.map((exp, index) => {
              const isActive = activeExp === index;
              return (
                <motion.div
                  key={exp.company}
                  initial={{ opacity: 0, x: -30, filter: 'blur(8px)' }}
                  whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: index * 0.1, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                  className="relative pl-7 sm:pl-12 cursor-pointer"
                  onClick={() => setActiveExp(index)}
                  onMouseEnter={() => setActiveExp(index)}
                >
                  {/* Dynamic blinking aura node */}
                  <div className="absolute left-0 top-[10px] w-[23px] h-[23px] flex items-center justify-center -translate-x-[6px] -translate-y-[6px] z-10">
                    <motion.div 
                      animate={isActive ? { scale: [1, 2.5, 1], opacity: [0.2, 0.6, 0.2] } : { scale: 1, opacity: 0.2 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className={`absolute w-5 h-5 rounded-full border pointer-events-none transition-colors ${isActive ? 'border-white' : 'border-white/20'}`}
                    />
                    <div 
                      className={`w-[11px] h-[11px] border rounded-none transition-all duration-300 ${isActive ? 'bg-white border-white scale-125 shadow-[0_0_8px_rgba(255,255,255,0.7)]' : 'bg-transparent border-white/20'}`}
                    />
                  </div>

                  <div 
                    className={`border p-4 sm:p-8 hover:border-white/20 transition-all relative group overflow-hidden select-none rounded-xl ${
                      isActive 
                        ? 'border-white/20 bg-white/[0.04] shadow-[0_20px_50px_-20px_rgba(255,255,255,0.05)]' 
                        : 'border-white/5 bg-white/[0.01]'
                    }`}
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.01] rounded-full blur-2xl group-hover:bg-white/[0.03] transition-colors pointer-events-none" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/10 group-hover:border-white/30 transition-colors" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/10 group-hover:border-white/30 transition-colors" />

                    <div className="flex flex-col md:flex-row md:justify-between mb-4 gap-2">
                      <h3 className="text-lg md:text-xl font-bold tracking-tight text-white">
                        {exp.role}
                      </h3>
                      <span className={`text-[9px] md:text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 border h-fit transition-all duration-300 ${
                        isActive ? 'border-white/30 text-white bg-white/5' : 'border-white/10 text-white/30'
                      }`}>
                        {exp.period}
                      </span>
                    </div>
                    <p className={`text-[10px] md:text-xs font-mono uppercase tracking-widest mb-3 transition-colors ${isActive ? 'text-white/80' : 'text-white/40'}`}>
                      [ {exp.company} ]
                    </p>
                    <p className="text-white/50 leading-relaxed text-xs md:text-sm font-light">{exp.description}</p>
                    
                    {/* Compact Technologies tags list */}
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {exp.skills.map((s) => (
                        <span key={s} className="font-mono text-[9px] bg-white/[0.03] text-white/50 border border-white/5 px-2 py-0.5 uppercase">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Telemetry Performance HUD */}
          <div className="lg:col-span-5">
            <motion.div
              key={activeExp}
              initial={{ opacity: 0, scale: 0.98, filter: 'blur(6px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="border border-white/10 bg-black/40 rounded-2xl p-4 sm:p-8 relative overflow-hidden select-none"
            >
              {/* Grid backdrop */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-50" />
              
              <div className="relative">
                <div className="flex justify-between items-center border-b border-white/10 pb-3 md:pb-4 mb-4 md:mb-6">
                  <span className="font-mono text-[10px] md:text-xs uppercase text-white/40 tracking-widest">
                    Role Performance Analysis
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span className="font-mono text-[8px] md:text-[9px] text-white/60 uppercase">System Active</span>
                  </div>
                </div>

                {/* KPI metrics row */}
                <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="border border-white/5 bg-white/[0.02] p-3 md:p-4 rounded-xl">
                    <span className="font-mono text-[8px] md:text-[9px] text-white/30 uppercase block mb-1">
                      {currentExp.telemetry.metric}
                    </span>
                    <span className="text-base sm:text-2xl font-bold tracking-tight text-white font-mono block">
                      {currentExp.telemetry.value}
                    </span>
                  </div>
                  <div className="border border-white/5 bg-white/[0.02] p-3 md:p-4 rounded-xl">
                    <span className="font-mono text-[8px] md:text-[9px] text-white/30 uppercase block mb-1">
                      OPTIMIZATION_DELTA
                    </span>
                    <span className="text-base sm:text-2xl font-bold tracking-tight text-white font-mono block">
                      {currentExp.telemetry.perf}
                    </span>
                  </div>
                </div>

                {/* Score & Vector visualization */}
                <div className="mb-4 sm:mb-8 border border-white/5 bg-white/[0.01] p-4 sm:p-6 rounded-xl">
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="font-mono text-[9px] md:text-[10px] text-white/40 tracking-wider">SYSTEM INTEGRITY RATE</span>
                    <span className="font-mono text-xs text-white tracking-widest font-bold">{currentExp.telemetry.score}%</span>
                  </div>
                  <div className="w-full h-1.5 md:h-2 bg-white/5 rounded-full overflow-hidden relative">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${currentExp.telemetry.score}%` }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full bg-white"
                    />
                  </div>
                  
                  {/* Subtle 2D design accents below metric bar */}
                  <div className="flex justify-between font-mono text-[8px] text-white/20 mt-1.5 uppercase">
                    <span>SYS_MIN: 0x00</span>
                    <span>MID_CORE: 0x4B</span>
                    <span>MAX_LIMIT: 0xFF</span>
                  </div>
                </div>

                {/* Accomplishments checklist */}
                <div>
                  <h4 className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-4">
                    Key Deliverables
                  </h4>
                  <ul className="space-y-4">
                    {currentExp.telemetry.achievements.map((ach, idx) => (
                      <li key={idx} className="flex gap-3 text-xs text-white/70 font-light leading-relaxed">
                        <span className="font-mono text-[9px] text-white/40 mt-0.5 select-none">[{idx + 1}]</span>
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div> {/* Accomplishments checklist end */}
              </div> {/* relative container end */}
            </motion.div> {/* telemetry card motion.div end */}
          </div> {/* lg:col-span-5 end */}
        </div> {/* grid lg:grid-cols-12 end */}
      </div> {/* container max-w-6xl end */}
    </section>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="py-4 md:py-8 bg-transparent relative overflow-hidden flex-1 flex flex-col justify-center w-full">
      {/* Ripple ring sonar pulse background */}
      <RipplePulseBackground />

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/[0.01] rounded-full blur-3xl pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-stretch w-full">
          {/* Column 1: Direct Inquiries */}
          <motion.div
            variants={scrollFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col justify-between"
          >
            <div>
              <SectionHeading subtitle="Inquiries & Collaborations">Get in Touch</SectionHeading>
              <p className="text-xs sm:text-sm text-white/70 mb-4 sm:mb-8 max-w-lg font-light leading-relaxed">
                Have an ambitious project, design opportunity, or engineering position to discuss? Reach out directly via email or check my community platforms details.
              </p>

              {/* Contact Info Bento Box */}
              <div className="space-y-4 bg-white/[0.02] border border-white/5 rounded-2xl p-4 sm:p-6 relative">
                <div className="absolute top-3 right-4 flex items-center gap-1.5 bg-cyan-400/10 px-2.5 py-1 rounded-full border border-cyan-400/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[8px] font-mono uppercase text-cyan-400 font-bold tracking-wider">Active</span>
                </div>
                
                <div className="flex items-center gap-3 sm:gap-4 text-white/80 select-none">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 glass border border-white/10 rounded-xl flex items-center justify-center text-cyan-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[8px] sm:text-[9px] font-mono uppercase text-white/30 tracking-widest">[ DIRECT EMAIL ]</span>
                    <a href="mailto:tanjimulhoquetajim@gmail.com" className="hover:text-cyan-400 text-xs sm:text-sm font-light transition-colors">tanjimulhoquetajim@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 text-white/80 select-none">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 glass border border-white/10 rounded-xl flex items-center justify-center text-cyan-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[8px] sm:text-[9px] font-mono uppercase text-white/30 tracking-widest">[ LOCATION ]</span>
                    <span className="text-xs sm:text-sm font-light">Dhaka, Bangladesh</span>
                  </div>
                </div>

                <div className="flex gap-3 sm:gap-4 pt-3 border-t border-white/5">
                  <a 
                    href="https://github.com/RAXORBILL" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 p-2.5 sm:p-3 bg-white/[0.03] hover:bg-white/[0.08] hover:text-white border border-white/10 rounded-xl transition-all text-[10px] sm:text-xs text-white/70 font-mono tracking-wide"
                  >
                    <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                    <span>RAXORBILL</span>
                  </a>
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 p-2.5 sm:p-3 bg-white/[0.03] hover:bg-white/[0.08] hover:text-white border border-white/10 rounded-xl transition-all text-[10px] sm:text-xs text-white/70 font-mono tracking-wide"
                  >
                    <Linkedin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                    <span>LINKEDIN</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Column 2: Streamlined In-App Interactive Intake Node */}
          <motion.div
            variants={scrollScaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col justify-between"
          >
            <div className="h-full flex flex-col justify-between">
              <div>
                <SectionHeading subtitle="Instant Digital Portal">Contact Form</SectionHeading>
                <p className="text-xs sm:text-sm text-white/70 mb-4 sm:mb-6 max-w-lg font-light leading-relaxed">
                  Connect instantly by launching my streamlined client-intake. Open my official secured Google Form to submit your project requirements and schedule meetings.
                </p>
              </div>

              <a 
                href="https://forms.gle/n7CSdVmu7gZEucsx6"
                target="_blank"
                rel="noreferrer"
                className="p-5 sm:p-6 border border-cyan-500/15 bg-gradient-to-br from-indigo-950/15 to-black/40 rounded-2xl relative overflow-hidden group flex flex-col justify-between h-full min-h-[350px] transition-all duration-300 hover:border-[#00d2ff]/40 hover:shadow-lg hover:shadow-cyan-400/5 cursor-pointer block"
              >
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all duration-700 pointer-events-none" />
                
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[#00d2ff] font-bold flex items-center gap-1.5 flex-row">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      SECURE_INTAKE_GATEWAY
                    </span>
                    <span className="text-[8px] font-mono text-white/30 truncate flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      ONLINE_REDIRECT
                    </span>
                  </div>

                  {/* High fidelity mock form layout */}
                  <div className="space-y-3 my-4 text-left">
                    <div>
                      <div className="text-[8px] font-mono uppercase text-white/40 mb-1 tracking-widest select-none">[ SENDER IDENTITY ]</div>
                      <div className="w-full text-2xs bg-white/[0.02] border border-white/5 rounded-lg py-2 px-3 text-white/30 font-sans text-left">
                        Acme Corp / Your Name
                      </div>
                    </div>

                    <div>
                      <div className="text-[8px] font-mono uppercase text-white/40 mb-1 tracking-widest select-none">[ ROUTING DEPLOYMENT / EMAIL ]</div>
                      <div className="w-full text-2xs bg-white/[0.02] border border-white/5 rounded-lg py-2 px-3 text-white/30 font-sans text-left">
                        routing@yourdomain.com
                      </div>
                    </div>

                    <div>
                      <div className="text-[8px] font-mono uppercase text-white/40 mb-1 tracking-widest select-none">[ INTAKE PARAMETER / MESSAGE ]</div>
                      <div className="w-full text-2xs bg-white/[0.02] border border-white/5 rounded-lg py-2 px-3 text-white/30 font-sans h-14 text-left select-none overflow-hidden text-ellipsis line-clamp-2">
                        Details of project objectives, timelines, tech stack, or general query...
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mt-2">
                  <div 
                    className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-cyan-400 to-indigo-500 text-black font-semibold text-xs rounded-xl group-hover:brightness-110 active:scale-[0.98] transition-all text-center select-none font-mono tracking-wider shadow-lg shadow-cyan-400/10"
                  >
                    <ExternalLink className="w-4 h-4 shrink-0 text-black animate-pulse" />
                    <span>LAUNCH GOOGLE FORM</span>
                  </div>

                  <p className="text-[8px] font-mono text-center text-white/30 select-none">
                    * Authenticated & Hosted by Secure Google Protocol
                  </p>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Column 3: Master CV Repository Download */}
          <motion.div
            variants={scrollScaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col justify-between"
          >
            <div>
              <SectionHeading subtitle="Document Archives">My CV & Profile</SectionHeading>
              <p className="text-xs sm:text-sm text-white/70 mb-4 sm:mb-8 max-w-lg font-light leading-relaxed">
                Access my complete portfolio, certified Curriculum Vitae, and master records. Open the official PDF file directly on Google Drive for immediate viewing or offline extraction.
              </p>

              <div className="p-4 sm:p-6 border border-cyan-500/15 bg-gradient-to-br from-cyan-950/20 to-black/20 rounded-2xl relative overflow-hidden group">
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all duration-700 pointer-events-none" />
                
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-cyan-400 font-bold flex items-center gap-1.5 flex-row">
                    <FileText className="w-3.5 h-3.5" />
                    CURRICULUM_VITAE.pdf
                  </span>
                  <span className="text-[8px] font-mono text-white/30 truncate">[ LATEST UPDATE // JUNE 2026 ]</span>
                </div>

                <p className="text-[11px] sm:text-xs text-white/50 mb-4 sm:mb-6 font-light leading-relaxed">
                  Contains detailed engineering summaries, technical systems checklist, core project architectures, and academic background details. Verified & cloud-hosted.
                </p>

                <div className="flex flex-col gap-2 md:gap-3">
                  <a 
                    href="https://drive.google.com/file/d/1XhgZeVjmfuovKdQ_e0qvaKB3cXujl7z2/view?usp=sharing"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-400 to-[#00d2ff] text-black font-semibold text-xs rounded-xl hover:brightness-110 active:scale-[0.98] transition-all text-center select-none cursor-pointer font-mono tracking-wide shadow-lg shadow-cyan-400/20"
                  >
                    <ExternalLink className="w-4 h-4 shrink-0 text-black animate-pulse" />
                    <span>VIEW / DOWNLOAD CV (GOOGLE DRIVE)</span>
                  </a>

                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <a 
                      href={CV_ASCII_URI}
                      download="Tanzimul_Hoque_CV.txt"
                      className="flex items-center justify-center gap-1.5 px-2 py-2 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10 text-[9px] md:text-2xs rounded-lg transition-all text-center select-none cursor-pointer font-mono"
                    >
                      <Download className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>ASCII (.txt)</span>
                    </a>
                    <a 
                      href={CV_HTML_URI}
                      download="Tanzimul_Hoque_CV.html"
                      className="flex items-center justify-center gap-1.5 px-2 py-2 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10 text-[9px] md:text-2xs rounded-lg transition-all text-center select-none cursor-pointer font-mono"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#00d2ff] shrink-0" />
                      <span>HTML (.html)</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-12 border-t border-white/10 bg-brand-black">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <h2 className="text-xl font-display font-bold tracking-tighter mb-2">RAXORBILL</h2>
          <p className="text-white/40 text-sm">© 2026 S M TANJIMUL HOQUE TAJIM. All rights reserved.</p>
        </div>
        
        <div className="flex items-center gap-6">
          <a href="#home" className="p-3 glass rounded-full hover:bg-white/10 transition-colors">
            <ArrowUpRight className="w-4 h-4 -rotate-90" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default function Portfolio() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isEntered, setIsEntered] = useState(false);
  const [activeVideo, setActiveVideo] = useState<'forward' | 'reverse'>('forward');
  const forwardRef = useRef<HTMLVideoElement>(null);
  const reverseRef = useRef<HTMLVideoElement>(null);

  // Smooth loading progress sequence
  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * 8) + 4;
      progress = Math.min(progress + increment, 100);
      setLoadingProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        const timeout = setTimeout(() => {
          setIsLoading(false);
        }, 500); // Allow telemetry display to settle at 100%
        return () => clearTimeout(timeout);
      }
    }, 70);

    return () => clearInterval(interval);
  }, []);

  // Slide state and references
  const [activeIndex, setActiveIndex] = useState(0);
  const isTransitioning = useRef(false);
  const touchStartY = useRef(0);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Lock default body scroll fully in both states as we handle slide viewport specifically
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Sync scroll lock when entering/leaving
  useEffect(() => {
    if (isEntered) {
      setActiveIndex(0); // Set to index 0 which corresponds to "About" section
      // Prevent entering gestures (wheel scroll/touch swipe momentum) from double-triggering into Skills section
      isTransitioning.current = true;
      const timer = setTimeout(() => {
        isTransitioning.current = false;
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isEntered]);

  const handleNavigate = (index: number) => {
    if (index >= 0 && index < 5 && !isTransitioning.current) {
      setActiveIndex(index);
      isTransitioning.current = true;
      setTimeout(() => {
        isTransitioning.current = false;
      }, 850); // Match spring transition animation
    }
  };

  // Keyboard controls
  useEffect(() => {
    if (!isEntered) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        const currentSlideEl = slideRefs.current[activeIndex];
        if (currentSlideEl) {
          const isAtBottom = currentSlideEl.scrollHeight - currentSlideEl.scrollTop <= currentSlideEl.clientHeight + 4;
          if (isAtBottom) {
            handleNavigate(activeIndex + 1);
          }
        } else {
          handleNavigate(activeIndex + 1);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        const currentSlideEl = slideRefs.current[activeIndex];
        if (currentSlideEl) {
          const isAtTop = currentSlideEl.scrollTop <= 4;
          if (isAtTop) {
            handleNavigate(activeIndex - 1);
          }
        } else {
          handleNavigate(activeIndex - 1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEntered, activeIndex]);

  // Wheel transition controls
  useEffect(() => {
    if (!isEntered) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 15) return;
      if (isTransitioning.current) return;

      const currentSlideEl = slideRefs.current[activeIndex];
      if (currentSlideEl) {
        if (e.deltaY > 0) {
          // Scrolling down
          const isAtBottom = currentSlideEl.scrollHeight - currentSlideEl.scrollTop <= currentSlideEl.clientHeight + 4;
          if (isAtBottom) {
            handleNavigate(activeIndex + 1);
          }
        } else {
          // Scrolling up
          const isAtTop = currentSlideEl.scrollTop <= 4;
          if (isAtTop) {
            handleNavigate(activeIndex - 1);
          }
        }
      } else {
        if (e.deltaY > 0) {
          handleNavigate(activeIndex + 1);
        } else {
          handleNavigate(activeIndex - 1);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [isEntered, activeIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diffY = touchStartY.current - touchEndY;

    const isMobile = window.innerWidth < 768;
    const minSwipeThreshold = isMobile ? 85 : 35;
    if (Math.abs(diffY) < minSwipeThreshold) return; // ignore minor trace gestures
    if (isTransitioning.current) return;

    const currentSlideEl = slideRefs.current[activeIndex];
    
    if (diffY > 0) {
      // Swiped Up (scrolling down)
      if (currentSlideEl) {
        const isAtBottom = currentSlideEl.scrollHeight - currentSlideEl.scrollTop <= currentSlideEl.clientHeight + 6;
        if (isAtBottom) {
          handleNavigate(activeIndex + 1);
        }
      } else {
        handleNavigate(activeIndex + 1);
      }
    } else {
      // Swiped Down (scrolling up)
      if (currentSlideEl) {
        const isAtTop = currentSlideEl.scrollTop <= 6;
        if (isAtTop) {
          handleNavigate(activeIndex - 1);
        }
      } else {
        handleNavigate(activeIndex - 1);
      }
    }
  };

  useEffect(() => {
    if (activeVideo === 'forward') {
      if (forwardRef.current) {
        forwardRef.current.currentTime = 0;
        forwardRef.current.play().catch(() => {});
      }
      if (reverseRef.current) {
        reverseRef.current.pause();
      }
    } else {
      if (reverseRef.current) {
        reverseRef.current.currentTime = 0;
        reverseRef.current.play().catch(() => {});
      }
      if (forwardRef.current) {
        forwardRef.current.pause();
      }
    }
  }, [activeVideo]);

  const handleForwardEnded = () => {
    setActiveVideo('reverse');
  };

  const handleReverseEnded = () => {
    setActiveVideo('forward');
  };

  const handleReverseError = () => {
    console.warn("Cloudinary reverse transition not supported or failed to load. Falling back to simple forward loop.");
    if (forwardRef.current) {
      forwardRef.current.loop = true;
      forwardRef.current.play().catch(() => {});
    }
  };

  // Define structured full-screen slides/pages
  const slides = [
    {
      id: "about",
      name: "About",
      content: (
        <div className="flex-1 flex flex-col justify-between w-full">
          <div className="flex-grow flex flex-col justify-center">
            <About />
          </div>
          <div className="shrink-0 pt-8 pb-4">
            <FlowingSVGDivider index={1} />
            <ScrollingMarquee 
              items={[
                "INIT NODE_SYSTEM_STREAM", 
                "STABLE COMPILER CONNECTED ON PORT 3000", 
                "SECURE SSL TLS v1.3 ENGAGED", 
                "GEMINI AI SYNAPSE CORES ENERGETIC", 
                "REACT 18 SYSTEM VITAL: OPTIMAL", 
                "TAILWIND DESIGNS RENDERED AT 60FPS"
              ]} 
              speed={22} 
              direction="left"
            />
          </div>
        </div>
      )
    },
    {
      id: "skills",
      name: "Skills",
      content: (
        <div className="flex-1 flex flex-col justify-between w-full">
          <div className="flex-grow flex flex-col justify-center">
            <Skills />
          </div>
          <div className="shrink-0 pt-8 pb-4">
            <FlowingSVGDivider index={2} />
          </div>
        </div>
      )
    },
    {
      id: "projects",
      name: "Projects",
      content: (
        <div className="flex-1 flex flex-col justify-between w-full">
          <div className="flex-grow flex flex-col justify-center">
            <Projects />
          </div>
          <div className="shrink-0 pt-8 pb-4">
            <FlowingSVGDivider index={3} />
            <ScrollingMarquee 
              items={[
                "COMPILE PIPELINE RUN STATUS: PASS 🟢", 
                "VITE AGILITY INDEX: 100", 
                "CPU 12% - SYSTEM CORES ACTIVE", 
                "PERSISTENT CLOUD DB TRIGGERS SYNCHRONIZED", 
                "MEM OFFSET 0x4FB39A - CACHE VALIDATED"
              ]} 
              speed={30} 
              direction="right"
            />
          </div>
        </div>
      )
    },
    {
      id: "experience",
      name: "Experience",
      content: (
        <div className="flex-1 flex flex-col justify-between w-full">
          <div className="flex-grow flex flex-col justify-center">
            <Experience />
          </div>
          <div className="shrink-0 pt-8 pb-4">
            <FlowingSVGDivider index={4} />
          </div>
        </div>
      )
    },
    {
      id: "contact",
      name: "Contact",
      content: (
        <div className="flex-1 flex flex-col justify-between w-full">
          <div className="flex-grow flex flex-col justify-center">
            <Contact />
          </div>
          <div className="shrink-0 pt-12 pb-4">
            <Footer />
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="selection:bg-white selection:text-black min-h-screen h-screen overflow-hidden bg-black text-white relative">
      {/* Creative Quantum Loader Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="quantum-global-loader"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
            }}
            className="fixed inset-0 z-[9999]"
          >
            <CreativeLoader progress={loadingProgress} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Video (Seamless Forward-Reverse Ping-Pong Loop preserved identically as requested) */}
      <div className="fixed inset-0 z-0 bg-black pointer-events-none">
        <video
          ref={forwardRef}
          autoPlay
          muted
          playsInline
          onEnded={handleForwardEnded}
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover grayscale scale-105 transition-opacity duration-1000 ease-in-out ${
            activeVideo === 'forward' ? 'opacity-40 z-10' : 'opacity-0 z-0'
          }`}
          src="https://res.cloudinary.com/dkv1cnjib/video/upload/vdo_aif5gt.mp4"
        />
        <video
          ref={reverseRef}
          muted
          playsInline
          onEnded={handleReverseEnded}
          onError={handleReverseError}
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover grayscale scale-105 transition-opacity duration-1000 ease-in-out ${
            activeVideo === 'reverse' ? 'opacity-40 z-10' : 'opacity-0 z-0'
          }`}
          src="https://res.cloudinary.com/dkv1cnjib/video/upload/e_reverse/vdo_aif5gt.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none z-20" />
        <div className="absolute inset-0 opacity-20 pointer-events-none z-20" style={{ backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }} />
      </div>

      <AnimatePresence mode="wait">
        {!isEntered ? (
          <WelcomePage key="welcome" onEnter={() => setIsEntered(true)} />
        ) : (
          <motion.div
            key="detailed-portfolio"
            initial={{ opacity: 0, scale: 0.98, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.02, filter: 'blur(8px)' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-10 overflow-hidden flex flex-col h-full w-full"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <Navbar 
              onBackToHost={() => setIsEntered(false)} 
              activeIndex={activeIndex}
              onNavigate={handleNavigate}
            />

            {/* Slide Viewport Frame */}
            <div className="flex-1 w-full overflow-hidden relative">
              <FloatingCyberParticles />
              
              <motion.div
                animate={{ y: `-${activeIndex * 100}%` }}
                transition={{ type: "spring", stiffness: 100, damping: 18, mass: 1 }}
                className="w-full h-full flex flex-col"
              >
                {slides.map((slide, idx) => (
                  <div
                    key={slide.id}
                    ref={(el) => { slideRefs.current[idx] = el; }}
                    className="w-full h-full shrink-0 overflow-y-auto scroll-smooth flex flex-col relative select-text"
                  >
                    {/* Floating section wrapper to clear the fixed top navbar padding */}
                    <div className="pt-20 md:pt-28 pb-4 px-4 md:px-12 w-full flex-grow flex flex-col max-w-7xl mx-auto">
                      {slide.content}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Side slide tracker indicators / navigation dots */}
            <div className="fixed right-2.5 md:right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2.5 md:gap-4 items-center">
              {slides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => handleNavigate(idx)}
                  className="group flex items-center justify-center p-1.5 md:p-2 relative focus:outline-none cursor-pointer"
                  title={slide.name}
                  aria-label={`Go to slide ${slide.name}`}
                >
                  <span className="opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 absolute right-8 font-mono text-[10px] tracking-widest text-[#00d2ff] uppercase whitespace-nowrap bg-black/80 px-2 py-1 rounded border border-[#00d2ff]/20 pointer-events-none">
                    {slide.name}
                  </span>
                  <div 
                    className={`w-2 h-2 md:w-3 md:h-3 rounded-full border transition-all duration-500 flex items-center justify-center ${
                      activeIndex === idx 
                        ? 'border-[#00d2ff] bg-[#00d2ff]' 
                        : 'border-white/35 bg-transparent lg:group-hover:border-white/70'
                    }`}
                  >
                    {activeIndex === idx && (
                      <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-black animate-ping" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <RaxBot />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
