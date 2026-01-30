import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { TrendingUp, Zap, Network, ArrowRight, Sparkles } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

const solutions = [
  {
    tag: "Solution 01",
    title: "OEE Optimization",
    description: "Achieve real-time visibility into Overall Equipment Effectiveness with continuous, contextualized machine data that drives actionable insights and measurable improvements.",
    visual: "oee",
    color: "#43ABFF",
  },
  {
    tag: "Solution 02",
    title: "Predictive Maintenance",
    description: "Prevent costly downtime by leveraging edge AI and machine learning models fed with guaranteed, high-fidelity sensor data for early fault detection.",
    visual: "predictive",
    color: "#7B4AE2",
  },
];

export function SolutionsPage() {
  const heroRef = useRef(null);
  const solutionsRef = useRef(null);
  const ctaRef = useRef(null);

  const isHeroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const isSolutionsInView = useInView(solutionsRef, { once: true, margin: "-150px" });
  const isCtaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  return (
    <div className="min-h-screen bg-white">
      <Header 
        textColor="rgb(55, 65, 81)" 
        bgColor="rgba(255, 255, 255, 0.9)"
        borderColor="rgba(229, 231, 235, 1)"
      />

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-gradient-to-b from-[#f8fafc] to-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center max-w-[1000px] mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <span className="text-[13px] font-semibold text-[#43ABFF] bg-[#43ABFF]/10 px-4 py-2 rounded-full border border-[#43ABFF]/20">
                Solutions
              </span>
            </motion.div>
            
            <h1 
              className="text-[#1a3c8c] text-[36px] sm:text-[56px] md:text-[72px] lg:text-[80px] leading-[44px] sm:leading-[64px] md:leading-[80px] lg:leading-[96px] mb-6 px-4 sm:px-0"
              style={{ 
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 700
              }}
            >
              Solve Your Toughest Manufacturing Challenges
            </h1>
            <p className="font-['Open_Sans'] text-[#4a5565] text-[16px] sm:text-[20px] md:text-[24px] leading-[26px] sm:leading-[32px] md:leading-[38px] max-w-[900px] mx-auto px-4 sm:px-0">
              Leverage continuous, contextualized data to achieve real-time operational insights and drive efficiency.
            </p>
          </motion.div>
        </div>

        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
          backgroundImage: `
            linear-gradient(to right, #43ABFF 1px, transparent 1px),
            linear-gradient(to bottom, #43ABFF 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }} />
      </section>

      {/* Solutions Section */}
      <section ref={solutionsRef} className="py-20 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="space-y-32">
            {solutions.map((solution, index) => (
              <SolutionCard key={index} {...solution} index={index} isInView={isSolutionsInView} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="relative bg-white py-12 md:py-20">
        <div className="max-w-[1920px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative bg-gradient-to-b from-[#43ABFF] to-[#1a8de8] rounded-[20px] md:rounded-[38.919px] overflow-hidden"
            style={{ minHeight: "400px" }}
          >
            {/* Background overlay */}
            <div 
              className="absolute inset-0 bg-[rgba(56,127,245,0.1)]" 
              style={{ 
                backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 70%)" 
              }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center py-12 md:py-20 px-6 md:px-12">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-white text-[36px] md:text-[60px] lg:text-[80px] leading-[44px] md:leading-[72px] lg:leading-[96px] mb-6 md:mb-8"
                style={{ 
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 700
                }}
              >
                Ready to End Data Gaps?
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="font-['Open_Sans'] text-white text-[16px] md:text-[20px] lg:text-[24px] leading-[25.6px] md:leading-[32px] lg:leading-[38.4px] opacity-90 max-w-[1100px] mb-8 md:mb-12"
              >
                Join leading manufacturers who have eliminated data loss and accelerated their digital transformation with EdgeData.
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 30 }}
                animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-[#43ABFF] rounded-full px-8 md:px-[56px] py-3 md:py-[20px] shadow-[0px_32.432px_40.541px_-8.108px_rgba(0,0,0,0.1),0px_12.973px_16.216px_-9.73px_rgba(0,0,0,0.1)]"
              >
                <p className="font-['Open_Sans'] text-[16px] md:text-[18px] lg:text-[20px] leading-[24px] md:leading-[28px] lg:leading-[32px] whitespace-nowrap">
                  Request a Personalized Demo
                </p>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function SolutionCard({
  tag,
  title,
  description,
  visual,
  color,
  index,
  isInView,
}: {
  tag: string;
  title: string;
  description: string;
  visual: string;
  color: string;
  index: number;
  isInView: boolean;
}) {
  const ref = useRef(null);
  const cardInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={cardInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.9,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
        {/* Text Content */}
        <div className={`${index % 2 === 1 ? "lg:order-2" : ""}`}>
          {/* Tag with line */}
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={cardInView ? { width: 50, opacity: 0.4 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 + 0.2 }}
              className="h-[2px]"
              style={{ backgroundColor: color }}
            />
            <motion.span
              initial={{ opacity: 0.4, y: 20 }}
              animate={cardInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 + 0.3 }}
              className="font-['Open_Sans'] text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px] tracking-[0.1em] uppercase"
              style={{ color: color }}
            >
              {tag}
            </motion.span>
          </div>

          {/* Title */}
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={cardInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.7,
              delay: index * 0.15 + 0.4,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] leading-[40px] sm:leading-[48px] md:leading-[56px] lg:leading-[68px] mb-6"
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 700,
              color: "#1a3c8c"
            }}
          >
            {title}
          </motion.h3>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={cardInView ? { opacity: 1 } : {}}
            transition={{
              duration: 0.8,
              delay: index * 0.15 + 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="font-['Open_Sans'] text-[16px] sm:text-[18px] md:text-[20px] leading-[26px] sm:leading-[30px] md:leading-[32px] opacity-80 mb-8"
            style={{ color: "#4a5565" }}
          >
            {description}
          </motion.p>

          {/* Learn More Link */}
          <motion.a
            href="#"
            initial={{ opacity: 0 }}
            animate={cardInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: index * 0.15 + 0.7 }}
            className="inline-flex items-center gap-2 text-[16px] font-semibold hover:gap-3 transition-all"
            style={{ color: color }}
          >
            Learn More
            <ArrowRight className="w-5 h-5" />
          </motion.a>

          {/* Indicator Dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={cardInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: index * 0.15 + 0.8 }}
            className="flex gap-2 mt-8"
          >
            {[0, 1].map((dotIndex) => (
              <motion.div
                key={dotIndex}
                initial={{ opacity: 0, scale: 0 }}
                animate={cardInView ? { opacity: dotIndex === index ? 1 : 0.3, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: index * 0.15 + 0.85 + dotIndex * 0.05 }}
                className="size-[8px] rounded-full"
                style={{
                  backgroundColor: dotIndex === index ? color : "#9ca3af",
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Visual */}
        <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={cardInView ? { opacity: 1, scale: 1 } : {}}
            transition={{
              duration: 0.9,
              delay: index * 0.15 + 0.4,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative rounded-[16px] overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
              border: `1px solid ${color}30`,
            }}
          >
            <div className="aspect-[16/10] relative">
              {visual === "oee" && <OEEVisual color={color} />}
              {visual === "predictive" && <PredictiveVisual color={color} />}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function OEEVisual({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-12">
      <div className="w-full max-w-[500px] space-y-6">
        {/* OEE Metric Cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Availability", value: "94.2%" },
            { label: "Performance", value: "87.5%" },
            { label: "Quality", value: "96.8%" },
          ].map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.6 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-[#e5e7eb] shadow-sm"
            >
              <div
                className="text-[32px] leading-[40px] mb-1"
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 600,
                  color: color
                }}
              >
                {metric.value}
              </div>
              <div className="text-[#4a5565] text-[14px] leading-[20px]">{metric.label}</div>
            </motion.div>
          ))}
        </div>

        {/* OEE Total */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1, duration: 0.7 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-2 shadow-lg"
          style={{ borderColor: `${color}30` }}
        >
          <div className="text-[#4a5565] text-[16px] leading-[24px] mb-2">Overall OEE</div>
          <div
            className="text-[56px] leading-[68px]"
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 700,
              color: color
            }}
          >
            84.3%
          </div>
          <div className="flex items-center gap-2 mt-3">
            <div className="text-[#27ae60] text-[20px] leading-[32px]">↑ 12.4%</div>
            <div className="text-[#4a5565] text-[16px] leading-[24px]">vs last month</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function PredictiveVisual({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-12">
      <div className="w-full max-w-[500px]">
        {/* Alert Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-2 shadow-lg"
          style={{ borderColor: `${color}50` }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className="size-[48px] rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${color}20` }}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke={color}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-[#1a3c8c] text-[20px] leading-[32px] mb-1" style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 600 }}>
                  Bearing Anomaly Detected
                </div>
                <div className="text-[#4a5565] text-[16px] leading-[24px]">Machine #A-402 • Line 3</div>
              </div>
            </div>
            <div
              className="px-3 py-1 rounded-full text-[14px] leading-[20px]"
              style={{ backgroundColor: `${color}20`, color: color }}
            >
              High Priority
            </div>
          </div>

          {/* Prediction Details */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-['Open_Sans'] text-[#4a5565] text-[16px] leading-[24px]">Failure Probability</span>
              <span className="text-[#1a3c8c] text-[20px] leading-[32px]" style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 600 }}>
                87%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-['Open_Sans'] text-[#4a5565] text-[16px] leading-[24px]">Estimated Time to Failure</span>
              <span className="text-[#1a3c8c] text-[20px] leading-[32px]" style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 600 }}>
                4-6 days
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-['Open_Sans'] text-[#4a5565] text-[16px] leading-[24px]">Recommended Action</span>
              <span className="text-[#1a3c8c] text-[20px] leading-[32px]" style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 600 }}>
                Replace Bearing
              </span>
            </div>
          </div>

          {/* Action Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-6 py-3 rounded-xl text-white"
            style={{ backgroundColor: color }}
          >
            Schedule Maintenance
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}