import { motion, useMotionValue, useSpring } from "framer-motion";
import { Github, Linkedin, Mail, Zap } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Link } from "wouter";

export const GITHUB_URL = "https://github.com/Jhalakupadhyay";
export const LINKEDIN_URL = "https://www.linkedin.com/in/jhalak-upadhyay-95447922b/";
export const EMAIL = "jhalak25upadhyay@gmail.com";

const GLITCH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>";

export function ScrambleText({ text, className }: { text: string, className?: string }) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) {
      setDisplayText(text);
      return;
    }

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(() =>
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) {
              return text[index];
            }
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }

      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [isHovered, text]);

  return (
    <span
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {displayText}
    </span>
  );
}

function CursorTrail() {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    let idCounter = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const newParticle = { id: idCounter++, x: e.clientX, y: e.clientY };
      setParticles((prev) => [...prev.slice(-20), newParticle]);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed pointer-events-none z-[9999] w-2 h-2 bg-primary rounded-sm mix-blend-screen"
          style={{
            left: p.x,
            top: p.y,
            boxShadow: '0 0 10px hsl(var(--primary))'
          }}
        />
      ))}
    </>
  );
}

function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 700, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    const handleMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button, input, textarea, .hover-target')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[10000] mix-blend-difference flex items-center justify-center"
      style={{ x: cursorXSpring, y: cursorYSpring }}
    >
      <motion.div
        className="relative flex items-center justify-center transition-all duration-300"
        animate={{
          scale: isHovering ? 1.5 : 1,
          rotate: isHovering ? 180 : 0,
        }}
      >
        {/* Hacker Cursor Box */}
        <div className={`w-6 h-6 border-2 transition-colors duration-300 ${isHovering ? 'border-accent' : 'border-primary'} border-dashed opacity-70 absolute`} />
        {/* Inner Dot */}
        <div className={`w-2 h-2 ${isHovering ? 'bg-accent' : 'bg-primary'} shadow-[0_0_10px_currentColor]`} />
      </motion.div>
    </motion.div>
  );
}

const navLinkClass = "hover-target text-zinc-400 hover:text-primary transition-colors hover:font-bold";

function SiteNav() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/10 uppercase text-xs tracking-[0.2em]">
      <div className="flex justify-between items-center px-4 py-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="hover-target flex items-center gap-2 text-primary animate-pulse">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-accent font-bold">SYS.ONLINE</span>
          </Link>
        </div>
        <div className="hidden md:flex gap-8">
          <a href="/#experience" className={navLinkClass}>DIR // WORK.LOG</a>
          <a href="/#work" className={navLinkClass}>DIR // PROJECTS</a>
          <a href="/#skills" className={navLinkClass}>DIR // STACK</a>
          <Link href="/blog" className={navLinkClass}>DIR // BLOG.LOG</Link>
          <a href="/#contact" className={navLinkClass}>EXE // CONTACT</a>
        </div>
        <div className="flex items-center gap-4 text-right">
          <Link href="/blog" className={`md:hidden ${navLinkClass}`}>BLOG</Link>
          <span className="glitch-hover" data-text="JU.DEV_V3.0">JU.DEV_V3.0</span>
        </div>
      </div>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="py-8 border-t border-white/10 bg-[#020202]">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs uppercase tracking-widest text-zinc-600 font-mono">
        <div className="flex gap-6">
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="hover-target hover:text-primary transition-colors flex items-center gap-2">
            <Github className="w-4 h-4" /> GitHub
          </a>
          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="hover-target hover:text-primary transition-colors flex items-center gap-2">
            <Linkedin className="w-4 h-4" /> LinkedIn
          </a>
          <a href={`mailto:${EMAIL}`} className="hover-target hover:text-primary transition-colors flex items-center gap-2">
            <Mail className="w-4 h-4" /> Email
          </a>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          SYSTEM V3.0 // ONLINE
        </div>
      </div>
    </footer>
  );
}

/** Background effects, cursor and navigation shared by every page. */
export function SiteShell({ children, className = "" }: { children: ReactNode, className?: string }) {
  return (
    <div className={`relative min-h-screen tech-pattern cursor-none ${className}`}>
      <div className="noise-overlay" />
      <div className="scanlines" />
      <CursorTrail />
      <CustomCursor />
      <SiteNav />
      {children}
    </div>
  );
}
