import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useState } from "react";
import { DemoRequestModal } from "./DemoRequestModal";

export function CTABlockNew() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section ref={ref} className="relative bg-white py-12 md:py-20">
        <div className="max-w-[1920px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
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
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-white text-[36px] md:text-[60px] lg:text-[80px] leading-[44px] md:leading-[72px] lg:leading-[96px] mb-6 md:mb-8"
                style={{ 
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 700
                }}
              >
                Ready to eliminate data gaps?
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="font-['Open_Sans'] text-white text-[16px] md:text-[20px] lg:text-[24px] leading-[25.6px] md:leading-[32px] lg:leading-[38.4px] opacity-90 max-w-[1100px] mb-8 md:mb-12"
              >
                Request a personalized demo and accelerate your digital transformation.
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
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

      <DemoRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}