import { motion, useScroll, useTransform } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import svgPaths from "../imports/svg-u0nuqlwh39";
import { ArrowRight } from "lucide-react";
import industryImage from "figma:asset/41d6493bd494c3853e99dab242a4c2a66bf71b63.png";

function IconAi() {
  return (
    <div className="relative shrink-0 size-[26.667px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27 27">
        <g>
          <path d={svgPaths.p31458d00} fill="#43ABFF" />
        </g>
      </svg>
    </div>
  );
}

function Badge() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="bg-white box-border content-stretch flex gap-[10.667px] items-center px-[12px] py-[8px] rounded-[20px] border border-[#b6bccd] shadow-[0px_0px_1.333px_0px_rgba(44,58,114,0.05),0px_2.667px_8px_0px_rgba(44,58,114,0.05),0px_13.333px_24px_0px_rgba(58,76,146,0.1)]"
    >
      <IconAi />
      <p className="font-['Arial'] leading-[38.919px] text-[#4b5162] text-[25.946px] text-center whitespace-nowrap">
        Use Cases
      </p>
    </motion.div>
  );
}

function DatabaseIcon() {
  return (
    <div className="relative shrink-0 size-[103.784px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 104 104">
        <g>
          <path
            d={svgPaths.p9a4bc00}
            stroke="#43ABFF"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="8.64865"
          />
          <path
            d={svgPaths.p2cba3c40}
            stroke="#43ABFF"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="8.64865"
          />
          <path
            d={svgPaths.p3d812fe6}
            stroke="#43ABFF"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="8.64865"
          />
        </g>
      </svg>
    </div>
  );
}

export function Industry40New({ textColor, paragraphColor }: { textColor: any; paragraphColor: any }) {
  const ref = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const badgeScale = useTransform(scrollYProgress, [0.2, 0.5], [1, 1.1]);
  const badgeRotate = useTransform(scrollYProgress, [0.2, 0.5], [0, 5]);

  const iconScale = useTransform(scrollYProgress, [0.3, 0.6], [1, 1.15]);
  const iconRotate = useTransform(scrollYProgress, [0.3, 0.6], [0, 5]);

  return (
    <motion.section
      ref={containerRef}
      className="relative py-16 md:py-32 overflow-hidden"
      style={{ minHeight: "100vh" }}
    >
      <div ref={ref} className="max-w-[1920px] mx-auto px-6 md:px-12">
        {/* Badge */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h2
              className="text-[36px] md:text-[60px] lg:text-[80px] leading-[44px] md:leading-[72px] lg:leading-[96px] mb-6 md:mb-8"
              style={{ 
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 700,
                color: textColor
              }}
            >
              Enabling Industry 5.0 Without the Complexity
            </motion.h2>
            
            <motion.p
              className="font-['Open_Sans'] text-[24px] leading-[38.4px] max-w-[650px]"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
              style={{ color: paragraphColor }}
            >
              Industry 5.0 initiatives require continuous, contextualized, and reliable data. EdgeData provides the foundation to scale digital manufacturing with confidence.
            </motion.p>

            {/* Checklist */}
            <div className="space-y-4 md:space-y-6 mb-8 md:mb-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex items-center gap-3 md:gap-5"
              >
                <div className="bg-[#43ABFF] rounded-full size-[28px] md:size-[36px] flex items-center justify-center flex-shrink-0">
                  <p className="font-['Open_Sans'] text-white text-[16px] md:text-[20px] leading-[24px] md:leading-[32px]">✓</p>
                </div>
                <motion.p
                  className="font-['Open_Sans'] text-[18px] md:text-[22px] lg:text-[24px] leading-[28px] md:leading-[33px] lg:leading-[36px]"
                  style={{ color: paragraphColor }}
                >
                  Real-time data normalization and contextualization
                </motion.p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex items-center gap-3 md:gap-5"
              >
                <div className="bg-[#43ABFF] rounded-full size-[28px] md:size-[36px] flex items-center justify-center flex-shrink-0">
                  <p className="font-['Open_Sans'] text-white text-[16px] md:text-[20px] leading-[24px] md:leading-[32px]">✓</p>
                </div>
                <motion.p
                  className="font-['Open_Sans'] text-[18px] md:text-[22px] lg:text-[24px] leading-[28px] md:leading-[33px] lg:leading-[36px]"
                  style={{ color: paragraphColor }}
                >
                  Guaranteed data delivery for AI/ML pipelines
                </motion.p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex items-center gap-3 md:gap-5"
              >
                <div className="bg-[#43ABFF] rounded-full size-[28px] md:size-[36px] flex items-center justify-center flex-shrink-0">
                  <p className="font-['Open_Sans'] text-white text-[16px] md:text-[20px] leading-[24px] md:leading-[32px]">✓</p>
                </div>
                <motion.p
                  className="font-['Open_Sans'] text-[18px] md:text-[22px] lg:text-[24px] leading-[28px] md:leading-[33px] lg:leading-[36px]"
                  style={{ color: paragraphColor }}
                >
                  Reliable edge-to-cloud synchronization
                </motion.p>
              </motion.div>
            </div>

            {/* Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#43ABFF] text-white rounded-full px-6 md:px-[48px] py-3 md:py-[20px] shadow-[0px_16.216px_24.324px_-4.865px_rgba(0,0,0,0.1),0px_6.486px_9.73px_-6.486px_rgba(0,0,0,0.1)] flex items-center gap-2 md:gap-3 group"
              onClick={() => {
                // Scroll to use cases section or show more info
                const useCasesSection = document.getElementById('use-cases');
                if (useCasesSection) {
                  useCasesSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <p className="font-['Open_Sans'] text-[16px] md:text-[20px] leading-[24px] md:leading-[32px] whitespace-nowrap">
                Learn How We Simplify I4.0
              </p>
              <motion.div
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.3 }}
              >
                <ArrowRight className="size-5 md:size-6" />
              </motion.div>
            </motion.button>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col items-center justify-center mt-8 lg:mt-0"
          >
            {/* Dashboard Image */}
            <motion.div 
              style={{ scale: iconScale }}
              className="w-full max-w-[700px] rounded-[16px] md:rounded-[24px] overflow-hidden shadow-[0px_20px_60px_rgba(0,0,0,0.3)] border-2 border-[rgba(67,171,255,0.3)]"
            >
              <img 
                src={industryImage} 
                alt="Modern Industrial Factory Floor" 
                className="w-full h-auto"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}