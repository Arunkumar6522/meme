import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Check, X, Shield } from "lucide-react";

export function ResilienceEngineNew({ textColor, paragraphColor }: { textColor?: any; paragraphColor?: any }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-16 md:py-32 overflow-hidden bg-white">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-[#1a3c8c] text-[36px] md:text-[60px] lg:text-[80px] leading-[44px] md:leading-[72px] lg:leading-[96px] mb-6 md:mb-8 px-4"
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 700
            }}
          >
            The EdgeData Resilience Engine
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-['Open_Sans'] text-[#4a5565] text-[18px] md:text-[22px] lg:text-[26px] leading-[30px] md:leading-[36px] lg:leading-[42px] max-w-[1100px] mx-auto px-4"
          >
            Unlike cloud-first pipelines that <span className="text-[#ef4444] font-semibold">fail</span> when connectivity drops, EdgeData's autonomous architecture keeps your data <span className="text-[#10b981] font-semibold">flowing</span>.
          </motion.p>
        </div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 max-w-[1600px] mx-auto">
          
          {/* Cloud-First Pipeline Card - Left (Smaller) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="relative bg-white rounded-[20px] md:rounded-[24px] p-6 md:p-8 lg:p-10 shadow-[0px_8px_24px_rgba(0,0,0,0.08)] border border-gray-100 lg:col-span-5"
          >
            {/* Content */}
            <div className="relative z-10">
              <h3 
                className="text-gray-900 text-[24px] md:text-[30px] lg:text-[34px] leading-[32px] md:leading-[38px] lg:leading-[42px] mb-2" 
                style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 700 }}
              >
                Cloud-First Pipeline
              </h3>
              
              <p 
                className="font-['Open_Sans'] text-gray-500 text-[13px] md:text-[14px] leading-[20px] md:leading-[22px] mb-8 md:mb-10"
              >
                Vulnerable to failure
              </p>

              <div className="space-y-3 md:space-y-4 mb-8 md:mb-10">
                {[
                  "Cloud dependent",
                  "Data loss during outages",
                  "No local recovery",
                  "Operations halt"
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex-shrink-0">
                      <X className="w-4 h-4 md:w-5 md:h-5 text-gray-900" strokeWidth={2.5} />
                    </div>
                    <p className="font-['Open_Sans'] text-gray-900 text-[14px] md:text-[15px] lg:text-[16px] leading-[22px] md:leading-[24px]">
                      {feature}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* EdgeData Pipeline Card - Right (Larger) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative bg-[#43ABFF] rounded-[20px] md:rounded-[24px] p-8 md:p-10 lg:p-12 shadow-[0px_8px_24px_rgba(67,171,255,0.3)] lg:col-span-7"
          >
            {/* Recommended Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute right-6 md:right-8 top-6 md:top-8 z-10"
            >
              <div className="bg-[#1a3c8c] rounded-full px-4 md:px-5 py-2 md:py-2.5">
                <span className="font-['Open_Sans'] text-white text-[10px] md:text-[11px] font-bold tracking-[0.08em] uppercase">
                  RECOMMENDED
                </span>
              </div>
            </motion.div>

            {/* Content */}
            <div className="relative z-10">
              <h3 
                className="text-white text-[28px] md:text-[36px] lg:text-[40px] leading-[36px] md:leading-[44px] lg:leading-[48px] mb-2" 
                style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 700 }}
              >
                EdgeData Pipeline
              </h3>
              
              <p 
                className="font-['Open_Sans'] text-white/70 text-[14px] md:text-[15px] leading-[22px] md:leading-[24px] mb-10 md:mb-12"
              >
                Edge-first reliability
              </p>

              <div className="space-y-4 md:space-y-5 mb-10 md:mb-12">
                {[
                  "Autonomous edge operation",
                  "Automatic store-and-forward",
                  "Intelligent local buffering",
                  "Continuous execution"
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex-shrink-0">
                      <Check className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </div>
                    <p className="font-['Open_Sans'] text-white text-[15px] md:text-[16px] lg:text-[17px] leading-[24px] md:leading-[26px]">
                      {feature}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 1 }}
          className="text-center mt-12 md:mt-16"
        >
          <p className="font-['Open_Sans'] text-[#4a5565] text-[16px] md:text-[18px] leading-[26px] md:leading-[30px] max-w-[800px] mx-auto">
            EdgeData's resilience engine is purpose-built for industrial environments where connectivity is never guaranteed.
          </p>
        </motion.div>
      </div>
    </section>
  );
}