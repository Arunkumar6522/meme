import { motion, useInView } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRef } from "react";

export function CTABlock() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <section ref={ref} className="py-12 md:py-20 lg:py-32 bg-gradient-to-br from-sky-700 via-sky-800 to-sky-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
          x: [0, 100, 0],
          y: [0, -50, 0]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 right-0 w-[300px] md:w-[400px] lg:w-[500px] h-[300px] md:h-[400px] lg:h-[500px] bg-sky-500 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.5, 0.2],
          x: [0, -80, 0],
          y: [0, 80, 0]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-0 left-0 w-[350px] md:w-[500px] lg:w-[600px] h-[350px] md:h-[500px] lg:h-[600px] bg-sky-600 rounded-full blur-3xl"
      />

      {/* Animated grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), 
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="max-w-[1920px] mx-auto px-4 md:px-8 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, type: "spring", stiffness: 50 }}
          className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8 lg:space-y-10"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.8, type: "spring", stiffness: 150 }}
            className="flex justify-center"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1, 1.1, 1]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-12 md:w-14 lg:w-16 h-12 md:h-14 lg:h-16 text-sky-200" />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h2 className="text-white mb-4 md:mb-6 text-[32px] md:text-[48px] lg:text-[60px] leading-[40px] md:leading-[56px] lg:leading-[72px] px-4" style={{ fontFamily: "PT Sans, sans-serif", fontWeight: 700 }}>Ready to End Data Gaps?</h2>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-sky-100 text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed px-4"
          >
            See how EdgeData can transform your manufacturing operations with resilient, edge-first data infrastructure.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.7, type: "spring", stiffness: 150 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-6 md:pt-8 px-4"
          >
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  "0 20px 60px rgba(255,255,255,0.2)",
                  "0 25px 80px rgba(255,255,255,0.3)",
                  "0 20px 60px rgba(255,255,255,0.2)",
                ],
              }}
              transition={{
                boxShadow: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              className="px-8 md:px-10 lg:px-12 py-4 md:py-5 lg:py-6 bg-white text-sky-900 rounded-xl transition-all flex items-center justify-center gap-2 md:gap-3 group shadow-2xl"
            >
              <span className="text-base md:text-lg">Request a Personalized Demo</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
              </motion.div>
            </motion.button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-wrap items-center justify-center gap-4 md:gap-6 lg:gap-8 pt-8 md:pt-10 lg:pt-12 text-sky-200 text-xs md:text-sm px-4"
          >
            {["✓ No credit card required", "✓ 30-day trial", "✓ Enterprise support"].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 1.1 + i * 0.1 }}
                className="flex items-center gap-2"
              >
                {item}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}