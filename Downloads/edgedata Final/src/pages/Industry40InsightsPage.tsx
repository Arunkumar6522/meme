import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Globe, TrendingUp, Factory, ArrowLeft, Zap, Shield, Database, Cloud, Cpu, Users, TrendingDown, FileText, Gauge, Network, BarChart3, Workflow } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export function Industry40InsightsPage() {
  const headerRef = useRef(null);
  const overviewRef = useRef(null);
  const statsRef = useRef(null);
  const edgeRef = useRef(null);
  const aiRef = useRef(null);
  const geoRef = useRef(null);
  
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });
  const isOverviewInView = useInView(overviewRef, { once: true, margin: "-100px" });
  const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const isEdgeInView = useInView(edgeRef, { once: true, margin: "-100px" });
  const isAiInView = useInView(aiRef, { once: true, margin: "-100px" });
  const isGeoInView = useInView(geoRef, { once: true, margin: "-100px" });

  const textColor = "rgb(26, 60, 140)";
  const paragraphColor = "#4a5565";

  return (
    <div className="min-h-screen bg-white">
      <Header 
        textColor="rgb(55, 65, 81)" 
        bgColor="rgba(255, 255, 255, 0.9)"
        borderColor="rgba(229, 231, 235, 1)"
      />
      
      <section className="relative py-16 md:py-32 overflow-hidden">
        <div className="max-w-[1920px] mx-auto px-6 md:px-12">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 md:mb-12"
          >
            <Link 
              to="/"
              className="inline-flex items-center gap-2 text-[#43ABFF] hover:text-[#1a8de8] transition-colors font-['Open_Sans'] text-[16px] md:text-[18px] font-semibold"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
          </motion.div>

          {/* Page Header */}
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 30 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 md:mb-24"
          >
            <h1 
              className="text-[36px] md:text-[60px] lg:text-[80px] leading-[44px] md:leading-[72px] lg:leading-[96px] mb-4 md:mb-6"
              style={{ 
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 700,
                color: textColor
              }}
            >
              Industry 4.0 in 2025
            </h1>
            <p 
              className="font-['Open_Sans'] text-[16px] md:text-[20px] lg:text-[24px] leading-[25.6px] md:leading-[32px] lg:leading-[38.4px] max-w-[900px] mx-auto"
              style={{ color: paragraphColor }}
            >
              The complete guide to digital transformation in industrial operations
            </p>
          </motion.div>

          {/* Industry 4.0 Overview */}
          <motion.div
            ref={overviewRef}
            initial={{ opacity: 0, y: 40 }}
            animate={isOverviewInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-16 md:mb-24 max-w-[1400px] mx-auto"
          >
            <div className="bg-gradient-to-br from-[#43ABFF]/5 to-[#43ABFF]/10 rounded-[30px] md:rounded-[40px] p-8 md:p-12 border-2 border-[#43ABFF]/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-[#43ABFF] rounded-full p-4">
                  <Factory className="w-8 h-8 text-white" />
                </div>
                <h2 
                  className="text-[#1a3c8c] text-[28px] md:text-[42px] lg:text-[48px] leading-[36px] md:leading-[50px] lg:leading-[58px]"
                  style={{ 
                    fontFamily: "PT Sans, sans-serif",
                    fontWeight: 700
                  }}
                >
                  What is Industry 4.0 in 2025?
                </h2>
              </div>
              <p className="font-['Open_Sans'] text-[#4a5565] text-[18px] md:text-[20px] lg:text-[22px] leading-[30px] md:leading-[34px] lg:leading-[36px] mb-8">
                Industry 4.0 in 2025 represents the maturity and widespread adoption of advanced digital technologies that are transforming manufacturing and industrial operations globally. Key components of Industry 4.0 include AI and machine learning, IoT-enabled smart factories, 5G connectivity, digital twins, and a strong focus on sustainability.
              </p>
              <div className="bg-white/60 rounded-[24px] p-6 md:p-8 border border-[#43ABFF]/20">
                <p className="font-['Open_Sans'] text-[#1a3c8c] text-[18px] md:text-[20px] lg:text-[22px] leading-[30px] md:leading-[34px] lg:leading-[36px] font-semibold">
                  Industry 4.0 in 2025 is about interconnected, intelligent, and sustainable industrial ecosystems that improve productivity, flexibility, resilience, and environmental responsibility while enabling new business models and smart services.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Key Characteristics Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isOverviewInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16 md:mb-24 max-w-[1400px] mx-auto"
          >
            <h2 
              className="text-[#1a3c8c] text-[32px] md:text-[48px] lg:text-[56px] leading-[40px] md:leading-[56px] lg:leading-[68px] mb-8 md:mb-12 text-center"
              style={{ 
                fontFamily: "PT Sans, sans-serif",
                fontWeight: 700
              }}
            >
              Key Characteristics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {[
                {
                  icon: <Network className="w-8 h-8" />,
                  title: "Smart Factories",
                  desc: "Fully connected and intelligent production systems leveraging AI, IoT, and 5G."
                },
                {
                  icon: <TrendingUp className="w-8 h-8" />,
                  title: "Sustainability & Green Manufacturing",
                  desc: "Use of renewable energy, circular production, and waste reduction driven by automation."
                },
                {
                  icon: <Users className="w-8 h-8" />,
                  title: "Human–Machine Collaboration",
                  desc: "Intelligent systems enhancing, not replacing, human capabilities."
                },
                {
                  icon: <Cloud className="w-8 h-8" />,
                  title: "Remote & Cloud-Based Operations",
                  desc: "Enabling flexibility and 24/7 accessibility for global manufacturing teams."
                },
                {
                  icon: <FileText className="w-8 h-8" />,
                  title: "Data-Driven Innovation",
                  desc: "62,000 patent filings highlight the rapid R&D and innovation pace in Industry 4.0."
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isOverviewInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="bg-white rounded-[24px] p-6 md:p-8 border-2 border-[#43ABFF]/20 hover:border-[#43ABFF] hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-[#43ABFF]/10 rounded-full p-3 text-[#43ABFF] flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-['PT_Sans'] text-[#1a3c8c] text-[20px] md:text-[24px] leading-[28px] md:leading-[32px] font-bold mb-2">
                        {item.title}
                      </h3>
                      <p className="font-['Open_Sans'] text-[#4a5565] text-[16px] md:text-[18px] leading-[26px] md:leading-[30px]">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Market Statistics */}
          <motion.div
            ref={statsRef}
            initial={{ opacity: 0, y: 40 }}
            animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-16 md:mb-24 max-w-[1400px] mx-auto"
          >
            <div className="text-center mb-12">
              <h2 
                className="text-[#1a3c8c] text-[32px] md:text-[48px] lg:text-[56px] leading-[40px] md:leading-[56px] lg:leading-[68px] mb-4"
                style={{ 
                  fontFamily: "PT Sans, sans-serif",
                  fontWeight: 700
                }}
              >
                Market Overview
              </h2>
              <p className="font-['Open_Sans'] text-[#4a5565] text-[18px] md:text-[20px] leading-[28px] md:leading-[32px]">
                Key statistics and growth projections for 2025–2029
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[
                { label: "2025 Market Size", value: "$190.63B", icon: <BarChart3 className="w-6 h-6" /> },
                { label: "2029 Market Size", value: "$412.7B", icon: <TrendingUp className="w-6 h-6" /> },
                { label: "CAGR (2025–2034)", value: "18.60%", icon: <Gauge className="w-6 h-6" /> },
                { label: "Global Workforce", value: "1M+", icon: <Users className="w-6 h-6" /> },
                { label: "New Employees (2024–2025)", value: "94,000+", icon: <Users className="w-6 h-6" /> },
                { label: "Productivity Gains", value: "20–35%", icon: <TrendingUp className="w-6 h-6" /> },
                { label: "Downtime Reduction", value: "Up to 50%", icon: <TrendingDown className="w-6 h-6" /> },
                { label: "Patent Filings", value: "62,000", icon: <FileText className="w-6 h-6" /> }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isStatsInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
                  className="bg-gradient-to-br from-[#43ABFF]/10 to-[#43ABFF]/5 rounded-[20px] md:rounded-[24px] p-6 border border-[#43ABFF]/30 hover:border-[#43ABFF] hover:shadow-lg transition-all text-center"
                >
                  <div className="flex justify-center mb-3">
                    <div className="bg-[#43ABFF] rounded-full p-3 text-white">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="font-['DM_Sans'] text-[#43ABFF] text-[28px] md:text-[36px] leading-[36px] md:leading-[44px] font-bold mb-2">
                    {stat.value}
                  </div>
                  <div className="font-['Open_Sans'] text-[#4a5565] text-[14px] md:text-[16px] leading-[20px] md:leading-[24px]">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Edge Computing Section */}
          <motion.div
            ref={edgeRef}
            initial={{ opacity: 0, y: 40 }}
            animate={isEdgeInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-16 md:mb-24 max-w-[1400px] mx-auto"
          >
            <div className="bg-gradient-to-br from-[#43ABFF]/5 to-[#43ABFF]/10 rounded-[30px] md:rounded-[40px] p-8 md:p-12 border-2 border-[#43ABFF]/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-[#43ABFF] rounded-full p-4">
                  <Cpu className="w-8 h-8 text-white" />
                </div>
                <h2 
                  className="text-[#1a3c8c] text-[28px] md:text-[42px] lg:text-[48px] leading-[36px] md:leading-[50px] lg:leading-[58px]"
                  style={{ 
                    fontFamily: "PT Sans, sans-serif",
                    fontWeight: 700
                  }}
                >
                  Edge Computing in Industrial Applications
                </h2>
              </div>
              <p className="font-['Open_Sans'] text-[#4a5565] text-[18px] md:text-[20px] lg:text-[22px] leading-[30px] md:leading-[34px] lg:leading-[36px] mb-8">
                Edge computing in industrial applications by 2025 is a vital technology that processes data near where it is generated, such as sensors and machines on factory floors, rather than sending it solely to distant cloud servers. This local data processing allows for millisecond-level response times crucial for real-time monitoring, predictive maintenance, autonomous operations, and industrial automation.
              </p>

              {/* Key Features */}
              <div className="mb-8">
                <h3 className="font-['PT_Sans'] text-[#1a3c8c] text-[24px] md:text-[32px] leading-[32px] md:leading-[40px] font-bold mb-6">
                  Key Features and Benefits
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {[
                    {
                      icon: <Zap className="w-6 h-6" />,
                      title: "Real-time Processing",
                      desc: "Edge nodes analyze data immediately, enabling fast anomaly detection, predictive maintenance, and minimizing costly downtime."
                    },
                    {
                      icon: <Network className="w-6 h-6" />,
                      title: "Reduced Bandwidth & Latency",
                      desc: "By processing data locally and only sending relevant insights to the cloud, edge reduces network congestion and delays."
                    },
                    {
                      icon: <Workflow className="w-6 h-6" />,
                      title: "Autonomous Systems",
                      desc: "Industrial robots, guided vehicles, and drones operate with ultra-low latency decisions powered by edge AI."
                    },
                    {
                      icon: <Shield className="w-6 h-6" />,
                      title: "Enhanced Security & Reliability",
                      desc: "Local processing reduces reliance on cloud connections, lowering risks from outages and cyber threats."
                    },
                    {
                      icon: <Database className="w-6 h-6" />,
                      title: "Integration with 5G",
                      desc: "This further boosts speed and connectivity for seamless industrial controls."
                    }
                  ].map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isEdgeInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                      className="bg-white rounded-[20px] p-5 md:p-6 border border-[#43ABFF]/20 hover:border-[#43ABFF] transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="bg-[#43ABFF]/10 rounded-full p-2 text-[#43ABFF] flex-shrink-0">
                          {feature.icon}
                        </div>
                        <div>
                          <h4 className="font-['PT_Sans'] text-[#1a3c8c] text-[18px] md:text-[20px] leading-[24px] md:leading-[28px] font-bold mb-1">
                            {feature.title}
                          </h4>
                          <p className="font-['Open_Sans'] text-[#4a5565] text-[15px] md:text-[16px] leading-[22px] md:leading-[26px]">
                            {feature.desc}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Market Growth */}
              <div className="bg-white/60 rounded-[24px] p-6 md:p-8 border border-[#43ABFF]/30">
                <h3 className="font-['PT_Sans'] text-[#1a3c8c] text-[24px] md:text-[28px] leading-[32px] md:leading-[36px] font-bold mb-4">
                  Market Growth & Trends
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-[#43ABFF] rounded-full size-[24px] flex items-center justify-center flex-shrink-0 mt-1">
                      <p className="font-['Open_Sans'] text-white text-[14px]">✓</p>
                    </div>
                    <p className="font-['Open_Sans'] text-[#4a5565] text-[16px] md:text-[18px] leading-[26px] md:leading-[30px]">
                      The hyperscale edge computing market is projected to grow from <span className="font-bold text-[#1a3c8c]">USD 6 billion in 2025</span> to <span className="font-bold text-[#1a3c8c]">USD 19.49 billion by 2029</span>, with an annual growth rate of over <span className="font-bold text-[#1a3c8c]">34%</span>.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-[#43ABFF] rounded-full size-[24px] flex items-center justify-center flex-shrink-0 mt-1">
                      <p className="font-['Open_Sans'] text-white text-[14px]">✓</p>
                    </div>
                    <p className="font-['Open_Sans'] text-[#4a5565] text-[16px] md:text-[18px] leading-[26px] md:leading-[30px]">
                      Over <span className="font-bold text-[#1a3c8c]">11,300 startups</span> and <span className="font-bold text-[#1a3c8c]">2 million professionals</span> are active in edge technologies, expanding innovation worldwide.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-[#43ABFF] rounded-full size-[24px] flex items-center justify-center flex-shrink-0 mt-1">
                      <p className="font-['Open_Sans'] text-white text-[14px]">✓</p>
                    </div>
                    <p className="font-['Open_Sans'] text-[#4a5565] text-[16px] md:text-[18px] leading-[26px] md:leading-[30px]">
                      Leading hubs include <span className="font-bold text-[#1a3c8c]">USA, India, UK, Canada, and Australia</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* AI and Edge Computing in Smart Factories */}
          <motion.div
            ref={aiRef}
            initial={{ opacity: 0, y: 40 }}
            animate={isAiInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-16 md:mb-24 max-w-[1400px] mx-auto"
          >
            <div className="bg-gradient-to-br from-[#43ABFF]/5 to-[#43ABFF]/10 rounded-[30px] md:rounded-[40px] p-8 md:p-12 border-2 border-[#43ABFF]/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-[#43ABFF] rounded-full p-4">
                  <Cpu className="w-8 h-8 text-white" />
                </div>
                <h2 
                  className="text-[#1a3c8c] text-[28px] md:text-[42px] lg:text-[48px] leading-[36px] md:leading-[50px] lg:leading-[58px]"
                  style={{ 
                    fontFamily: "PT Sans, sans-serif",
                    fontWeight: 700
                  }}
                >
                  AI & Edge Computing in Smart Factories
                </h2>
              </div>
              <p className="font-['Open_Sans'] text-[#4a5565] text-[18px] md:text-[20px] lg:text-[22px] leading-[30px] md:leading-[34px] lg:leading-[36px] mb-8">
                Smart factories in 2025 rely on AI-driven automation and edge computing to achieve real-time intelligence, reduce downtime, and streamline industrial operations.
              </p>

              <div className="space-y-6 md:space-y-8">
                {/* AI in Smart Manufacturing */}
                <div className="bg-white/60 rounded-[24px] p-6 md:p-8 border border-[#43ABFF]/20">
                  <h3 className="font-['PT_Sans'] text-[#1a3c8c] text-[22px] md:text-[28px] leading-[30px] md:leading-[36px] font-bold mb-4">
                    AI in Smart Manufacturing
                  </h3>
                  <p className="font-['Open_Sans'] text-[#4a5565] text-[16px] md:text-[18px] leading-[26px] md:leading-[30px]">
                    Artificial intelligence plays a critical role in predicting equipment failures, optimizing production flows, and performing adaptive quality control. Machine learning algorithms analyze live sensor data to detect anomalies within milliseconds, preventing costly disruptions and increasing yield precision. AI-powered forecasting also integrates supply chain insights to dynamically adjust schedules and materials flow.
                  </p>
                </div>

                {/* Edge Computing for Real-Time Control */}
                <div className="bg-white/60 rounded-[24px] p-6 md:p-8 border border-[#43ABFF]/20">
                  <h3 className="font-['PT_Sans'] text-[#1a3c8c] text-[22px] md:text-[28px] leading-[30px] md:leading-[36px] font-bold mb-4">
                    Edge Computing for Real-Time Control
                  </h3>
                  <p className="font-['Open_Sans'] text-[#4a5565] text-[16px] md:text-[18px] leading-[26px] md:leading-[30px]">
                    Edge computing decentralizes data processing, bringing computation directly to machines and industrial devices on the factory floor. This minimizes latency, ensures continuous operations, even offline and enables instant decision-making for robotics, AGVs, and inspection systems. Factories using edge gateways process massive IIoT data locally, generating actionable insights without stressing cloud networks.
                  </p>
                </div>

                {/* Automation Ecosystem Integration */}
                <div className="bg-white/60 rounded-[24px] p-6 md:p-8 border border-[#43ABFF]/20">
                  <h3 className="font-['PT_Sans'] text-[#1a3c8c] text-[22px] md:text-[28px] leading-[30px] md:leading-[36px] font-bold mb-4">
                    Automation Ecosystem Integration
                  </h3>
                  <p className="font-['Open_Sans'] text-[#4a5565] text-[16px] md:text-[18px] leading-[26px] md:leading-[30px]">
                    AI-enabled robots and cobots collaborate with humans on complex tasks, self-correct production routines, and maintain safety standards. Combined with IoT sensors and real-time analytics, automation creates closed-loop manufacturing environments where processes continuously learn and evolve. Robotics, vision systems, and digital workflows now form unified ecosystems that optimize quality, energy use, and supply chain responsiveness.
                  </p>
                </div>

                {/* Why It Matters */}
                <div className="bg-gradient-to-r from-[#43ABFF]/20 to-[#43ABFF]/10 rounded-[24px] p-6 md:p-8 border-2 border-[#43ABFF]/40">
                  <h3 className="font-['PT_Sans'] text-[#1a3c8c] text-[22px] md:text-[28px] leading-[30px] md:leading-[36px] font-bold mb-4">
                    Why It Matters
                  </h3>
                  <p className="font-['Open_Sans'] text-[#1a3c8c] text-[17px] md:text-[19px] leading-[28px] md:leading-[32px] font-semibold">
                    Smart factories leveraging AI and edge computing can achieve up to <span className="text-[#43ABFF]">40% operational efficiency gains</span>, <span className="text-[#43ABFF]">50% faster response times</span>, and <span className="text-[#43ABFF]">drastically reduced downtime</span>. The shift from centralized to distributed intelligence is redefining productivity and enabling self-optimizing, data-driven industrial ecosystems ready for the next generation of Industry 4.0.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Geographic and Sector Insights */}
          <motion.div
            ref={geoRef}
            initial={{ opacity: 0, y: 40 }}
            animate={isGeoInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-16 md:mb-24 max-w-[1400px] mx-auto"
          >
            <h2 
              className="text-[#1a3c8c] text-[32px] md:text-[48px] lg:text-[56px] leading-[40px] md:leading-[56px] lg:leading-[68px] mb-8 md:mb-12 text-center"
              style={{ 
                fontFamily: "PT Sans, sans-serif",
                fontWeight: 700
              }}
            >
              Geographic & Sector Insights
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              {/* North America & Europe */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isGeoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-gradient-to-br from-[#43ABFF]/10 to-[#43ABFF]/5 rounded-[24px] md:rounded-[30px] p-6 md:p-8 border-2 border-[#43ABFF]/30 hover:border-[#43ABFF] hover:shadow-lg transition-all"
              >
                <div className="bg-[#43ABFF] rounded-full p-4 w-fit mb-5">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-['PT_Sans'] text-[#1a3c8c] text-[24px] md:text-[28px] leading-[32px] md:leading-[36px] font-bold mb-3">
                  North America & Europe
                </h3>
                <div className="bg-[#43ABFF] text-white px-4 py-2 rounded-full font-['Open_Sans'] text-[14px] md:text-[15px] font-semibold inline-block mb-4">
                  Market Leaders
                </div>
                <p className="font-['Open_Sans'] text-[#4a5565] text-[16px] md:text-[18px] leading-[26px] md:leading-[30px]">
                  North America and Europe currently lead the market, with <span className="font-bold text-[#1a3c8c]">Europe accounting for more than 35% of global share</span>. These regions are at the forefront of industrial digitalization.
                </p>
              </motion.div>

              {/* Asia-Pacific */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isGeoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-gradient-to-br from-[#43ABFF]/10 to-[#43ABFF]/5 rounded-[24px] md:rounded-[30px] p-6 md:p-8 border-2 border-[#43ABFF]/30 hover:border-[#43ABFF] hover:shadow-lg transition-all"
              >
                <div className="bg-[#43ABFF] rounded-full p-4 w-fit mb-5">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-['PT_Sans'] text-[#1a3c8c] text-[24px] md:text-[28px] leading-[32px] md:leading-[36px] font-bold mb-3">
                  Asia-Pacific
                </h3>
                <div className="bg-[#43ABFF] text-white px-4 py-2 rounded-full font-['Open_Sans'] text-[14px] md:text-[15px] font-semibold inline-block mb-4">
                  Fastest Growing
                </div>
                <p className="font-['Open_Sans'] text-[#4a5565] text-[16px] md:text-[18px] leading-[26px] md:leading-[30px] mb-4">
                  <span className="font-bold text-[#1a3c8c]">Asia-Pacific, particularly India and China</span>, is emerging as the fastest-growing segment driven by government-led digital industrialization projects and 5G adoption.
                </p>
              </motion.div>

              {/* Top Industrial Sectors */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isGeoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-gradient-to-br from-[#43ABFF]/10 to-[#43ABFF]/5 rounded-[24px] md:rounded-[30px] p-6 md:p-8 border-2 border-[#43ABFF]/30 hover:border-[#43ABFF] hover:shadow-lg transition-all"
              >
                <div className="bg-[#43ABFF] rounded-full p-4 w-fit mb-5">
                  <Factory className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-['PT_Sans'] text-[#1a3c8c] text-[24px] md:text-[28px] leading-[32px] md:leading-[36px] font-bold mb-3">
                  Top Industrial Sectors
                </h3>
                <div className="bg-[#43ABFF] text-white px-4 py-2 rounded-full font-['Open_Sans'] text-[14px] md:text-[15px] font-semibold inline-block mb-4">
                  Key Adopters
                </div>
                <div className="space-y-2">
                  {["Automotive", "Aerospace", "Logistics", "Pharmaceuticals", "Electronics"].map((sector, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="bg-[#43ABFF] rounded-full size-[20px] flex items-center justify-center flex-shrink-0">
                        <p className="font-['Open_Sans'] text-white text-[12px]">✓</p>
                      </div>
                      <p className="font-['Open_Sans'] text-[#1a3c8c] text-[16px] md:text-[17px] font-semibold">
                        {sector}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isGeoInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-[1200px] mx-auto"
          >
            <div className="bg-gradient-to-r from-[#43ABFF]/15 to-[#43ABFF]/5 rounded-[30px] md:rounded-[40px] p-8 md:p-12 border-2 border-[#43ABFF]/30 text-center">
              {/* Top Badge */}
              <div className="flex justify-center mb-6">
                <div className="bg-[#43ABFF] text-white px-6 py-3 rounded-full font-['Open_Sans'] text-[14px] md:text-[16px] font-semibold tracking-wide shadow-lg">
                  From Data to Decisions
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="bg-[#43ABFF] rounded-full p-3">
                  <Database className="w-7 h-7 text-white" />
                </div>
                <h3 
                  className="text-[#1a3c8c] text-[28px] md:text-[36px] lg:text-[42px] leading-[36px] md:leading-[44px] lg:leading-[52px]"
                  style={{ 
                    fontFamily: "PT Sans, sans-serif",
                    fontWeight: 700
                  }}
                >
                  Ready to Join the Leaders?
                </h3>
              </div>
              
              {/* Opening Statement */}
              <p className="font-['Open_Sans'] text-[#1a3c8c] text-[18px] md:text-[22px] lg:text-[24px] leading-[30px] md:leading-[36px] lg:leading-[40px] font-semibold max-w-[1000px] mx-auto mb-6">
                Industry 4.0 initiatives fail without clean, contextualized, and continuous data. EdgeData provides the foundation you need:
              </p>
              
              {/* Platform Description */}
              <div className="bg-white/60 rounded-[24px] p-6 md:p-8 border border-[#43ABFF]/30 mb-6">
                <p className="font-['Open_Sans'] text-[#1a3c8c] text-[17px] md:text-[19px] lg:text-[20px] leading-[28px] md:leading-[32px] lg:leading-[34px] font-semibold">
                  An Industry 4.0-ready platform engineered to orchestrate edge data with ISA-95 compliance, OPC UA interoperability, and end-to-end governance for mission-critical operations.
                </p>
              </div>
              
              {/* Key Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[900px] mx-auto mb-8">
                <div className="bg-white/40 rounded-[20px] p-4 md:p-5 border border-[#43ABFF]/20">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="bg-[#43ABFF] rounded-full p-2">
                      <Workflow className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-['PT_Sans'] text-[#1a3c8c] text-[18px] md:text-[20px] font-bold">
                      Low-Code Configuration
                    </h4>
                  </div>
                  <p className="font-['Open_Sans'] text-[#4a5565] text-[14px] md:text-[15px] leading-[22px] md:leading-[24px]">
                    Deploy and configure industrial data pipelines without extensive coding
                  </p>
                </div>
                <div className="bg-white/40 rounded-[20px] p-4 md:p-5 border border-[#43ABFF]/20">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="bg-[#43ABFF] rounded-full p-2">
                      <Cpu className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-['PT_Sans'] text-[#1a3c8c] text-[18px] md:text-[20px] font-bold">
                      Agentic AI Integration
                    </h4>
                  </div>
                  <p className="font-['Open_Sans'] text-[#4a5565] text-[14px] md:text-[15px] leading-[22px] md:leading-[24px]">
                    Autonomous agents optimize operations and detect anomalies in real-time
                  </p>
                </div>
              </div>
              
              <p className="font-['Open_Sans'] text-[#4a5565] text-[16px] md:text-[18px] lg:text-[20px] leading-[26px] md:leading-[30px] lg:leading-[34px] max-w-[900px] mx-auto mb-8">
                Edge Data 360 helps organizations across all these sectors and regions achieve seamless edge-to-cloud data integration, ensuring zero data loss and accelerated digital transformation.
              </p>
              <Link 
                to="/"
                className="inline-flex items-center gap-2 bg-[#43ABFF] text-white px-8 py-4 rounded-full hover:bg-[#1a8de8] transition-all font-['Open_Sans'] text-[18px] font-semibold shadow-lg hover:shadow-xl"
              >
                Get Started with Edge Data 360
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer textColor={textColor} paragraphColor={paragraphColor} />
    </div>
  );
}