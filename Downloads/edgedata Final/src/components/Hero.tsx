import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useRef } from "react";
import VectorNew from "../imports/Vector-6026-9";

export function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-sky-50">
      {/* Animated background mesh with parallax */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(3,105,161,0.15),transparent_50%),radial-gradient(circle_at_70%_50%,rgba(14,165,233,0.1),transparent_50%)]"
      />

      {/* Floating orbs */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-20 w-72 h-72 bg-sky-400/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          y: [0, 40, 0],
          x: [0, -30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"
      />

      <motion.div style={{ opacity }} className="max-w-[1920px] mx-auto px-12 py-24 grid lg:grid-cols-2 gap-16 items-center relative z-10 w-full">
        {/* Left content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h1 className="text-gray-900 mb-6">
              The Resilient Platform for Manufacturing Data at the Edge
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-gray-600 max-w-xl text-xl leading-relaxed"
          >
            Securely connect, process, and synchronize industrial data from the factory floor to the cloud, even during outages.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(3,105,161,0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-sky-700 text-white rounded-xl hover:bg-sky-800 transition-all flex items-center gap-3 group shadow-xl"
            >
              <span className="text-lg">Request Demo</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>

          {/* Quick features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-wrap gap-6 pt-4"
          >
            {["Zero Data Loss", "Offline-First", "Manufacturing Native"].map((text, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + i * 0.1 }}
                className="flex items-center gap-2 text-gray-700"
              >
                <CheckCircle2 className="w-5 h-5 text-sky-700" />
                <span>{text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right - Data Flow Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative"
        >
          <DataFlowVisualization />
        </motion.div>
      </motion.div>
    </section>
  );
}

// New data flow visualization component
function DataFlowVisualization() {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-700"
    >
      {/* Central Hub */}
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8, type: "spring" }}
          className="w-32 h-32 mx-auto bg-gradient-to-br from-[#43ABFF] to-[#0369A1] rounded-2xl flex items-center justify-center shadow-2xl shadow-[#43ABFF]/50 relative"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 border-2 border-white/20 rounded-xl"
          />
          <span className="text-white text-xl font-bold relative z-10">EDGE</span>
        </motion.div>

        {/* Pulsing rings */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 1 }}
            animate={{ 
              opacity: [0, 0.5, 0],
              scale: [1, 2, 2.5]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 1,
              ease: "easeOut"
            }}
            className="absolute inset-0 border-2 border-[#43ABFF] rounded-2xl"
            style={{
              top: '50%',
              left: '50%',
              width: '128px',
              height: '128px',
              marginLeft: '-64px',
              marginTop: '-64px'
            }}
          />
        ))}
      </div>

      {/* Connection nodes around the hub */}
      <div className="mt-12 grid grid-cols-3 gap-4">
        {['OPC UA', 'Modbus', 'MQTT', 'REST', 'SQL', 'Cloud'].map((protocol, i) => (
          <motion.div
            key={protocol}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 + i * 0.1 }}
            className="bg-slate-800 border border-sky-600/50 rounded-lg p-3 text-center hover:border-sky-400 transition-colors"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              className="text-sky-400 text-sm font-medium"
            >
              {protocol}
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Floating status badge */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.7, type: "spring", stiffness: 200 }}
        className="absolute -top-4 -right-4 bg-emerald-500 text-white px-5 py-3 rounded-full shadow-xl text-sm flex items-center gap-2"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 bg-white rounded-full"
        />
        Live Data Flow
      </motion.div>

      {/* Connection count badge */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.9 }}
        className="absolute -bottom-4 -left-4 bg-sky-600 text-white px-5 py-3 rounded-full shadow-xl text-sm"
      >
        15 Active Connections
      </motion.div>
    </motion.div>
  );
}