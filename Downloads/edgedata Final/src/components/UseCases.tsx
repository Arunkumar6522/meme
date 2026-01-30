import { motion, useInView } from "motion/react";
import { Factory, ShoppingCart, Heart, DollarSign } from "lucide-react";
import { useRef } from "react";

const useCases = [
  {
    icon: Factory,
    title: "Manufacturing",
    description: "OEE insights, downtime drivers, predictive maintenance, unified telemetry.",
    color: "from-sky-500 to-blue-600",
    bgColor: "bg-sky-500/10"
  },
  {
    icon: ShoppingCart,
    title: "Retail",
    description: "Inventory signals, operational dashboards, demand & supply visibility.",
    color: "from-orange-500 to-red-600",
    bgColor: "bg-orange-500/10"
  },
  {
    icon: Heart,
    title: "Healthcare",
    description: "Near real-time reporting with governance, auditing, and controlled access.",
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-500/10"
  },
  {
    icon: DollarSign,
    title: "Finance",
    description: "Governed data access for analytics and AI workflows with audit trails.",
    color: "from-purple-500 to-indigo-600",
    bgColor: "bg-purple-500/10"
  },
];

export function UseCases() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-12 md:py-20 lg:py-32 bg-white relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-10 w-48 md:w-72 h-48 md:h-72 bg-sky-200 rounded-full blur-3xl opacity-20"
      />
      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 80, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-10 w-64 md:w-96 h-64 md:h-96 bg-purple-200 rounded-full blur-3xl opacity-20"
      />

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
            transition={{ duration: 0.6 }}
            className="inline-block mb-4"
          >
            <span className="px-3 md:px-4 py-1.5 md:py-2 bg-sky-100 text-sky-700 rounded-full text-xs md:text-sm">Real Business Outcomes</span>
          </motion.div>
          <h2 className="text-gray-900 mb-4 md:mb-6 text-[32px] md:text-[48px] lg:text-[60px] leading-[40px] md:leading-[56px] lg:leading-[72px] px-4" style={{ fontFamily: "PT Sans, sans-serif", fontWeight: 700 }}>Built for real business outcomes</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg lg:text-xl px-4" style={{ fontFamily: "Open Sans, sans-serif" }}>
            A unified data fabric that powers real-time reporting, analytics, and AI.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative bg-white border-2 border-gray-200 rounded-2xl p-6 md:p-8 hover:border-transparent hover:shadow-2xl transition-all overflow-hidden"
            >
              {/* Gradient border on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${useCase.color} opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl -z-10`} style={{ padding: '2px' }}>
                <div className="bg-white rounded-2xl h-full" />
              </div>

              {/* Icon */}
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className={`w-14 md:w-16 h-14 md:h-16 bg-gradient-to-br ${useCase.color} rounded-xl flex items-center justify-center mb-5 md:mb-6 shadow-lg relative z-10`}
              >
                <useCase.icon className="w-7 md:w-8 h-7 md:h-8 text-white" />
              </motion.div>

              <h3 className="text-gray-900 mb-3 md:mb-4 relative z-10 text-xl md:text-2xl" style={{ fontFamily: "PT Sans, sans-serif", fontWeight: 700 }}>{useCase.title}</h3>
              <p className="text-gray-600 relative z-10 text-sm md:text-base leading-relaxed" style={{ fontFamily: "Open Sans, sans-serif" }}>{useCase.description}</p>

              {/* Decorative element */}
              <motion.div
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`absolute -bottom-10 -right-10 w-32 h-32 ${useCase.bgColor} rounded-full blur-2xl`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}