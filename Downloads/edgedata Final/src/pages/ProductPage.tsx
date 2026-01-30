import { motion, useScroll, useTransform } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useState } from "react";
import { Shield, Lock, Users, Key, FileCheck, Cloud, Database, Network, Workflow, Settings, Activity, Upload, Eye, Cpu, Filter, GitBranch, Code, Gauge, Server, Globe, MessageSquare, Play, CheckCircle2, Zap, Layers, ArrowRight } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { HeroSection } from "../components/HeroSection";

export function ProductPage() {
  const heroRef = useRef(null);
  const dataFlowRef = useRef(null);
  const connectivityRef = useRef(null);
  const managementRef = useRef(null);
  const securityRef = useRef(null);
  const demoRef = useRef(null);
  
  const isHeroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const isDataFlowInView = useInView(dataFlowRef, { once: true, margin: "-150px" });
  const isConnectivityInView = useInView(connectivityRef, { once: true, margin: "-150px" });
  const isManagementInView = useInView(managementRef, { once: true, margin: "-150px" });
  const isSecurityInView = useInView(securityRef, { once: true, margin: "-150px" });
  const isDemoInView = useInView(demoRef, { once: true, margin: "-100px" });

  const [activeTab, setActiveTab] = useState<'industrial' | 'enterprise' | 'endpoints'>('industrial');

  const textColor = "rgb(26, 60, 140)";
  const paragraphColor = "#4a5565";

  const connectivityData = {
    industrial: [
      "OPC UA", "Modbus TCP/RTU", "SCADA", "MQTT", 
      "EtherNet/IP", "Profinet", "BACnet", "DNP3"
    ],
    enterprise: [
      "Apache Kafka", "Oracle", "Neo4j", "PostgreSQL", 
      "MongoDB", "InfluxDB", "REST API", "GraphQL"
    ],
    endpoints: [
      "MQTT (Sparkplug B)", "REST API", "WebSockets", "gRPC"
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        textColor="rgb(55, 65, 81)" 
        bgColor="rgba(255, 255, 255, 0.9)"
        borderColor="rgba(229, 231, 235, 1)"
      />
      
      {/* Hero Section - Figma Design */}
      <section ref={heroRef} className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden bg-gradient-to-b from-[#f8fafc] to-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <HeroSection />
        </div>

        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: `
            linear-gradient(to right, #43ABFF 1px, transparent 1px),
            linear-gradient(to bottom, #43ABFF 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />
      </section>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Visual DataOps Section */}
        <motion.section
          ref={dataFlowRef}
          className="py-16 md:py-24"
        >
          <div className="max-w-[1500px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isDataFlowInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 md:mb-16"
            >
              <h2 
                className="text-[#1a3c8c] text-[36px] md:text-[52px] lg:text-[64px] leading-[44px] md:leading-[60px] lg:leading-[76px] mb-5"
                style={{ 
                  fontFamily: "PT Sans, sans-serif",
                  fontWeight: 700
                }}
              >
                Visual DataOps: Code-Free Pipelines
              </h2>
              <p className="font-['Open_Sans'] text-[#4a5565] text-[17px] md:text-[20px] leading-[28px] md:leading-[34px] max-w-[850px] mx-auto">
                Build sophisticated data pipelines without writing a single line of code. Drag, drop, deploy.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                { 
                  icon: <Code className="w-8 h-8" />, 
                  title: "Visual Pipeline Builder", 
                  desc: "Drag-and-drop flow creation with intuitive interface"
                },
                { 
                  icon: <Filter className="w-8 h-8" />, 
                  title: "Data Transformation Library", 
                  desc: "Filtering, aggregation, unit conversion, custom functions"
                },
                { 
                  icon: <GitBranch className="w-8 h-8" />, 
                  title: "Deployment & Versioning", 
                  desc: "Centralized deployment to Edge devices with rollback"
                },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isDataFlowInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="relative bg-white rounded-[24px] p-8 md:p-10 border border-[#e5e7eb] cursor-pointer hover:border-[#43ABFF]/40 transition-all duration-300 hover:shadow-xl group"
                >
                  <div className="relative z-10">
                    <div className="mb-5 text-[#43ABFF] group-hover:scale-110 transition-transform duration-300 inline-block">
                      {card.icon}
                    </div>
                    <h3 className="font-['PT_Sans'] text-[#1a3c8c] text-[22px] md:text-[24px] leading-[28px] md:leading-[32px] font-bold mb-3">
                      {card.title}
                    </h3>
                    <p className="font-['Open_Sans'] text-[#4a5565] text-[15px] md:text-[16px] leading-[24px] md:leading-[26px]">
                      {card.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Connectivity Section - Enhanced with Tabs */}
        <motion.section
          ref={connectivityRef}
          className="py-16 md:py-24"
        >
          <div className="max-w-[1500px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isConnectivityInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 md:mb-16"
            >
              <h2 
                className="text-[#1a3c8c] text-[36px] md:text-[52px] lg:text-[64px] leading-[44px] md:leading-[60px] lg:leading-[76px] mb-5"
                style={{ 
                  fontFamily: "PT Sans, sans-serif",
                  fontWeight: 700
                }}
              >
                Connect Anything, Anywhere
              </h2>
              <p className="font-['Open_Sans'] text-[#4a5565] text-[17px] md:text-[20px] leading-[28px] md:leading-[34px] max-w-[850px] mx-auto">
                Native support for industrial protocols and enterprise systems without middleware.
              </p>
            </motion.div>

            {/* Tab Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isConnectivityInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center mb-12"
            >
              <div className="inline-flex items-center gap-2 bg-[#f8fafc] border border-[#e5e7eb] rounded-full p-2">
                <button
                  onClick={() => setActiveTab('industrial')}
                  className={`relative px-6 md:px-8 py-3 rounded-full font-['Open_Sans'] text-[14px] md:text-[15px] font-semibold transition-all duration-300 ${
                    activeTab === 'industrial'
                      ? 'bg-white text-[#43ABFF] shadow-md'
                      : 'text-[#64748b] hover:text-[#1a3c8c]'
                  }`}
                >
                  Industrial Protocols
                </button>
                <button
                  onClick={() => setActiveTab('enterprise')}
                  className={`relative px-6 md:px-8 py-3 rounded-full font-['Open_Sans'] text-[14px] md:text-[15px] font-semibold transition-all duration-300 ${
                    activeTab === 'enterprise'
                      ? 'bg-white text-[#43ABFF] shadow-md'
                      : 'text-[#64748b] hover:text-[#1a3c8c]'
                  }`}
                >
                  Enterprise Systems
                </button>
                <button
                  onClick={() => setActiveTab('endpoints')}
                  className={`relative px-6 md:px-8 py-3 rounded-full font-['Open_Sans'] text-[14px] md:text-[15px] font-semibold transition-all duration-300 ${
                    activeTab === 'endpoints'
                      ? 'bg-white text-[#43ABFF] shadow-md'
                      : 'text-[#64748b] hover:text-[#1a3c8c]'
                  }`}
                >
                  Built-in Endpoints
                </button>
              </div>
            </motion.div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              {/* Industrial Protocols */}
              {activeTab === 'industrial' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                  {connectivityData.industrial.map((protocol, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      whileHover={{ scale: 1.05, y: -4 }}
                      className="group relative bg-white rounded-2xl p-6 border-2 border-[#e5e7eb] hover:border-[#43ABFF]/50 transition-all duration-300 cursor-pointer hover:shadow-xl"
                    >
                      <div className="flex items-center justify-center h-full">
                        <p className="font-['Open_Sans'] text-[#1a3c8c] text-[15px] md:text-[16px] font-bold text-center">
                          {protocol}
                        </p>
                      </div>
                      
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#43ABFF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Enterprise Systems */}
              {activeTab === 'enterprise' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                  {connectivityData.enterprise.map((system, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      whileHover={{ scale: 1.05, y: -4 }}
                      className="group relative bg-white rounded-2xl p-6 border-2 border-[#e5e7eb] hover:border-[#43ABFF]/50 transition-all duration-300 cursor-pointer hover:shadow-xl"
                    >
                      <div className="flex items-center justify-center h-full">
                        <p className="font-['Open_Sans'] text-[#1a3c8c] text-[15px] md:text-[16px] font-bold text-center">
                          {system}
                        </p>
                      </div>
                      
                      <div className="absolute inset-0 bg-gradient-to-br from-[#43ABFF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Built-in Endpoints */}
              {activeTab === 'endpoints' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                    {connectivityData.endpoints.map((endpoint, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        whileHover={{ scale: 1.05, y: -4 }}
                        className="group relative bg-white rounded-2xl p-6 border-2 border-[#e5e7eb] hover:border-[#43ABFF]/50 transition-all duration-300 cursor-pointer hover:shadow-xl"
                      >
                        <div className="flex items-center justify-center h-full">
                          <p className="font-['Open_Sans'] text-[#1a3c8c] text-[15px] md:text-[16px] font-bold text-center">
                            {endpoint}
                          </p>
                        </div>
                        
                        <div className="absolute inset-0 bg-gradient-to-br from-[#43ABFF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Additional Info Card for Endpoints */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-gradient-to-br from-[#43ABFF]/10 to-[#43ABFF]/5 rounded-2xl p-8 border border-[#43ABFF]/20 text-center"
                  >
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <Layers className="w-6 h-6 text-[#43ABFF]" />
                      <h4 className="font-['PT_Sans'] text-[#1a3c8c] text-[20px] md:text-[22px] font-bold">
                        20+ Connectors Supported
                      </h4>
                    </div>
                    <p className="font-['Open_Sans'] text-[#4a5565] text-[15px] md:text-[16px] leading-[24px] max-w-[600px] mx-auto">
                      Out of the box connectivity with custom connector SDK for specialized integrations
                    </p>
                  </motion.div>
                </>
              )}
            </motion.div>
          </div>
        </motion.section>

        {/* Management & Scale Section */}
        <motion.section
          ref={managementRef}
          className="py-16 md:py-24"
        >
          <div className="max-w-[1500px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isManagementInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 md:mb-16"
            >
              <h2 
                className="text-[#1a3c8c] text-[36px] md:text-[52px] lg:text-[64px] leading-[44px] md:leading-[60px] lg:leading-[76px] mb-5"
                style={{ 
                  fontFamily: "PT Sans, sans-serif",
                  fontWeight: 700
                }}
              >
                Centralized Control for Distributed Fleets
              </h2>
              <p className="font-['Open_Sans'] text-[#4a5565] text-[17px] md:text-[20px] leading-[28px] md:leading-[34px] max-w-[850px] mx-auto">
                Scale globally while maintaining complete control from a single unified management plane.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                {
                  icon: <Eye className="w-8 h-8" />,
                  title: "Remote Orchestration",
                  desc: "Manage thousands of Edge boxes from the central Admin Dashboard"
                },
                {
                  icon: <Upload className="w-8 h-8" />,
                  title: "OTA Updates",
                  desc: "Secure Over-The-Air deployment for configurations and software"
                },
                {
                  icon: <Activity className="w-8 h-8" />,
                  title: "Health Monitoring",
                  desc: "Edge Device Dashboard, flow metrics, and alerts"
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isManagementInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="relative bg-white rounded-[24px] p-8 md:p-10 border border-[#e5e7eb] cursor-pointer hover:border-[#43ABFF]/40 transition-all duration-300 hover:shadow-xl group"
                >
                  <div className="relative z-10">
                    <div className="mb-5 text-[#43ABFF] group-hover:scale-110 transition-transform duration-300 inline-block">
                      {item.icon}
                    </div>
                    <h3 className="font-['PT_Sans'] text-[#1a3c8c] text-[22px] md:text-[24px] leading-[28px] md:leading-[32px] font-bold mb-3">
                      {item.title}
                    </h3>
                    <p className="font-['Open_Sans'] text-[#4a5565] text-[15px] md:text-[16px] leading-[24px] md:leading-[26px]">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Security Section */}
        <motion.section
          ref={securityRef}
          className="py-16 md:py-24"
        >
          <div className="max-w-[1500px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isSecurityInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 md:mb-16"
            >
              <h2 
                className="text-[#1a3c8c] text-[36px] md:text-[52px] lg:text-[64px] leading-[44px] md:leading-[60px] lg:leading-[76px] mb-5"
                style={{ 
                  fontFamily: "PT Sans, sans-serif",
                  fontWeight: 700
                }}
              >
                Secure by Design
              </h2>
              <p className="font-['Open_Sans'] text-[#4a5565] text-[17px] md:text-[20px] leading-[28px] md:leading-[34px] max-w-[850px] mx-auto">
                Enterprise-grade security built into every layer of the platform.
              </p>
            </motion.div>
            
            {/* Horizontal Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12">
              {[
                {
                  icon: <Users className="w-10 h-10" />,
                  title: "RBAC",
                  desc: "Role-Based Access Control with granular permissions for users, teams, and devices across your organization.",
                  color: "#43ABFF"
                },
                {
                  icon: <Key className="w-10 h-10" />,
                  title: "MFA",
                  desc: "Multi-Factor Authentication ensures secure access with multiple verification methods for all users.",
                  color: "#10b981"
                },
                {
                  icon: <FileCheck className="w-10 h-10" />,
                  title: "Certificate Management",
                  desc: "X.509 & TLS certificate lifecycle management with automated rotation and secure storage.",
                  color: "#8b5cf6"
                },
                {
                  icon: <Shield className="w-10 h-10" />,
                  title: "Encrypted Communication",
                  desc: "End-to-end encryption for all data in transit and at rest, protecting your industrial data.",
                  color: "#f59e0b"
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isSecurityInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="relative group"
                >
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6 inline-block"
                    style={{ color: item.color }}
                  >
                    <div 
                      className="w-[50px] h-[50px] rounded-2xl flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: `${item.color}20` }}
                    >
                      {item.icon}
                    </div>
                  </motion.div>
                  
                  {/* Title */}
                  <h3 
                    className="font-['PT_Sans'] text-[#1a3c8c] text-[22px] md:text-[24px] leading-[28px] md:leading-[34px] font-bold mb-4"
                  >
                    {item.title}
                  </h3>
                  
                  {/* Description */}
                  <p 
                    className="font-['Open_Sans'] text-[#4a5565] text-[15px] md:text-[16px] leading-[24px] md:leading-[28px]"
                    style={{ opacity: 0.85 }}
                  >
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* See the Builder in Action - Demo Section */}
        <motion.section
          ref={demoRef}
          className="py-8 md:py-12"
        >
          <div className="max-w-[1300px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isDemoInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="relative bg-gradient-to-br from-[#43ABFF] to-[#1a8de8] rounded-[30px] md:rounded-[40px] overflow-hidden"
            >
              {/* Background overlay with pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{ 
                  backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 70%)" 
                }} />
              </div>

              {/* Content */}
              <div className="relative z-10 text-center py-10 md:py-16 px-6 md:px-12">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={isDemoInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="text-white text-[36px] md:text-[60px] lg:text-[80px] leading-[44px] md:leading-[72px] lg:leading-[96px] mb-5 md:mb-6"
                  style={{ 
                    fontFamily: "DM Sans, sans-serif",
                    fontWeight: 700
                  }}
                >
                  See the Builder in Action
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={isDemoInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="font-['Open_Sans'] text-white/95 text-[16px] md:text-[18px] lg:text-[20px] leading-[26px] md:leading-[30px] lg:leading-[34px] max-w-[900px] mx-auto mb-8 md:mb-10"
                >
                  Watch how Edge Data 360 transforms complex industrial data operations into simple, visual workflows. See real-world deployments and understand how our platform delivers unmatched reliability at the edge.
                </motion.p>
                
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={isDemoInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.4 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 bg-white text-[#43ABFF] rounded-full px-8 md:px-10 py-3.5 md:py-4 shadow-xl hover:shadow-2xl transition-all font-['Open_Sans'] text-[16px] md:text-[18px] font-bold"
                >
                  <div className="bg-[#43ABFF] rounded-full p-2">
                    <Play className="w-5 h-5 text-white" fill="white" />
                  </div>
                  Watch a Demo Video
                </motion.button>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            </motion.div>
          </div>
        </motion.section>
      </div>

      <Footer textColor={textColor} paragraphColor={paragraphColor} />
    </div>
  );
}