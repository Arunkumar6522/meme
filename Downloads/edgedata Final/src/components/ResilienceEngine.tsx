import { motion, useInView } from "motion/react";
import { Cloud, X, CheckCircle2, Database, Wifi, WifiOff } from "lucide-react";
import { useRef } from "react";

export function ResilienceEngine() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-32 bg-gradient-to-br from-slate-50 via-white to-sky-50 relative overflow-hidden">
      {/* Animated grid background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(3,105,161,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(3,105,161,0.05) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="max-w-[1920px] mx-auto px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.8, type: "spring", stiffness: 150 }}
            className="inline-block mb-6"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-sky-500/30 mx-auto">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          <h2 className="text-gray-900 mb-6">The EdgeData Resilience Engine</h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Traditional cloud-first pipelines fail when connectivity is lost. EdgeData's edge-first architecture keeps your data flowing.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Cloud-First Pipeline - Fails */}
          <motion.div
            initial={{ opacity: 0, x: -60, rotateY: -20 }}
            animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
            transition={{ duration: 1, type: "spring", stiffness: 50 }}
            className="bg-white border-2 border-red-200 rounded-2xl p-8 shadow-xl relative overflow-hidden"
          >
            {/* Error pulse effect */}
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.05, 0.1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 bg-red-500 rounded-2xl"
            />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center"
                >
                  <X className="w-6 h-6 text-red-600" />
                </motion.div>
                <h3 className="text-gray-900">Cloud-First Pipeline</h3>
              </div>

              <div className="space-y-6">
                {/* Machine */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Database className="w-8 h-8 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">Factory Floor</div>
                  </div>
                </motion.div>

                {/* Connection - broken */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.6 }}
                  className="relative pl-8"
                >
                  <svg className="absolute left-7 top-0 h-full w-0.5" viewBox="0 0 2 100" preserveAspectRatio="none">
                    <motion.line
                      initial={{ pathLength: 0 }}
                      animate={isInView ? { pathLength: 1 } : {}}
                      transition={{ duration: 1, delay: 0.6 }}
                      x1="1"
                      y1="0"
                      x2="1"
                      y2="100"
                      stroke="#ef4444"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                  </svg>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
                    className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-200"
                  >
                    <WifiOff className="w-5 h-5" />
                    <span className="text-sm">Connection Lost</span>
                  </motion.div>
                </motion.div>

                {/* Cloud - unreachable */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 0.5, x: 0 } : {}}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Cloud className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-400">Cloud Unreachable</div>
                    <div className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <X className="w-3 h-3" />
                      Data Lost
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* EdgeData Pipeline - Resilient */}
          <motion.div
            initial={{ opacity: 0, x: 60, rotateY: 20 }}
            animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
            transition={{ duration: 1, type: "spring", stiffness: 50 }}
            className="bg-white border-2 border-emerald-200 rounded-2xl p-8 shadow-xl relative overflow-hidden"
          >
            {/* Success glow effect */}
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.05, 0.1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 bg-emerald-500 rounded-2xl"
            />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center"
                >
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </motion.div>
                <h3 className="text-gray-900">EdgeData Pipeline</h3>
              </div>

              <div className="space-y-6">
                {/* Machine */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-16 h-16 bg-sky-100 rounded-xl flex items-center justify-center">
                    <Database className="w-8 h-8 text-sky-700" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-700">Factory Floor</div>
                  </div>
                </motion.div>

                {/* Edge Buffer */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.6 }}
                  className="relative pl-8"
                >
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={isInView ? { scaleY: 1 } : {}}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="absolute left-7 top-0 h-full w-0.5 bg-gradient-to-b from-sky-500 to-emerald-500 origin-top"
                  />
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={isInView ? { scale: 1, rotate: 0 } : {}}
                    transition={{ delay: 0.9, type: "spring", stiffness: 150 }}
                    className="bg-sky-50 border-2 border-sky-200 rounded-xl p-5"
                  >
                    <div className="flex items-center gap-2 text-sky-700 mb-2">
                      <Database className="w-5 h-5" />
                      <span className="text-sm">Edge Buffer Active</span>
                    </div>
                    <div className="text-xs text-gray-600">Storing data locally until sync...</div>
                    
                    {/* Progress bar */}
                    <div className="mt-3 h-1.5 bg-sky-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={isInView ? { width: "75%" } : {}}
                        transition={{ delay: 1.2, duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-sky-500"
                      />
                    </div>
                  </motion.div>
                </motion.div>

                {/* Cloud - sync when ready */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Cloud className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-700">Cloud Sync</div>
                    <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Wifi className="w-3 h-3" />
                      </motion.div>
                      Autonomous + Buffered
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Shield({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}