import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  Terminal,
  Cpu,
  ExternalLink,
  ArrowDownRight,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import cyberBg from "@/assets/images/cyber-bg.png";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { PostRow } from "@/components/post-row";
import { ScrambleText, SiteFooter, SiteShell } from "@/components/site-chrome";
import { posts } from "@/lib/blog";

const projects = [
  {
    title: "Badge Magic",
    description: "Cross-platform Flutter app for designing, animating, and flashing LED badge displays over BLE. Rebuilt from legacy iOS/Android natives during GSoC 2024. 3K+ Play Store downloads, 1.9K+ GitHub stars.",
    tags: ["Flutter", "Dart", "BLE", "Open Source"],
    link: "https://github.com/fossasia/badgemagic-app"
  },
  {
    title: "PreSalesforce.ai",
    description: "Sole engineer behind the backend and AI services. Designed the APIs, data model, and service layer from scratch, and integrated the AI components end-to-end to ship the product.",
    tags: ["Backend", "AI Services", "System Design", "APIs"],
    link: "https://presalesforce.ai"
  },
  {
    title: "Gpunet Feed Platform",
    description: "Event-driven fan-out feed ingesting events across multiple Gpunet products into a personalized per-user feed. Scaled producer writes while keeping read latency low; Redis caching cut p95 ~40%.",
    tags: ["Kafka", "Spring Boot", "PostgreSQL", "Redis"],
    link: "https://gpu.net"
  }
];

const skills = [
  {
    category: "Languages & Frameworks",
    items: ["Java", "Spring Boot", "Hibernate", "Node.js", "Python", "TypeScript", "Vue.js", "Flutter", "Dart"]
  },
  {
    category: "Distributed Systems",
    items: ["Apache Kafka", "Azure Event Hub", "Pub/Sub", "Event-Driven", "Fan-out", "REST APIs", "Microservices", "Auth0"]
  },
  {
    category: "Databases & Caching",
    items: ["PostgreSQL", "MySQL", "MongoDB", "Supabase", "Redis", "Query Optimization", "Indexing"]
  },
  {
    category: "Cloud, DevOps & Observability",
    items: ["AWS", "Azure", "Docker", "Kubernetes", "GitHub Actions", "Gcore", "Shadeform", "Grafana", "Kibana"]
  },
  {
    category: "Tools & Practices",
    items: ["Git", "Jira", "Agile", "TDD", "JUnit", "Mockito", "JMeter", "Postman", "Code Review"]
  }
];

const experience = [
  {
    company: "Substrate.ai",
    role: "Software Development Engineer — Backend & Platform",
    period: "Feb 2026 — Present",
    location: "Remote",
    bullets: [
      "Architected & shipped a unified GPU compute marketplace integrating Gcore and Shadeform APIs — single interface for reserved capacity and on-demand GPU consumption.",
      "Built the platform end-to-end with Vue.js + Supabase (Postgres, Auth, Edge Functions), cutting GPU provisioning from hours to minutes for onboarding customers.",
      "Designed an observability layer across on-demand and marketplace workloads, surfacing real-time GPU utilization, job health, and billing via Grafana dashboards.",
      "Hardened auth, rate limiting, and RLS policies across the Supabase backend to enable secure multi-tenant access for enterprise customers."
    ]
  },
  {
    company: "Gpu.net",
    role: "Software Development Engineer I",
    period: "Jun 2025 — Feb 2026",
    location: "Bangalore",
    bullets: [
      "Architected a fan-out, event-driven feed system using microservices and Kafka-style pub/sub to aggregate events across multiple Gpunet products into a personalized feed.",
      "Designed Spring Boot REST APIs with input validation, JWT auth, and rate limiting for high-concurrency consumer app traffic.",
      "Optimized PostgreSQL via strategic indexing and query tuning; introduced Redis caching — API response time down ~40%.",
      "Led end-to-end development of the Gpunet consumer app, integrating Astra (AI agent marketplace), the fan-out feed, and the Gvex crypto trading platform into a single mobile experience."
    ]
  },
  {
    company: "Google Summer of Code — FOSSASIA",
    role: "Open-Source Mentor",
    period: "May 2025 — Present",
    location: "Remote",
    bullets: [
      "Mentor international contributors on Badge Magic (1.9K+ GitHub stars), guiding them through scoping, architecture, and code review across the GSoC timeline.",
      "Partner with the FOSSASIA core team on development milestones and release planning, contributing to sustained project stability and community growth."
    ]
  },
  {
    company: "Infinisync Consulting",
    role: "Software Development Engineer I",
    period: "May 2024 — May 2025",
    location: "Delhi",
    bullets: [
      "Led end-to-end development of a backend to automate lead generation and appointment scheduling — cut manual sales-ops work by 60%.",
      "Engineered a Java orchestration pipeline that synchronizes generative AI audio with avatar video in real time, producing frame-accurate lip-sync output.",
      "Implemented event-driven communication using Apache Kafka to decouple services and enable asynchronous chunked streaming of AI audio to the avatar renderer.",
      "Wrote unit and integration tests (JUnit, Mockito) and stood up CI pipelines (GitHub Actions, Maven) to keep release cycles predictable."
    ]
  },
  {
    company: "Google Summer of Code — FOSSASIA",
    role: "Open-Source Mentee",
    period: "Jun 2024 — Nov 2024",
    location: "Remote",
    bullets: [
      "Selected as a GSoC 2024 mentee to build the Badge Magic Flutter app from scratch, replacing the legacy native iOS and Android apps.",
      "Shipped cross-platform BLE communication to transfer text and images to LED badges — contributed to 3K+ Play Store downloads and a 1.9K+ star repo."
    ]
  }
];

function TypewriterText({ text, delay = 0 }: { text: string, delay?: number }) {
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayText(text.substring(0, i));
        i++;
        if (i > text.length) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [text, delay]);

  return <span>{displayText}<span className="animate-pulse bg-primary inline-block w-2 h-4 ml-1 align-middle" /></span>;
}

function RandomHex() {
  const [hex, setHex] = useState("0x0000");
  
  useEffect(() => {
    const interval = setInterval(() => {
      setHex("0x" + Math.floor(Math.random()*16777215).toString(16).toUpperCase().padStart(6, '0'));
    }, Math.random() * 2000 + 1000);
    return () => clearInterval(interval);
  }, []);
  
  return <span className="opacity-30">{hex}</span>;
}

function InteractiveTerminal() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([
    "JU.OS v3.0 initialized.",
    "Type 'help' for available commands."
  ]);

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      const cmd = input.trim().toLowerCase();
      let response = "";

      switch (cmd) {
        case 'help':
          response = "Available: whoami, skills, experience, projects, education, contact, clear, sudo";
          break;
        case 'whoami':
          response = "Jhalak Upadhyay — SDE @ Substrate.ai. Backend & Platform engineer. GSoC mentor @ FOSSASIA.";
          break;
        case 'skills':
          response = "Java/Spring Boot, TypeScript, Vue.js, Flutter, Postgres, Redis, Kafka, Supabase, Docker, K8s, AWS, Azure.";
          break;
        case 'experience':
          response = "Substrate.ai (2026-) > Gpu.net (2025-26) > FOSSASIA GSoC (2024-) > Infinisync (2024-25).";
          break;
        case 'projects':
          response = "Badge Magic (Flutter, 1.9K+ stars), PreSalesforce.ai (backend+AI), Gpunet Feed (Kafka fan-out).";
          break;
        case 'education':
          response = "B.Tech CSE, KIET Group of Institutions (2021-2025). CGPA 8.3/10.";
          break;
        case 'contact':
          response = "mail: jhalak25upadhyay@gmail.com | gh: Jhalakupadhyay | in: jhalakupadhyay";
          break;
        case 'sudo':
          response = "Permission denied. This incident will be reported.";
          break;
        case 'clear':
          setHistory([]);
          setInput("");
          return;
        default:
          response = `Command not found: ${cmd}. Try 'help'.`;
      }

      setHistory(prev => [...prev, `> ${input}`, response]);
      setInput("");
    }
  };

  return (
    <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[600px] h-[480px] glass-panel hidden xl:flex flex-col font-mono text-sm z-20 interactive-terminal border-l-4 border-l-primary/80">
      {/* Hardware Accents */}
      <div className="absolute top-4 left-[-8px] w-2 h-8 bg-primary/80 rounded-l-sm shadow-[0_0_10px_hsl(var(--primary))]" />
      <div className="absolute bottom-4 left-[-8px] w-2 h-8 bg-primary/80 rounded-l-sm shadow-[0_0_10px_hsl(var(--primary))]" />
      <div className="absolute top-[-10px] right-8 w-16 h-2 bg-accent/80 rounded-t-sm shadow-[0_0_10px_hsl(var(--accent))]" />

      {/* 3D Depth Edges */}
      <div className="absolute top-0 left-[-30px] w-[30px] h-full bg-black/90 border-y border-l border-primary/30 transform origin-right rotate-y-90 skew-y-[15deg]"></div>
      <div className="absolute bottom-[-30px] left-0 w-full h-[30px] bg-black/90 border-x border-b border-primary/30 transform origin-top rotate-x-[-90deg] skew-x-[15deg]"></div>

      {/* Terminal Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-primary/30 bg-gradient-to-r from-primary/10 via-transparent to-transparent relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(180,255,0,0.05)_50%,transparent_75%)] bg-[length:200%_200%] animate-[scan_2s_linear_infinite]" />
        <div className="flex gap-3 relative z-10">
          <div className="w-4 h-1 bg-red-500/80" />
          <div className="w-4 h-1 bg-yellow-500/80" />
          <div className="w-4 h-1 bg-primary animate-pulse shadow-[0_0_10px_currentColor]" />
        </div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="hidden sm:flex flex-col gap-1 mr-4">
            <div className="flex items-center gap-2 text-[10px] text-primary/70 font-mono">
              <span>CPU</span>
              <div className="flex gap-[2px]">
                <div className="w-1.5 h-2 bg-primary animate-pulse" style={{ animationDuration: '0.8s' }} />
                <div className="w-1.5 h-2 bg-primary animate-pulse" style={{ animationDuration: '1.2s' }} />
                <div className="w-1.5 h-2 bg-primary animate-pulse" style={{ animationDuration: '0.5s' }} />
                <div className="w-1.5 h-2 bg-primary/30" />
                <div className="w-1.5 h-2 bg-primary/30" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-accent/70 font-mono">
              <span>MEM</span>
              <div className="flex gap-[2px]">
                <div className="w-1.5 h-2 bg-accent" />
                <div className="w-1.5 h-2 bg-accent" />
                <div className="w-1.5 h-2 bg-accent" />
                <div className="w-1.5 h-2 bg-accent animate-pulse" style={{ animationDuration: '2s' }} />
                <div className="w-1.5 h-2 bg-accent/30" />
              </div>
            </div>
          </div>
          <span className="text-[10px] text-primary/50 tracking-widest border border-primary/20 px-2 py-0.5 animate-pulse">SECURE_LINK_ACTIVE</span>
          <span className="text-primary font-bold tracking-widest bg-primary/10 px-3 py-1 border border-primary/20 shadow-[0_0_15px_rgba(180,255,0,0.2)]">ROOT@JUDEV_CORE</span>
        </div>
      </div>
      
      {/* Terminal Body */}
      <div className="flex-1 p-8 overflow-y-auto flex flex-col gap-4 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(180,255,0,0.03)_0%,transparent_100%)] pointer-events-none"></div>
        <div className="terminal-scanlines"></div>
        
        {/* Decorative Grid Lines */}
        <div className="absolute left-4 top-0 w-[1px] h-full bg-primary/10" />
        <div className="absolute right-4 top-0 w-[1px] h-full bg-primary/10" />

        {history.map((line, i) => (
          <div key={i} className={`${line.startsWith('>') ? 'text-accent font-bold tracking-wide' : 'text-primary drop-shadow-[0_0_8px_rgba(180,255,0,0.5)]'} pl-4 border-l-2 ${line.startsWith('>') ? 'border-accent' : 'border-primary/30'}`}>
            {line}
          </div>
        ))}
        <div className="flex gap-3 items-center mt-6 pl-4 border-l-2 border-transparent relative">
          <div className="absolute left-[-2px] w-2 h-full bg-primary animate-pulse" />
          <span className="text-white font-bold">{"[EXEC] >"}</span>
          <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleCommand}
            className="flex-1 bg-transparent border-none outline-none text-white focus:ring-0 uppercase placeholder-zinc-700 tracking-wider font-bold"
            placeholder="AWAITING COMMAND..."
            spellCheck="false"
            autoComplete="off"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}

function ExperienceCard({ role, index }: { role: typeof experience[number], index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 22, mass: 0.4 });

  const opacity = useTransform(smooth, [0, 0.18, 0.82, 1], [0, 1, 1, 0]);
  const y = useTransform(smooth, [0, 0.18, 0.82, 1], [90, 0, 0, -60]);
  const xDir = index % 2 === 0 ? -50 : 50;
  const x = useTransform(smooth, [0, 0.18, 0.82, 1], [xDir, 0, 0, -xDir]);
  const scale = useTransform(smooth, [0, 0.18, 0.82, 1], [0.92, 1, 1, 0.94]);
  const blur = useTransform(smooth, [0, 0.18, 0.82, 1], [8, 0, 0, 6]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y, x, scale, filter }}
      className="relative pl-8 md:pl-[200px] will-change-transform"
    >
      <div className="absolute left-[-5px] md:left-[155px] top-2 w-[11px] h-[11px] bg-primary rounded-full shadow-[0_0_15px_hsl(var(--primary))]" />
      <div className="absolute left-0 md:left-0 top-0 md:w-[140px] font-mono text-[11px] uppercase tracking-widest text-accent md:text-right md:pr-6 mb-3 md:mb-0 hidden md:block">
        {role.period}
      </div>

      <div className="border border-white/10 bg-black/40 hover:border-primary/40 transition-colors p-6 md:p-8 relative group">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        <div className="font-mono text-[10px] uppercase tracking-widest text-accent mb-2 md:hidden">{role.period}</div>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-1">
          <h3 className="text-2xl md:text-3xl font-display text-white group-hover:text-primary transition-colors">{role.company}</h3>
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">// {role.location}</span>
        </div>
        <div className="text-sm font-mono text-zinc-400 mb-5">{role.role}</div>
        <ul className="space-y-3 text-sm font-mono text-zinc-400">
          {role.bullets.map((b, j) => (
            <li key={j} className="flex gap-3">
              <span className="text-primary flex-shrink-0">{">"}</span>
              <span className="leading-relaxed">{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [logs, setLogs] = useState<string[]>([]);
  
  useEffect(() => {
    const bootLogs = [
      "INIT_SYSTEM_KERNEL... OK",
      "LOADING_DRIVERS... OK",
      "MOUNTING_VIRTUAL_FS... OK",
      "STARTING_NETWORK_INTERFACE... [192.168.1.104]",
      "ESTABLISHING_SECURE_UPLINK... DONE",
      "DECRYPTING_USER_PROFILE: JHALAK_UPADHYAY... VERIFIED",
      "INJECTING_CSS_VARIABLES... OK",
      "COMPILING_WASM_MODULES... OK",
      "BYPASSING_MAINFRAME... SUCCESS",
      "LAUNCHING_PORTFOLIO_V3.0..."
    ];

    let i = 0;
    const interval = setInterval(() => {
      setLogs(prev => [...prev, bootLogs[i]]);
      i++;
      if (i >= bootLogs.length) {
        clearInterval(interval);
        setTimeout(onComplete, 800);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[99999] bg-black flex flex-col justify-end p-8 font-mono text-sm text-primary">
      <div className="max-w-2xl w-full">
        {logs.map((log, i) => (
          <div key={i} className="mb-1">{`> ${log}`}</div>
        ))}
        <div className="w-3 h-4 bg-primary animate-pulse mt-1" />
      </div>
    </div>
  );
}

function SystemCore() {
  const [nodes, setNodes] = useState<{id: number, active: boolean, size: number, x: number, y: number}[]>([]);

  useEffect(() => {
    // Generate random nodes for the core
    const newNodes = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      active: Math.random() > 0.7,
      size: Math.random() * 4 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    setNodes(newNodes);

    // Pulse nodes randomly
    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => ({
        ...node,
        active: Math.random() > 0.85 ? !node.active : node.active
      })));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute right-0 top-0 w-full md:w-[800px] h-[800px] pointer-events-none overflow-hidden mix-blend-screen opacity-60">
      <div className="relative w-full h-full">
        {/* Core rings */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-primary/20 rounded-full border-dashed"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] border border-accent/20 rounded-full"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 80%, 0 80%)' }}
        />
        
        {/* The "Eye" */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px] bg-primary/5 rounded-full border border-primary/50 shadow-[0_0_50px_hsl(var(--primary))] flex items-center justify-center">
          <div className="w-[100px] h-[100px] bg-black rounded-full flex items-center justify-center border border-primary/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(180,255,0,0.2)_0%,transparent_100%)]"></div>
            <div className="w-4 h-4 bg-primary rounded-full animate-pulse shadow-[0_0_20px_hsl(var(--primary))]"></div>
            
            {/* Spinning inner crosshair */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-4 bg-primary"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-4 bg-primary"></div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-[1px] bg-primary"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-[1px] bg-primary"></div>
            </motion.div>
          </div>
        </div>

        {/* Floating Data Nodes */}
        {nodes.map(node => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: node.active ? 1 : 0.2,
              scale: node.active ? 1.5 : 1
            }}
            transition={{ duration: 0.5 }}
            className={`absolute rounded-full ${node.active ? 'bg-primary shadow-[0_0_10px_hsl(var(--primary))]' : 'bg-accent'}`}
            style={{
              width: node.size,
              height: node.size,
              left: `${node.x}%`,
              top: `${node.y}%`,
            }}
          />
        ))}

        {/* Connecting Lines (Simulated with SVG) */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <motion.path 
            animate={{ strokeDashoffset: [1000, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            d="M400,400 L600,200 L750,300 L700,600 L400,400" 
            fill="none" 
            stroke="hsl(var(--primary))" 
            strokeWidth="1" 
            strokeDasharray="10 10" 
          />
          <motion.path 
            animate={{ strokeDashoffset: [0, 1000] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            d="M400,400 L200,600 L100,500 L250,200 L400,400" 
            fill="none" 
            stroke="hsl(var(--accent))" 
            strokeWidth="1" 
            strokeDasharray="5 15" 
          />
        </svg>

        {/* Scanning Laser */}
        <div className="laser-scan"></div>
      </div>
    </div>
  );
}

// Play the boot animation once per visit, not on every return to this page.
let hasBooted = false;

export default function Home() {
  const [booted, setBooted] = useState(hasBooted);
  const finishBoot = useCallback(() => {
    hasBooted = true;
    setBooted(true);
  }, []);
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 180]);

  return (
    <>
      {!booted && <BootSequence onComplete={finishBoot} />}
      <SiteShell className={`transition-opacity duration-1000 ${booted ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'}`}>

      {/* Kinetic Typography Hero */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20 perspective-1000">
        
        {/* Abstract Background Matrix instead of the ring */}
        <div className="absolute inset-0 ascii-grid opacity-30 pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Replaced 3D shape with Interactive Terminal */}
          <InteractiveTerminal />

          <div className="border-l-2 border-primary pl-6 md:pl-12 py-12 relative bg-gradient-to-r from-primary/5 to-transparent max-w-3xl">
            <div className="absolute top-0 left-[-6px] w-3 h-3 bg-primary animate-pulse shadow-[0_0_10px_hsl(var(--primary))]"></div>
            <div className="absolute bottom-0 left-[-6px] w-3 h-3 bg-primary shadow-[0_0_10px_hsl(var(--primary))]"></div>
            
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display uppercase mb-4 tracking-tighter relative">
                <span className="block text-white mb-2">Backend engineer</span>
                <span className="block text-primary glitch-hover" data-text="building AI infrastructure">
                  <ScrambleText text="building AI infrastructure" />
                </span>
                <span className="block text-white mt-2">and distributed systems.</span>
                
                {/* Floating Tech Data */}
                <div className="absolute top-[-20%] right-[-10%] text-xs font-mono text-accent hidden md:flex flex-col gap-1 items-end pointer-events-none">
                  <RandomHex />
                  <RandomHex />
                  <RandomHex />
                </div>
              </h1>
              <p className="text-zinc-400 text-lg md:text-xl font-mono mt-6 max-w-2xl border-l-2 border-accent pl-4">
                SDE — Backend &amp; Platform at <span className="text-white">Substrate.ai</span>. Google Summer of Code mentor at FOSSASIA. I turn messy, ambitious systems — GPU marketplaces, event-driven feeds, AI orchestration pipelines — into things people can actually ship.
              </p>

              <div className="mt-6 flex flex-wrap gap-3 font-mono text-[11px] uppercase tracking-widest">
                <span className="border border-primary/40 bg-primary/5 text-primary px-3 py-1">GPU Marketplace</span>
                <span className="border border-accent/40 bg-accent/5 text-accent px-3 py-1">Event-Driven</span>
                <span className="border border-white/20 bg-white/5 text-zinc-300 px-3 py-1">Distributed Systems</span>
                <span className="border border-white/20 bg-white/5 text-zinc-300 px-3 py-1">Flutter BLE</span>
                <span className="border border-white/20 bg-white/5 text-zinc-300 px-3 py-1">Open Source</span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-12 flex flex-col md:flex-row gap-8 max-w-3xl text-sm md:text-base text-zinc-400"
            >
              <div className="flex-1 border-t border-primary/30 pt-4 bg-black/40 p-4 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                <strong className="text-primary font-mono block mb-2">{">"} ABOUT_</strong>
                I work on the backend of AI platforms — GPU orchestration, event-driven fan-out systems, and the plumbing that makes the shiny parts possible. Today at Substrate.ai I&apos;m shipping a unified GPU compute marketplace across Gcore and Shadeform; before that I architected a Kafka-style fan-out feed at Gpu.net and cut API latency ~40% with Redis + indexing. My open-source path started as a GSoC 2024 mentee building Badge Magic for FOSSASIA — a year later I came back as a mentor. I care about systems that are honest about their failure modes and code the next person can actually read.
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Metrics Strip */}
      <section className="border-y border-white/10 bg-[#050505] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/10 relative z-10">
          <div className="p-6 md:p-10 hover-target group">
            <div className="text-4xl md:text-5xl font-display text-primary group-hover:text-white transition-colors">~40%</div>
            <div className="text-xs text-zinc-500 font-mono uppercase tracking-widest mt-3">API latency cut via Redis + indexing @ Gpu.net</div>
          </div>
          <div className="p-6 md:p-10 hover-target group">
            <div className="text-4xl md:text-5xl font-display text-primary group-hover:text-white transition-colors">60%</div>
            <div className="text-xs text-zinc-500 font-mono uppercase tracking-widest mt-3">Manual sales-ops reduction @ Infinisync</div>
          </div>
          <div className="p-6 md:p-10 hover-target group">
            <div className="text-4xl md:text-5xl font-display text-primary group-hover:text-white transition-colors">1.9K+</div>
            <div className="text-xs text-zinc-500 font-mono uppercase tracking-widest mt-3">GitHub stars on Badge Magic (FOSSASIA)</div>
          </div>
          <div className="p-6 md:p-10 hover-target group">
            <div className="text-4xl md:text-5xl font-display text-primary group-hover:text-white transition-colors">3K+</div>
            <div className="text-xs text-zinc-500 font-mono uppercase tracking-widest mt-3">Play Store downloads (Badge Magic)</div>
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section id="experience" className="py-32 bg-[#030303] relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-primary/30 pb-8">
            <div>
              <h2 className="text-4xl md:text-6xl mb-4 font-display text-white glitch-hover" data-text="Work.log">
                <ScrambleText text="Work.log" />
              </h2>
              <p className="text-primary text-lg max-w-xl font-mono">
                Shipping backend & platform systems — 2024 → now.
              </p>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 text-right">
              <div>[ chronological // descending ]</div>
              <div className="text-accent mt-1">5 ROLES // 2 CONTINENTS</div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-0 md:left-[160px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-primary/60 via-primary/20 to-transparent" />

            <div className="flex flex-col gap-14">
              {experience.map((role, i) => (
                <ExperienceCard key={i} role={role} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="work" className="py-32 relative bg-[#030303]">
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ 
            backgroundImage: `url(${cyberBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        />
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#050505] to-transparent z-10"></div>
        
        <div className="container mx-auto px-6 relative z-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 border-b border-primary/30 pb-8">
            <div>
              <h2 className="text-4xl md:text-6xl mb-4 font-display text-white glitch-hover" data-text="Things I've built">
                <ScrambleText text="Things I've built" />
              </h2>
              <p className="text-primary text-lg max-w-xl font-mono">
                System architecture and application development.
              </p>
            </div>
            <Button 
              variant="link" 
              className="text-accent hover:text-white p-0 h-auto text-lg font-mono uppercase tracking-widest hover-target"
              onClick={() => window.open('https://github.com/Jhalakupadhyay', '_blank')}
            >
              View All Repos <ArrowDownRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card 
                  className="h-full glass border-white/10 hover:border-primary/50 transition-all duration-300 group overflow-hidden bg-background/90 hover:shadow-[0_0_30px_rgba(180,255,0,0.15)] relative cursor-pointer"
                  onClick={() => window.open(project.link, '_blank')}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CardContent className="p-8 flex flex-col h-full relative z-10">
                    <div className="mb-6 flex justify-between items-start">
                      <div className="p-3 bg-white/5 rounded-none border border-white/10 group-hover:border-primary group-hover:bg-primary/10 transition-colors">
                        <Cpu className="w-6 h-6 text-zinc-400 group-hover:text-primary transition-colors" />
                      </div>
                      <a href={project.link} target="_blank" rel="noreferrer" className="hover-target text-zinc-500 hover:text-accent transition-colors bg-white/5 p-2 border border-white/10 hover:border-accent">
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </div>
                    <h3 className="text-2xl mb-4 text-white group-hover:text-primary transition-colors font-display tracking-tight">{project.title}</h3>
                    <p className="text-zinc-400 mb-8 flex-grow font-mono text-sm leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-mono uppercase tracking-widest text-accent bg-accent/10 px-2 py-1 border border-accent/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Infinite Marquee Divider */}
      <div className="w-full bg-primary text-black py-4 border-y border-white/20 marquee-container overflow-hidden">
        <div className="marquee-content flex gap-8 text-xl font-display uppercase font-bold whitespace-nowrap">
          {Array(10).fill("DISTRIBUTED SYSTEMS // MICROSERVICES // FLUTTER // AI AGENTS // ").map((text, i) => (
            <span key={i} className="hover:text-white transition-colors">{text}</span>
          ))}
        </div>
      </div>

      {/* Expertise/Skills - Technical Grid */}
      <section id="skills" className="py-32 relative bg-[#020202]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">
            {/* Background Hex Nodes */}
            <div className="absolute top-0 right-0 text-xs font-mono text-primary flex flex-col gap-2 pointer-events-none mix-blend-screen">
              <RandomHex />
              <RandomHex />
            </div>

            <div className="md:col-span-4">
              <h2 className="text-4xl md:text-5xl mb-6 uppercase glitch-hover text-white" data-text="Stack I work in">
                <ScrambleText text="Stack I work in" />
              </h2>
              <p className="text-zinc-500 text-sm max-w-sm font-mono border-l-2 border-accent pl-4">
                A comprehensive look at the tools, languages, and infrastructure used to architect and deploy production-ready systems.
              </p>
            </div>

            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {skills.map((skill, i) => (
                <div key={i} className="border border-white/10 p-6 bg-[#050505] hover:border-accent/50 transition-colors hover:shadow-[0_0_20px_rgba(255,0,255,0.1)] hover-target">
                  <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                    <h4 className="text-xl text-white font-display">{skill.category}</h4>
                    <Terminal className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skill.items.map(item => (
                      <span key={item} className="px-3 py-1 bg-black text-xs font-mono border border-white/10 text-primary hover:bg-primary hover:text-black transition-colors cursor-default">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Education */}
      <section id="education" className="py-24 border-t border-white/10 bg-[#030303] relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-4">
              <div className="text-xs text-accent mb-3 font-mono tracking-widest uppercase">[EDU.DAT]</div>
              <h2 className="text-4xl md:text-5xl font-display text-white glitch-hover" data-text="Education">
                <ScrambleText text="Education" />
              </h2>
            </div>
            <div className="md:col-span-8 border border-white/10 bg-black/40 p-6 md:p-8 relative group hover:border-primary/40 transition-colors">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/5 border border-white/10 group-hover:border-primary transition-colors">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-1">
                    <h3 className="text-2xl font-display text-white">KIET Group of Institutions</h3>
                    <span className="font-mono text-[11px] uppercase tracking-widest text-accent">Nov 2021 — Jun 2025</span>
                  </div>
                  <div className="font-mono text-sm text-zinc-400 mb-4">B.Tech. in Computer Science and Engineering &nbsp;·&nbsp; <span className="text-primary">CGPA 8.3 / 10</span></div>
                  <div className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Relevant Coursework</div>
                  <div className="flex flex-wrap gap-2">
                    {["Data Structures & Algorithms","Object-Oriented Programming","Operating Systems","Computer Networks","Databases","Discrete Mathematics","Advanced DSA"].map(c => (
                      <span key={c} className="text-[10px] font-mono uppercase tracking-widest text-accent bg-accent/10 px-2 py-1 border border-accent/20">{c}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest writing */}
      {posts.length > 0 && (
        <section id="blog" className="py-32 border-t border-white/10 bg-[#030303] relative">
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-primary/30 pb-8">
              <div>
                <h2 className="text-4xl md:text-6xl mb-4 font-display text-white glitch-hover" data-text="Blog.log">
                  <ScrambleText text="Blog.log" />
                </h2>
                <p className="text-primary text-lg max-w-xl font-mono">
                  Notes, deep dives and things I've learned along the way.
                </p>
              </div>
              <Link href="/blog" className="hover-target inline-flex items-center text-accent hover:text-white text-lg font-mono uppercase tracking-widest">
                All Posts <ArrowDownRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
            <div className="border-t border-white/10">
              {posts.slice(0, 3).map((post, i) => (
                <PostRow key={post.slug} post={post} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Terminal CTA */}
      <section id="contact" className="py-32 border-t border-white/10 bg-black relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto border border-white/20 bg-[#050505] shadow-[0_0_50px_rgba(180,255,0,0.05)] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs text-zinc-500 font-mono">root@judev:~</span>
            </div>
            <div className="p-8 md:p-12 font-mono relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(180,255,0,0.05)_0%,transparent_100%)] pointer-events-none"></div>
              
              <div className="mb-8">
                <p className="text-zinc-400 mb-2">$ ./initiate_contact.sh --target="Jhalak Upadhyay"</p>
                <div className="text-primary h-6">
                  <TypewriterText text="Establishing secure connection... OK. Payload ready." delay={500} />
                </div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-5xl font-display text-white mb-6 uppercase glitch-hover" data-text="Get in touch">
                  <ScrambleText text="Get in touch" />
                </h2>
                <p className="text-zinc-500 mb-10 max-w-xl text-sm leading-relaxed border-l-2 border-white/20 pl-4">
                  Open to discussing backend &amp; platform work, distributed systems, GPU / AI infrastructure, or mentoring open-source contributors. Awaiting command input.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                  <a href="mailto:jhalak25upadhyay@gmail.com" className="hover-target border border-white/15 bg-black/60 hover:border-primary/60 transition-colors p-4 group">
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono uppercase tracking-widest mb-2"><Mail className="w-3 h-3" /> Mail</div>
                    <div className="text-sm font-mono text-white group-hover:text-primary break-all">jhalak25upadhyay@gmail.com</div>
                  </a>
                  <a href="https://github.com/Jhalakupadhyay" target="_blank" rel="noreferrer" className="hover-target border border-white/15 bg-black/60 hover:border-primary/60 transition-colors p-4 group">
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono uppercase tracking-widest mb-2"><Github className="w-3 h-3" /> GitHub</div>
                    <div className="text-sm font-mono text-white group-hover:text-primary">@Jhalakupadhyay</div>
                  </a>
                  <a href="https://www.linkedin.com/in/jhalak-upadhyay-95447922b/" target="_blank" rel="noreferrer" className="hover-target border border-white/15 bg-black/60 hover:border-primary/60 transition-colors p-4 group">
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono uppercase tracking-widest mb-2"><Linkedin className="w-3 h-3" /> LinkedIn</div>
                    <div className="text-sm font-mono text-white group-hover:text-primary">/in/jhalak-upadhyay-95447922b</div>
                  </a>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="mailto:jhalak25upadhyay@gmail.com?subject=Let%27s%20work%20together"
                    className="hover-target inline-flex items-center justify-center rounded-none bg-primary text-black hover:bg-white transition-colors h-14 px-8 text-sm uppercase tracking-widest font-bold border border-primary relative overflow-hidden group"
                  >
                    <span className="relative z-10 group-hover:text-black">Execute [Hire Me]</span>
                    <div className="absolute inset-0 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                  </a>
                  <a
                    href="/Jhalak_Upadhyay_Resume.pdf"
                    download
                    className="hover-target inline-flex items-center justify-center rounded-none border border-white/20 hover:border-accent hover:bg-accent/10 hover:text-white transition-colors h-14 px-8 text-sm uppercase tracking-widest text-white"
                  >
                    Download_Resume.pdf
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </SiteShell>
    </>
  );
}
