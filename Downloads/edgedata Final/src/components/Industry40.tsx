import { motion, useInView } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";

export function Industry40() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-32 bg-gradient-to-br from-sky-900 via-sky-800 to-slate-900 text-white relative overflow-hidden">
      {/* Background pattern with parallax */}
      <motion.div
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%']
        }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%), 
                           radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
          backgroundSize: '100% 100%'
        }}
      />

      {/* Animated particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-sky-300 rounded-full"
          initial={{
            x: Math.random() * 1920,
            y: Math.random() * 600,
            opacity: 0
          }}
          animate={{
            y: [null, Math.random() * 600],
            opacity: [0, 0.6, 0]
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut"
          }}
        />
      ))}

      <div className="max-w-[1920px] mx-auto px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, type: "spring", stiffness: 50 }}
          className="max-w-4xl mx-auto text-center space-y-10"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.8, type: "spring", stiffness: 150 }}
          >
            <h2 className="text-white">Accelerate Your Industry 5.0 Journey</h2>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-sky-100 text-xl max-w-3xl mx-auto leading-relaxed"
          >
            EdgeData delivers clean, contextualized, and continuous data streams from the factory floor. 
            Transform raw machine signals into actionable insights that drive digital transformation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
          >
            <motion.button
              whileHover={{ scale: 1.08, boxShadow: "0 20px 60px rgba(255,255,255,0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-white text-sky-900 rounded-xl hover:bg-sky-50 transition-all shadow-2xl flex items-center justify-center gap-3 group"
            >
              <span>Learn How We Simplify I4.0</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </motion.button>
          </motion.div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-4 justify-center pt-12">
            {["Real-time OEE", "Predictive Analytics", "Digital Twin Ready", "Unified Namespace"].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: 0.9 + i * 0.1,
                  type: "spring",
                  stiffness: 200
                }}
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
                className="px-6 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-full text-sm hover:border-white/50 transition-colors cursor-pointer"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom wave decoration */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 0.1, y: 0 } : {}}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-0 left-0 right-0 h-32"
      >
        <svg className="w-full h-full" viewBox="0 0 1920 128" preserveAspectRatio="none">
          <motion.path
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 2, delay: 1 }}
            d="M0,64 Q480,0 960,64 T1920,64 L1920,128 L0,128 Z"
            fill="white"
          />
        </svg>
      </motion.div>
    </section>
  );
}