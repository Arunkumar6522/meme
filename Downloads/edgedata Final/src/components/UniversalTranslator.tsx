import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Database, RefreshCw, Zap, Server, Wifi, Code } from "lucide-react";
import capabilitiesImage from "figma:asset/b9a38fa9dea86b9d4ded363d587c7d125c9add27.png";

const capabilities = [
  {
    icon: Server,
    title: "Edge Runtime + Cloud Control Plane",
    description: "Run on edge devices on-prem or in customer cloud. Manage fleets centrally.",
    color: "#43ABFF",
  },
  {
    icon: RefreshCw,
    title: "Bi-directional Metadata Sync",
    description: "Update pipelines/models from the cloud console or directly at the edge.",
    color: "#43ABFF",
  },
  {
    icon: Zap,
    title: "100+ Connectors",
    description: "MQTT, Modbus, REST, Kafka, relational, time-series, document DBs, cloud storage, files.",
    color: "#43ABFF",
  },
  {
    icon: Code,
    title: "No-code / Low-code Pipelines",
    description: "Connect → transform → load with reusable sub-pipelines.",
    color: "#43ABFF",
  },
  {
    icon: Database,
    title: "Unified Data Model",
    description: "Map raw signals into a standard model/instance structure for consistent quality.",
    color: "#43ABFF",
  },
  {
    icon: Wifi,
    title: "Dynamic REST APIs + MQTT",
    description: "Publish curated endpoints and receive device messages via built-in MQTT.",
    color: "#43ABFF",
  },
];

export function UniversalTranslator({ textColor, paragraphColor }: { textColor?: any; paragraphColor?: any }) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden bg-white">
      <div ref={containerRef} className="max-w-[1920px] mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.h2
            className="text-[#1a3c8c] text-4xl md:text-6xl lg:text-[80px] leading-tight md:leading-tight lg:leading-[96px] mb-4 md:mb-6 px-4"
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 700,
            }}
          >
            Connect everything. Unify it. Serve it anywhere.
          </motion.h2>
          <motion.p
            className="font-['Open_Sans'] text-[#4a5565] text-base md:text-xl lg:text-[24px] leading-relaxed md:leading-[38.4px] max-w-[1000px] mx-auto px-4"
          >
            EdgeData360 acts as a universal translator — ingesting fragmented industrial protocols (OT) and enterprise systems (IT), standardizing data, and delivering curated endpoints your teams can trust.
          </motion.p>
        </motion.div>

        {/* Capabilities Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1400px] mx-auto"
        >
          {capabilities.map((capability, index) => (
            <CapabilityCard key={index} {...capability} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CapabilityCard({
  icon: Icon,
  title,
  description,
  color,
  index,
}: {
  icon: any;
  title: string;
  description: string;
  color: string;
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-[#43ABFF]/30 hover:shadow-xl transition-all group"
    >
      {/* Icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
        className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-all group-hover:scale-110"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="w-8 h-8" style={{ color: color }} />
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
        className="text-[#1a3c8c] text-[20px] leading-[28px] mb-3"
        style={{
          fontFamily: "DM Sans, sans-serif",
          fontWeight: 600,
        }}
      >
        {title}
      </motion.h3>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.8 } : {}}
        transition={{ duration: 0.6, delay: index * 0.1 + 0.4 }}
        className="font-['Open_Sans'] text-[#4a5565] text-[16px] leading-[24px]"
      >
        {description}
      </motion.p>
    </motion.div>
  );
}