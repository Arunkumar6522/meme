import { motion, useScroll, useTransform } from "motion/react";
import { Shield, Cpu, Network, ArrowRight, Database, Cloud, Gauge, Globe, Zap, Lock, RefreshCw, Layers, Settings, CheckCircle2, TrendingUp, Server, HardDrive, CloudUpload, ShieldCheck, BookOpen, DollarSign, Brain, Activity } from "lucide-react";
import { useRef } from "react";
import mcpImage from "figma:asset/6d4fa7254c234ad12eaa0f834e54dfc38b13ead2.png";

const cards = [
  {
    id: 1,
    mainIcon: Shield,
    title: "AI-ready by design — with guard rails",
    subtitle: "",
    description: "Use MCP endpoints to enable LLMs to interact with real-time business data safely. Control what's exposed, mask sensitive fields, moderate content, audit access, and meter usage.",
    features: [
      { icon: Brain, text: "Fine-Tuning" },
      { icon: ShieldCheck, text: "Guardrails" },
      { icon: BookOpen, text: "Knowledge Base" },
      { icon: Activity, text: "Token Metering" },
    ],
    color: "from-sky-500 to-blue-600",
    iconBg: "bg-sky-500/10",
    isAI: true,
  },
  {
    id: 2,
    mainIcon: Zap,
    title: "Edge-Native Deployment",
    subtitle: "",
    description: "EdgeData runs directly on edge infrastructure, enabling real-time processing, reduced cloud dependency, and uninterrupted operations even when connectivity is unreliable.",
    features: [
      { icon: Gauge, text: "Low-latency processing for real-time decisions" },
      { icon: TrendingUp, text: "Reduced bandwidth and cloud costs" },
      { icon: Lock, text: "Enhanced data privacy and security" },
      { icon: CheckCircle2, text: "Continuous operation during network disruptions" },
    ],
    color: "from-sky-500 to-blue-600",
    iconBg: "bg-sky-500/10",
  },
  {
    id: 3,
    mainIcon: Network,
    title: "Seamless OT & IT Interoperability Without Middleware",
    subtitle: "",
    description: "EdgeData natively connects shop-floor systems with enterprise IT platforms, eliminating the need for complex middleware or custom integrations.",
    features: [
      { icon: Cpu, text: "Native support for OPC UA, Modbus TCP/RTU" },
      { icon: Cloud, text: "Direct integration with cloud platforms, databases, and REST APIs" },
      { icon: Layers, text: "No protocol translation layers" },
      { icon: Server, text: "True end-to-end data continuity" },
    ],
    color: "from-sky-500 to-blue-600",
    iconBg: "bg-sky-500/10",
  },
];

export function WhyEdgeDataScroll({ textColor, paragraphColor }: { textColor?: any; paragraphColor?: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <section ref={containerRef} className="relative bg-white" style={{ height: '500vh' }}>
      <div className="sticky top-0 h-screen flex items-center">
        <div className="max-w-[1920px] mx-auto px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Left side - Sticky title - Takes up 4 columns */}
            <motion.div className="lg:col-span-4">
              <motion.h2
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
                className="text-[#1a3c8c] text-[80px] leading-[96px] mb-6"
                style={{ 
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 700
                }}
              >
                Why EdgeData?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
                className="font-['Open_Sans'] text-[#4a5565] text-[24px] leading-[38.4px] max-w-[450px]"
              >
                Manufacturing environments are unpredictable: networks drop, machines never stop, and data loss is not an option. EdgeData is built to operate autonomously at the edge, ensuring continuous data capture, processing, and synchronization even when connectivity fails.
              </motion.p>
            </motion.div>

            {/* Right side - Scrolling cards - Takes up 8 columns */}
            <div className="lg:col-span-8 relative h-[650px] flex items-center">
              {cards.map((card, index) => {
                // Adjusted scroll sections - first card appears when section is in view
                const cardStart = index === 0 ? 0.05 : index * 0.3; // First card starts early
                const cardEnd = cardStart + 0.35; // Visibility window
                
                // For the last card, keep it pinned at the end longer
                const isLastCard = index === cards.length - 1;
                const isFirstCard = index === 0;
                
                const opacity = useTransform(
                  scrollYProgress,
                  [
                    cardStart,
                    cardStart + 0.05,  // Quick fade in
                    cardEnd - 0.15,     // Stay at full opacity much longer
                    isLastCard ? 1 : cardEnd  // Last card stays until end
                  ],
                  isFirstCard ? [0, 1, 1, 0] : (isLastCard ? [0, 1, 1, 1] : [0, 1, 1, 0])
                );

                const x = useTransform(
                  scrollYProgress,
                  [cardStart, cardStart + 0.08, cardEnd - 0.05, cardEnd],
                  isFirstCard ? [50, 0, 0, -80] : (isLastCard ? [120, 0, 0, 0] : [120, 0, 0, -80])
                );

                const scale = useTransform(
                  scrollYProgress,
                  [cardStart, cardStart + 0.05, cardEnd - 0.15, cardEnd],
                  isFirstCard ? [0.95, 1, 1, 0.95] : (isLastCard ? [0.9, 1, 1, 1] : [0.9, 1, 1, 0.95])
                );

                return (
                  <motion.div
                    key={card.id}
                    style={{
                      opacity,
                      x,
                      scale,
                    }}
                    className="absolute inset-0 flex items-center"
                  >
                    <Card {...card} index={index} />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Card({ 
  mainIcon,
  title,
  subtitle,
  description,
  color,
  iconBg,
  index,
  features,
  isAI
}: { 
  mainIcon: typeof cards[0]['mainIcon'];
  title: string;
  subtitle: string;
  description: string;
  color: string;
  iconBg: string;
  index: number;
  features: { icon: typeof cards[0]['icon']; text: string }[];
  isAI?: boolean;
}) {
  const isFirstCard = index === 0;
  
  return (
    <div className={`w-full bg-white rounded-3xl shadow-2xl border-2 border-gray-200 overflow-hidden ${isFirstCard ? 'scale-105' : ''}`}>
      {/* Card Content */}
      <div className={`${isFirstCard ? 'p-16' : 'p-12'} space-y-6`}>
        {/* Text Content */}
        <div className="space-y-4">
          {subtitle && <div className="font-['Open_Sans'] text-[16px] leading-[24px] text-sky-600">{subtitle}</div>}
          <h3 className={`text-gray-900 ${isFirstCard ? 'text-[40px] leading-[48px]' : 'text-[32px] leading-[40px]'}`} style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 600 }}>{title}</h3>
          <p className={`font-['Open_Sans'] text-gray-600 ${isFirstCard ? 'text-[22px] leading-[34px]' : 'text-[20px] leading-[32px]'}`}>{description}</p>
        </div>

        {/* For AI card, show features below description */}
        {isAI && (
          <div className={`grid grid-cols-2 gap-${isFirstCard ? '6' : '4'} pt-${isFirstCard ? '8' : '6'}`}>
            {features.map((feature, i) => (
              <div key={i} className={`flex items-center gap-3 bg-gradient-to-br from-sky-50 to-blue-50 ${isFirstCard ? 'p-6' : 'p-4'} rounded-lg border border-[#43ABFF]/20`}>
                <div className={`${isFirstCard ? 'w-12 h-12' : 'w-10 h-10'} bg-[#43ABFF]/10 rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <feature.icon className={`${isFirstCard ? 'w-6 h-6' : 'w-5 h-5'} text-[#43ABFF]`} />
                </div>
                <span className={`font-['Open_Sans'] text-gray-900 ${isFirstCard ? 'text-[16px] leading-[24px]' : 'text-[14px] leading-[20px]'}`} style={{ fontWeight: 600 }}>
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* For non-AI cards, show features below description */}
        {!isAI && (
          <div className="pt-6">
            <ul className="space-y-2">
              {features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <feature.icon className="w-5 h-5 text-sky-400" />
                  <span className="font-['Open_Sans'] text-gray-600 text-[16px] leading-[24px]">{feature.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Visual Element - only for non-AI cards */}
        {!isAI && (
          <div className="pt-8">
            {index === 1 && <EdgeNativeVisual />}
            {index === 2 && <InteroperabilityVisual />}
          </div>
        )}
      </div>

      {/* Gradient accent bar */}
      <div className={`${isFirstCard ? 'h-3' : 'h-2'} bg-gradient-to-r ${color}`} />
    </div>
  );
}

function EdgeNativeVisual() {
  return (
    <div className="bg-white rounded-xl p-8 border border-gray-200">
      <div className="flex items-center justify-between">
        {/* Edge Device */}
        <div className="flex flex-col items-center gap-3 flex-1">
          <div className="w-16 h-16 border-2 border-[#43ABFF] rounded-lg flex items-center justify-center bg-sky-50">
            <Cpu className="w-8 h-8 text-[#43ABFF]" />
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-900" style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 600 }}>Edge Device</div>
            <div className="text-xs text-gray-500 mt-1">Local Processing</div>
          </div>
        </div>

        {/* Connection Line */}
        <div className="flex-1 flex flex-col items-center gap-2 px-6">
          <div className="w-full relative h-px bg-gray-300">
            <motion.div
              animate={{ scaleX: [0, 1], opacity: [1, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.3 }}
              className="absolute top-0 left-0 h-px w-full bg-[#43ABFF] origin-left"
            />
          </div>
          <div className="text-xs text-gray-400 uppercase tracking-wider">Real-time Sync</div>
        </div>

        {/* Cloud */}
        <div className="flex flex-col items-center gap-3 flex-1">
          <div className="w-16 h-16 border-2 border-[#43ABFF] rounded-lg flex items-center justify-center bg-sky-50">
            <Cloud className="w-8 h-8 text-[#43ABFF]" />
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-900" style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 600 }}>Cloud</div>
            <div className="text-xs text-gray-500 mt-1">Centralized Storage</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InteroperabilityVisual() {
  return (
    <div className="bg-white rounded-xl p-8 border border-gray-200">
      <div className="relative h-48">
        {/* Top Row - OT and IT Endpoints */}
        <div className="flex items-start justify-between mb-8">
          {/* OT System */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-14 h-14 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
              <Settings className="w-7 h-7 text-gray-400" />
            </div>
            <div className="text-xs text-gray-900 mt-1" style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 600 }}>OT Systems</div>
            <div className="text-xs text-gray-500">PLCs, SCADA</div>
          </div>

          {/* IT System */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-14 h-14 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
              <Cloud className="w-7 h-7 text-gray-400" />
            </div>
            <div className="text-xs text-gray-900 mt-1" style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 600 }}>IT Systems</div>
            <div className="text-xs text-gray-500">Cloud, APIs</div>
          </div>
        </div>

        {/* Connection Lines and Animated Dots */}
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {/* Left line - OT to Bridge */}
          <line x1="14%" y1="70" x2="50%" y2="145" stroke="#E5E7EB" strokeWidth="2" />
          {/* Right line - Bridge to IT */}
          <line x1="50%" y1="145" x2="86%" y2="70" stroke="#E5E7EB" strokeWidth="2" />
          
          {/* Animated dot - OT to EdgeData */}
          <motion.circle
            cx="14%"
            cy="70"
            r="4"
            fill="#43ABFF"
            animate={{
              cx: ["14%", "50%"],
              cy: [70, 145],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 0.5,
            }}
          />
          
          {/* Animated dot - EdgeData to IT */}
          <motion.circle
            cx="50%"
            cy="145"
            r="4"
            fill="#43ABFF"
            animate={{
              cx: ["50%", "86%"],
              cy: [145, 70],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 0.5,
              delay: 1.5,
            }}
          />
        </svg>

        {/* Bottom Row - EdgeData Bridge */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex justify-center">
          <div className="flex flex-col items-center gap-1">
            <motion.div 
              className="w-16 h-16 border-2 border-[#43ABFF] rounded-lg flex items-center justify-center bg-sky-50 shadow-lg"
              animate={{
                boxShadow: [
                  "0 10px 15px -3px rgba(67, 171, 255, 0.1)",
                  "0 10px 15px -3px rgba(67, 171, 255, 0.3)",
                  "0 10px 15px -3px rgba(67, 171, 255, 0.1)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Network className="w-8 h-8 text-[#43ABFF]" />
            </motion.div>
            <div className="text-xs text-gray-900 mt-1" style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 700 }}>EdgeData</div>
            <div className="text-xs text-[#43ABFF]" style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 500 }}>Bridge</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResilienceVisual() {
  return (
    <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-8 border border-[#43ABFF]/30">
      <div className="space-y-6">
        {/* Title Section */}
        <div className="text-center">
          <h4 className="text-gray-900 text-[20px] leading-[28px] mb-2" style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 700 }}>
            Expose your data sources via MCP endpoints for LLMs to interact with business data in real-time.
          </h4>
          <p className="font-['Open_Sans'] text-gray-600 text-[16px] leading-[24px]">
            Use EdgeData360 AI Studio to chat with your data, generate reports, and build strategies.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Fine-Tuning */}
          <div className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-200">
            <div className="w-10 h-10 bg-[#43ABFF]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Settings className="w-5 h-5 text-[#43ABFF]" />
            </div>
            <span className="font-['Open_Sans'] text-gray-900 text-[14px] leading-[20px]" style={{ fontWeight: 600 }}>
              Fine-Tuning
            </span>
          </div>

          {/* Guardrails */}
          <div className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-200">
            <div className="w-10 h-10 bg-[#43ABFF]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#43ABFF]" />
            </div>
            <span className="font-['Open_Sans'] text-gray-900 text-[14px] leading-[20px]" style={{ fontWeight: 600 }}>
              Guardrails
            </span>
          </div>

          {/* Knowledge Base */}
          <div className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-200">
            <div className="w-10 h-10 bg-[#43ABFF]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-[#43ABFF]" />
            </div>
            <span className="font-['Open_Sans'] text-gray-900 text-[14px] leading-[20px]" style={{ fontWeight: 600 }}>
              Knowledge Base
            </span>
          </div>

          {/* Token Metering */}
          <div className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-200">
            <div className="w-10 h-10 bg-[#43ABFF]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5 text-[#43ABFF]" />
            </div>
            <span className="font-['Open_Sans'] text-gray-900 text-[14px] leading-[20px]" style={{ fontWeight: 600 }}>
              Token Metering
            </span>
          </div>
        </div>

        {/* MCP Image */}
        <div className="mt-6 flex justify-center">
          <img 
            src={mcpImage} 
            alt="MCP Features: Fine-Tuning, Guardrails, Knowledge Base, Token Metering" 
            className="w-auto h-auto max-w-full rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}