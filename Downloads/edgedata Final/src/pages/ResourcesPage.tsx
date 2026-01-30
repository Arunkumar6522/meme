import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { Book, FileText, Newspaper, ChevronRight, Search, Download, BookOpen, ArrowRight, ChevronDown, Clock, ChevronLeft, Sparkles } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export function ResourcesPage() {
  const heroRef = useRef(null);
  const documentationRef = useRef(null);
  const blogRef = useRef(null);
  const faqRef = useRef(null);

  const isHeroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const isDocumentationInView = useInView(documentationRef, { once: true, margin: "-150px" });
  const isBlogInView = useInView(blogRef, { once: true, margin: "-150px" });
  const isFaqInView = useInView(faqRef, { once: true, margin: "-150px" });

  const documentationItems = [
    {
      title: "Getting Started Guide",
      description: "Complete walkthrough for deploying Edge Data 360 in your industrial environment",
      type: "Guide",
      readTime: "15 min"
    },
    {
      title: "API Reference",
      description: "Comprehensive REST API documentation with examples and authentication guides",
      type: "Technical",
      readTime: "25 min"
    },
    {
      title: "Protocol Configuration",
      description: "Step-by-step configuration for OPC UA, Modbus, MQTT Sparkplug B, and more",
      type: "Guide",
      readTime: "20 min"
    },
    {
      title: "Data Pipeline Builder",
      description: "Visual guide to creating no-code data transformation workflows",
      type: "Tutorial",
      readTime: "12 min"
    },
    {
      title: "Security Best Practices",
      description: "Enterprise-grade security configuration and compliance guidelines",
      type: "Guide",
      readTime: "18 min"
    },
    {
      title: "Troubleshooting Guide",
      description: "Common issues and solutions for edge deployment scenarios",
      type: "Support",
      readTime: "10 min"
    }
  ];

  const blogPosts = [
    {
      title: "The Case for Edge Buffering",
      description: "Why autonomous edge operation is critical for industrial IoT reliability and zero data loss",
      author: "Sarah Chen",
      role: "Editor",
      timeAgo: "12 HOURS AGO",
      avatar: "SC"
    },
    {
      title: "Demystifying Sparkplug B",
      description: "Understanding the MQTT Sparkplug B specification and its role in modern industrial architectures",
      author: "M Moussa",
      role: "Editor",
      timeAgo: "5 DAYS AGO",
      avatar: "MM"
    },
    {
      title: "Edge-to-Cloud DataOps: A New Paradigm",
      description: "How edge-first data operations are transforming industrial digital transformation",
      author: "Ryan Nguyen",
      role: "Admin",
      timeAgo: "15 DAYS AGO",
      avatar: "RN"
    },
    {
      title: "Building Resilient Industrial IoT Systems",
      description: "Design patterns for creating fault-tolerant edge architectures that never lose data",
      author: "James Taylor",
      role: "Editor",
      timeAgo: "1 MONTH AGO",
      avatar: "JT"
    },
    {
      title: "OEE Analytics: Beyond the Basics",
      description: "Advanced techniques for extracting actionable insights from manufacturing equipment data",
      author: "Lisa Park",
      role: "Editor",
      timeAgo: "1 MONTH AGO",
      avatar: "LP"
    },
    {
      title: "The Future of Unified Namespace",
      description: "How UNS is revolutionizing data interoperability in smart manufacturing",
      author: "David Kim",
      role: "Admin",
      timeAgo: "2 MONTHS AGO",
      avatar: "DK"
    },
    {
      title: "Edge AI for Predictive Maintenance",
      description: "Implementing machine learning models at the edge for real-time anomaly detection",
      author: "Anna Schmidt",
      role: "Editor",
      timeAgo: "2 MONTHS AGO",
      avatar: "AS"
    },
    {
      title: "Protocol Translation Best Practices",
      description: "Strategies for seamless integration between legacy systems and modern cloud platforms",
      author: "Carlos Martinez",
      role: "Editor",
      timeAgo: "3 MONTHS AGO",
      avatar: "CM"
    },
    {
      title: "Zero Trust Security for Industrial Edge",
      description: "Implementing enterprise-grade security in OT environments without compromising performance",
      author: "Sarah Chen",
      role: "Admin",
      timeAgo: "3 MONTHS AGO",
      avatar: "SC"
    }
  ];

  const faqs = [
    {
      category: "Deployment",
      question: "What are the hardware requirements for edge deployment?",
      answer: "Edge Data 360 runs on standard x86-64 or ARM64 hardware. Minimum requirements include 4GB RAM, 2 CPU cores, and 20GB storage. For production workloads, we recommend 8GB RAM, 4 cores, and 50GB SSD storage. The platform is optimized for resource-constrained environments and can run on industrial PCs, edge gateways, or virtual machines."
    },
    {
      category: "Deployment",
      question: "Can Edge Data 360 run in air-gapped environments?",
      answer: "Yes. Edge Data 360 is specifically designed for air-gapped and intermittent connectivity scenarios. The platform supports fully offline deployments with local buffering, data synchronization when connectivity is restored, and local management capabilities. Cloud connectivity is optional and can be configured based on your security requirements."
    },
    {
      category: "Deployment",
      question: "What is the typical deployment timeline?",
      answer: "Deployment timelines vary based on scope. A proof-of-concept typically takes 1-2 weeks, a production pilot 4-6 weeks, and full enterprise rollout 2-4 months depending on facility count and integration complexity. Our professional services team provides accelerated deployment options."
    },
    {
      category: "Security",
      question: "What security certifications does Edge Data 360 hold?",
      answer: "We maintain SOC 2 Type II and ISO 27001 certifications, and are FDA 21 CFR Part 11 compliant for pharmaceutical and life sciences applications. Edge deployments support TLS 1.3 encryption, AES-256 encryption at rest, role-based access control (RBAC), and comprehensive audit logging for compliance requirements."
    },
    {
      category: "Security",
      question: "How is data encrypted at rest and in transit?",
      answer: "All data is encrypted using AES-256 encryption at rest and TLS 1.3 in transit. Edge-to-cloud communication uses mutual TLS (mTLS) authentication with automatic certificate rotation. Encryption keys are managed using industry-standard key management systems with support for customer-managed keys."
    },
    {
      category: "Security",
      question: "Does Edge Data 360 support multi-tenancy?",
      answer: "Yes. Enterprise deployments include complete tenant isolation with separate databases, encryption keys, and configurable data residency policies per facility or business unit. Each tenant can have independent access controls, compliance settings, and integration configurations."
    },
    {
      category: "Protocols",
      question: "Which industrial protocols are supported?",
      answer: "We support 20+ protocols out-of-the-box including OPC UA, Modbus TCP/RTU, MQTT/Sparkplug B, EtherNet/IP, Profinet, BACnet, DNP3, S7, and more. Custom protocol adapters can be developed using our SDK. Each protocol connector includes automatic tag discovery, data type mapping, and error handling."
    },
    {
      category: "Protocols",
      question: "How does Edge Data 360 handle protocol translation?",
      answer: "Our visual pipeline builder includes built-in protocol translators with automatic schema mapping, allowing seamless data transformation between industrial and enterprise protocols. The system handles data type conversions, timestamp normalization, and quality codes automatically while maintaining full traceability."
    },
    {
      category: "Integration",
      question: "Can Edge Data 360 integrate with existing MES, ERP, and SCADA systems?",
      answer: "Yes. Edge Data 360 provides native connectors for major enterprise systems including SAP, Oracle, Rockwell, Siemens, and others. We support both real-time streaming and batch integration patterns, with configurable data transformation and business logic execution."
    },
    {
      category: "Integration",
      question: "What cloud platforms are supported?",
      answer: "Edge Data 360 supports all major cloud platforms including AWS, Azure, Google Cloud, and private cloud deployments. We provide native integrations with cloud-native services like AWS IoT Core, Azure IoT Hub, and cloud data warehouses for seamless hybrid architectures."
    }
  ];

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [selectedFaqCategory, setSelectedFaqCategory] = useState<string>('all');
  const faqCategories = ['all', 'Deployment', 'Security', 'Protocols', 'Integration'];

  const filteredFaqs = faqs.filter(faq => 
    selectedFaqCategory === 'all' || faq.category === selectedFaqCategory
  );

  const [currentPage, setCurrentPage] = useState(0);
  const postsPerPage = 3;
  const totalPages = Math.ceil(blogPosts.length / postsPerPage);
  
  const currentPosts = blogPosts.slice(
    currentPage * postsPerPage,
    (currentPage + 1) * postsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        textColor="rgb(55, 65, 81)" 
        bgColor="rgba(255, 255, 255, 0.9)"
        borderColor="rgba(229, 231, 235, 1)"
      />

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-gradient-to-b from-[#f8fafc] to-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center max-w-[900px] mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <span className="text-[13px] font-semibold text-[#43ABFF] bg-[#43ABFF]/10 px-4 py-2 rounded-full border border-[#43ABFF]/20">
                Knowledge Hub
              </span>
            </motion.div>
            
            <h1 
              className="text-[#1a3c8c] text-[48px] md:text-[64px] lg:text-[76px] leading-[56px] md:leading-[72px] lg:leading-[84px] mb-6"
              style={{ 
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 700
              }}
            >
              Learn & Grow with Edge Data
            </h1>
            <p className="font-['Open_Sans'] text-[#4a5565] text-[18px] md:text-[22px] leading-[30px] md:leading-[36px] mb-10 max-w-[750px] mx-auto">
              Technical documentation, industry insights, and expert guidance to accelerate your edge-to-cloud transformation.
            </p>

            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative max-w-[650px] mx-auto"
            >
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#43ABFF]" />
              <input
                type="text"
                placeholder="Search documentation, articles, guides..."
                className="w-full pl-14 pr-5 py-5 border-2 border-[#e5e7eb] rounded-2xl text-[16px] focus:outline-none focus:border-[#43ABFF] focus:shadow-lg transition-all duration-300 bg-white"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
          backgroundImage: `
            linear-gradient(to right, #43ABFF 1px, transparent 1px),
            linear-gradient(to bottom, #43ABFF 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }} />
      </section>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Documentation Section */}
        <motion.section
          ref={documentationRef}
          className="py-20 md:py-28"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isDocumentationInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 
              className="text-[#1a3c8c] text-[42px] md:text-[56px] leading-[48px] md:leading-[64px] mb-5"
              style={{ 
                fontFamily: "PT Sans, sans-serif",
                fontWeight: 700
              }}
            >
              Documentation
            </h2>
            <p className="font-['Open_Sans'] text-[#4a5565] text-[18px] md:text-[20px] leading-[30px] md:leading-[34px] max-w-[850px]">
              Comprehensive technical guides, API references, and implementation resources for developers and system integrators.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {documentationItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isDocumentationInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group bg-white border border-[#e5e7eb] rounded-3xl p-7 hover:border-[#43ABFF] hover:shadow-2xl transition-all duration-400 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold text-[#43ABFF] bg-[#43ABFF]/8 px-3 py-1.5 rounded-lg uppercase tracking-wide">
                    {item.type}
                  </span>
                  <span className="text-[13px] text-[#9ca3af] font-medium">{item.readTime}</span>
                </div>
                <h3 className="text-[#1a3c8c] text-[21px] font-bold mb-3 group-hover:text-[#43ABFF] transition-colors leading-[28px]">
                  {item.title}
                </h3>
                <p className="text-[#4a5565] text-[15px] leading-[25px] mb-5">
                  {item.description}
                </p>
                <div className="flex items-center gap-2 text-[#43ABFF] text-[14px] font-semibold pt-3 border-t border-[#f3f4f6]">
                  <span>Read Documentation</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Blog Section */}
        <motion.section
          ref={blogRef}
          className="py-20 md:py-28 bg-gradient-to-b from-white to-[#f8fafc]"
        >
          <div className="max-w-[1400px] mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isBlogInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h2 
                className="text-[#1a3c8c] text-[42px] md:text-[56px] leading-[48px] md:leading-[64px] mb-5"
                style={{ 
                  fontFamily: "PT Sans, sans-serif",
                  fontWeight: 700
                }}
              >
                Blog & Insights
              </h2>
              <p className="font-['Open_Sans'] text-[#4a5565] text-[18px] md:text-[20px] leading-[30px] md:leading-[34px] max-w-[850px]">
                Expert perspectives on industrial edge computing, data platforms, and digital transformation strategies.
              </p>
            </motion.div>

            {/* Blog Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {currentPosts.map((post, index) => (
                <motion.article
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isBlogInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="group bg-white border border-[#e5e7eb] rounded-3xl p-7 hover:border-[#43ABFF] hover:shadow-2xl transition-all duration-400 cursor-pointer"
                >
                  {/* Image Placeholder */}
                  <div className="w-full h-[200px] bg-gradient-to-br from-[#43ABFF]/10 to-[#43ABFF]/5 rounded-2xl mb-5 group-hover:from-[#43ABFF]/20 group-hover:to-[#43ABFF]/10 transition-all" />

                  {/* Meta Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[11px] font-bold text-[#43ABFF] bg-[#43ABFF]/8 px-3 py-1.5 rounded-lg uppercase tracking-wide">
                      Article
                    </span>
                    <span className="text-[13px] text-[#9ca3af] font-medium">{post.timeAgo}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-[#1a3c8c] text-[21px] font-bold mb-3 group-hover:text-[#43ABFF] transition-colors leading-[28px]">
                    {post.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[#4a5565] text-[15px] leading-[25px] mb-5">
                    {post.description}
                  </p>

                  {/* Read More Link */}
                  <div className="flex items-center gap-2 text-[#43ABFF] text-[14px] font-semibold pt-3 border-t border-[#f3f4f6]">
                    <span>Read Article</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.article>
              ))}
            </div>

            {/* Simple Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={isBlogInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex items-center justify-center gap-4 mt-16"
              >
                <button 
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                  className="px-5 py-3 border border-[#e5e7eb] rounded-xl text-[#4a5565] text-[14px] font-semibold hover:border-[#43ABFF] hover:text-[#43ABFF] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#e5e7eb] disabled:hover:text-[#4a5565]"
                >
                  Previous
                </button>
                <div className="flex items-center gap-2 px-4">
                  <span className="text-[#4a5565] text-[14px] font-medium">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                </div>
                <button 
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages - 1}
                  className="px-5 py-3 border border-[#e5e7eb] rounded-xl text-[#4a5565] text-[14px] font-semibold hover:border-[#43ABFF] hover:text-[#43ABFF] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#e5e7eb] disabled:hover:text-[#4a5565]"
                >
                  Next
                </button>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          ref={faqRef}
          className="py-20 md:py-28"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isFaqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 
              className="text-[#0f172a] text-[48px] md:text-[56px] leading-[1.1] mb-3"
              style={{ 
                fontFamily: "Roboto, sans-serif",
                fontWeight: 800
              }}
            >
              Frequently asked questions
            </h2>
          </motion.div>

          <div className="max-w-[1280px] mx-auto">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isFaqInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="relative"
              >
                <div className="absolute inset-0 border-t border-[#e2e8f0] pointer-events-none" />
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full text-left py-8 flex items-start gap-2 hover:opacity-70 transition-opacity duration-200"
                >
                  <p 
                    className="flex-1 text-[#0f172a] text-[20px] md:text-[24px] leading-[1.6]"
                    style={{ 
                      fontFamily: "Roboto, sans-serif",
                      fontWeight: 400
                    }}
                  >
                    {faq.question}
                  </p>
                  <motion.div
                    animate={{ rotate: openFaqIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="shrink-0 mt-1"
                  >
                    <ChevronDown className="w-6 h-6 text-[#0f172a]" />
                  </motion.div>
                </button>
                
                <motion.div
                  initial={false}
                  animate={{
                    height: openFaqIndex === index ? "auto" : 0,
                    opacity: openFaqIndex === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="pb-8">
                    <p 
                      className="text-[#64748b] text-[17px] md:text-[18px] leading-[1.7] pr-8"
                      style={{ 
                        fontFamily: "Roboto, sans-serif",
                        fontWeight: 400
                      }}
                    >
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>

      <Footer />
    </div>
  );
}