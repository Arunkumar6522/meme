import { motion, useScroll, useTransform } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const industries = [
  {
    tag: "Industry 01",
    title: "Manufacturing",
    description: "OEE insights, downtime drivers, predictive maintenance, unified telemetry.",
    color: "#43ABFF",
  },
  {
    tag: "Industry 02",
    title: "Retail",
    description: "Inventory signals, operational dashboards, demand & supply visibility.",
    color: "#FF6B35",
  },
  {
    tag: "Industry 03",
    title: "Healthcare",
    description: "Near real-time reporting with governance, auditing, and controlled access.",
    color: "#27AE60",
  },
  {
    tag: "Industry 04",
    title: "Finance",
    description: "Governed data access for analytics and AI workflows with audit trails.",
    color: "#7B4AE2",
  },
];

export function UseCasesNew({ textColor, paragraphColor }: { textColor: any; paragraphColor: any }) {
  const containerRef = useRef(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-150px" });

  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ["start end", "end start"],
  });

  return (
    <motion.section
      ref={scrollContainerRef}
      className="relative py-32 overflow-hidden"
      style={{ minHeight: "200vh" }}
    >
      <div ref={containerRef} className="max-w-[1920px] mx-auto px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-24"
        >
          <motion.h2
            className="text-[80px] leading-[96px] mb-6"
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 700,
              color: textColor
            }}
          >
            Built for real business outcomes
          </motion.h2>
          <motion.p
            className="font-['Open_Sans'] text-[24px] leading-[38.4px] opacity-80 max-w-[900px] mx-auto"
            style={{ color: paragraphColor }}
          >
            A unified data fabric that powers real-time reporting, analytics, and AI.
          </motion.p>
        </motion.div>

        {/* Use Case Cards */}
        <div className="space-y-20 max-w-[1400px] mx-auto">
          {industries.map((useCase, index) => (
            <IndustryCard key={index} {...useCase} index={index} scrollProgress={scrollYProgress} textColor={textColor} paragraphColor={paragraphColor} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function IndustryCard({
  tag,
  title,
  description,
  color,
  index,
  scrollProgress,
  textColor,
  paragraphColor,
}: {
  tag: string;
  title: string;
  description: string;
  color: string;
  index: number;
  scrollProgress: any;
  textColor: any;
  paragraphColor: any;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.9,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Text Content */}
        <div className={`${index % 2 === 1 ? "lg:order-2" : ""}`}>
          {/* Tag with line */}
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={isInView ? { width: 50, opacity: 0.4 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 + 0.2 }}
              className="h-[2px]"
              style={{ backgroundColor: color }}
            />
            <motion.span
              initial={{ opacity: 0.4, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 + 0.3 }}
              className="font-['Open_Sans'] text-[16px] leading-[24px] tracking-[0.1em] uppercase"
              style={{ color: color }}
            >
              {tag}
            </motion.span>
          </div>

          {/* Title */}
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.7,
              delay: index * 0.15 + 0.4,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="text-[56px] leading-[68px] mb-6"
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 700,
              color: textColor
            }}
          >
            {title}
          </motion.h3>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{
              duration: 0.8,
              delay: index * 0.15 + 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="font-['Open_Sans'] text-[20px] leading-[32px] opacity-80 mb-8"
            style={{ color: paragraphColor }}
          >
            {description}
          </motion.p>

          {/* Indicator Dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: index * 0.15 + 0.7 }}
            className="flex gap-2"
          >
            {[0, 1, 2, 3].map((dotIndex) => (
              <motion.div
                key={dotIndex}
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: dotIndex === index ? 1 : 0.3, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: index * 0.15 + 0.75 + dotIndex * 0.05 }}
                className="size-[8px] rounded-full"
                style={{
                  backgroundColor: dotIndex === index ? color : "#6b7280",
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Image Placeholder */}
        <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
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
            <div className="aspect-[16/10] relative flex items-center justify-center">
              <ImageWithFallback
                src={
                  index === 0 ? 'https://images.unsplash.com/photo-1768796372362-05c256e61d8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' : // Manufacturing
                  index === 1 ? 'https://images.unsplash.com/photo-1761795084688-bb007bc51697?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' : // Retail
                  index === 2 ? 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=500&fit=crop' : // Healthcare
                  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=500&fit=crop' // Finance
                }
                alt={title}
                className="w-full h-full object-cover"
              />
              {/* Overlay gradient */}
              <div 
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${color}20 0%, transparent 100%)`,
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}