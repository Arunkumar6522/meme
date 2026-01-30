import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import Neo4jLogo from "../imports/Frame1618875055";
import DellLogo from "../imports/Group2";
import SoCalGasLogo from "../imports/SoCalGasLogo";
import GrokLearningLogo from "../imports/GrokLearningLogo";

const companies = [
  { name: "Neo4j", Component: Neo4jLogo },
  { name: "Dell", Component: DellLogo },
  { name: "SoCalGas", Component: SoCalGasLogo },
  { name: "Grok Learning", Component: GrokLearningLogo },
];

export function SocialProofNew({ textColor, paragraphColor }: { textColor?: any; paragraphColor?: any }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16 lg:mb-20"
        >
          <h2
            className="text-[#1a3c8c] text-[40px] md:text-[60px] lg:text-[80px] leading-[48px] md:leading-[72px] lg:leading-[96px] mb-6 md:mb-8 px-4"
            style={{ 
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 700
            }}
          >
            Trusted by Manufacturing Innovators
          </h2>
          <p className="font-['Open_Sans'] text-[#4a5565] text-[16px] md:text-[20px] lg:text-[24px] leading-[25.6px] md:leading-[32px] lg:leading-[38.4px] px-4">
            Powering the next generation of connected factories.
          </p>
        </motion.div>

        {/* Logo Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative overflow-hidden"
        >
          <motion.div
            className="flex gap-[80px] md:gap-[120px] items-center justify-start"
            animate={{
              x: [0, -((200 + 80) * 4)],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
          >
            {/* Repeat the 4 logos multiple times for seamless loop */}
            {[...Array(12)].map((_, arrayIndex) => (
              companies.map((company, companyIndex) => (
                <motion.div
                  key={`${arrayIndex}-${companyIndex}`}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="relative transition-all duration-300 cursor-pointer w-[180px] md:w-[200px] h-[80px] md:h-[90px] flex-shrink-0 flex items-center justify-center"
                >
                  <div 
                    className="w-full h-full"
                    style={{
                      maxWidth: company.name === "SoCalGas" ? "160px" : company.name === "Grok Learning" ? "180px" : "100%",
                      maxHeight: company.name === "SoCalGas" || company.name === "Grok Learning" ? "60px" : "100%"
                    }}
                  >
                    <company.Component />
                  </div>
                </motion.div>
              ))
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}