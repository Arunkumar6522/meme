import { motion, useInView } from "motion/react";
import { Shield, Cpu, Globe } from "lucide-react";
import { useRef } from "react";

const features = [
  {
    icon: Shield,
    title: "Edge-Native Deployment",
    description: "EdgeData runs at the edge, delivering lower latency, reduced bandwidth costs, improved data privacy, and continued operation even with intermittent cloud connectivity.",
  },
  {
    icon: Cpu,
    title: "OT & IT Interoperability",
    description: "Seamlessly bridges operational technology (shop floor systems, PLCs, sensors) and information technology (cloud, databases, APIs) without complex middleware or custom coding.",
  },
  {
    icon: Globe,
    title: "Industrial Data Modeling",
    description: "Transforms raw industrial data into structured, contextualized information. Connects machines, sensors, and enterprise systems with built-in edge intelligence for faster, secure decisions.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.8
    }
  }
};

export function WhyEdgeData() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-12 md:py-20 lg:py-32 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-sky-100 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-blue-100 rounded-full blur-3xl opacity-30" />

      <div className="max-w-[1920px] mx-auto px-4 md:px-8 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16 lg:mb-20"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
            className="inline-block mb-4"
          >
            <span className="px-3 md:px-4 py-1.5 md:py-2 bg-sky-100 text-sky-700 rounded-full text-xs md:text-sm">Why Choose Us</span>
          </motion.div>
          <h2 className="text-gray-900 mb-4 md:mb-6 text-[32px] md:text-[48px] lg:text-[60px] leading-[40px] md:leading-[56px] lg:leading-[72px] px-4" style={{ fontFamily: "PT Sans, sans-serif", fontWeight: 700 }}>Why EdgeData?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg lg:text-xl px-4" style={{ fontFamily: "Open Sans, sans-serif" }}>
            Built from the ground up for the demanding requirements of modern manufacturing
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -12, 
                scale: 1.02,
                transition: { type: "spring", stiffness: 400, damping: 10 } 
              }}
              className="group bg-gradient-to-br from-slate-50 via-white to-sky-50/30 border border-gray-200 rounded-2xl p-8 hover:shadow-2xl transition-all relative overflow-hidden"
            >
              {/* Hover gradient effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="w-16 h-16 bg-gradient-to-br from-sky-500 to-sky-700 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-sky-500/30 relative z-10"
              >
                <feature.icon className="w-8 h-8 text-white" />
              </motion.div>
              
              <h3 className="text-gray-900 mb-4 relative z-10" style={{ fontFamily: "PT Sans, sans-serif", fontWeight: 700 }}>{feature.title}</h3>
              <p className="text-gray-600 relative z-10" style={{ fontFamily: "Open Sans, sans-serif" }}>{feature.description}</p>

              {/* Animated corner accent */}
              <motion.div
                initial={{ width: 0, height: 0 }}
                whileHover={{ width: 60, height: 60 }}
                transition={{ duration: 0.3 }}
                className="absolute top-0 right-0 bg-sky-500/10 rounded-bl-full"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}