import { motion, useInView } from "motion/react";
import { useRef } from "react";
import Neo4jLogo from "../imports/Frame1618875055";
import DellLogo from "../imports/Dell2LogoSvgrepoCom";
import AmazonPayLogo from "../imports/AmazonPaySvgrepoCom";

const companies = [
  { name: "Neo4j", Component: Neo4jLogo },
  { name: "Dell", Component: DellLogo },
  { name: "Amazon Pay", Component: AmazonPayLogo },
];

export function SocialProof() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <section ref={ref} className="py-12 md:py-16 lg:py-24 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
      {/* Animated background */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[600px] lg:w-[800px] h-[400px] md:h-[600px] lg:h-[800px] bg-gradient-to-r from-sky-200/20 to-blue-200/20 rounded-full blur-3xl"
      />

      <div className="max-w-[1920px] mx-auto px-4 md:px-8 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 md:mb-12 lg:mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.6, type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-block mb-4"
          >
            <span className="px-3 md:px-4 py-1.5 md:py-2 bg-sky-100 text-sky-700 rounded-full text-xs md:text-sm">Trusted Worldwide</span>
          </motion.div>
          <h3 className="text-gray-900 mb-3 text-[28px] md:text-[36px] lg:text-[48px] leading-[36px] md:leading-[44px] lg:leading-[56px] px-4" style={{ fontFamily: "PT Sans, sans-serif", fontWeight: 700 }}>Trusted by Innovators</h3>
          <p className="text-gray-600 text-sm md:text-base lg:text-lg px-4" style={{ fontFamily: "Open Sans, sans-serif" }}>Powering the next generation of connected manufacturing leaders.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-16 lg:gap-20 max-w-5xl mx-auto"
        >
          {companies.map((company, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.5 + index * 0.1,
                type: "spring",
                stiffness: 150
              }}
              whileHover={{ scale: 1.15, y: -8 }}
              className="relative grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer w-[160px] h-[60px]"
            >
              <company.Component />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}