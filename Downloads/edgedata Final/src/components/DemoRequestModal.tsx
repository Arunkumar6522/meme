import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { ArrowRight, CheckCircle2, Calendar, Users, Target, X } from "lucide-react";
import { toast } from "sonner";

interface DemoRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoRequestModal({ isOpen, onClose }: DemoRequestModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    country: "",
    companyEmail: "",
    jobTitle: "",
    challenges: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Request sent successfully! We will contact you shortly.");
    // Handle form submission here
    // Close modal after submission
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Modal - Full Screen Layout */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-[1600px] h-[90vh] bg-white rounded-[60px] shadow-[25px_20px_70px_-27px_rgba(0,0,0,0.27)] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-8 right-8 z-20 w-12 h-12 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors shadow-lg"
              >
                <X className="w-6 h-6 text-[#1a3c8c]" />
              </button>

              <div className="grid grid-cols-[1fr_1fr] h-full">
                {/* Left Side - Blue Background with Information */}
                <div className="relative bg-gradient-to-br from-[#43ABFF] to-[#1a8de8] p-16 flex flex-col justify-center">
                  {/* Decorative overlay */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.15) 0%, transparent 60%)"
                    }}
                  />

                  <div className="relative z-10 space-y-8 max-w-[600px]">
                    {/* Main Heading */}
                    <div className="space-y-3">
                      <h2
                        className="text-white text-[48px] leading-[58px]"
                        style={{
                          fontFamily: "PT Sans, sans-serif",
                          fontWeight: 700
                        }}
                      >
                        Let&apos;s Get Started
                      </h2>
                      <p className="font-['Open_Sans'] text-white/90 text-[24px] leading-[36px] font-semibold">
                        Access your personalized demo
                      </p>
                    </div>

                    {/* Info Card */}
                    <div className="bg-white/10 backdrop-blur-md rounded-[40px] p-8 border border-white/20 shadow-[0px_20px_59.6px_0px_inset_rgba(255,255,255,0.19)]">
                      <h3
                        className="text-white text-[28px] leading-[36px] mb-4"
                        style={{
                          fontFamily: "PT Sans, sans-serif",
                          fontWeight: 700
                        }}
                      >
                        Prepare for Your Personalized Demo
                      </h3>
                      <p className="font-['Open_Sans'] text-white/80 text-[16px] leading-[26px] mb-6">
                        Every industrial environment is unique. At Edge Data 360, we tailor each demonstration to your exact needs. To deliver the most relevant experience, we may request some background information on your current data landscape.
                      </p>

                      <div className="space-y-3">
                        <p className="font-['Open_Sans'] text-white text-[18px] leading-[28px] font-semibold">
                          During your 1-hour demo, we will:
                        </p>
                        <ul className="space-y-2.5">
                          {[
                            { icon: CheckCircle2, text: "Review your current data challenges and pain points" },
                            { icon: Target, text: "Discuss your system architecture and data ecosystem" },
                            { icon: Users, text: "Identify potential use cases and optimization opportunities" },
                            { icon: Calendar, text: "Provide an overview of Edge Data 360 features" },
                            { icon: ArrowRight, text: "Show how we can simplify and scale your operations" },
                          ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <item.icon className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                              <span className="font-['Open_Sans'] text-white/90 text-[15px] leading-[24px]">
                                {item.text}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Privacy Note */}
                    <div className="bg-white/10 backdrop-blur-md rounded-[30px] p-6 border border-white/20">
                      <p className="font-['Open_Sans'] text-white/80 text-[13px] leading-[22px]">
                        <span className="font-semibold text-white">Privacy Note:</span> Edge Data 360 respects your privacy. The information you provide will be used solely to schedule your demo and communicate relevant service updates.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Side - White Background with Form */}
                <div className="bg-white p-16 flex flex-col justify-center overflow-y-auto">
                  <div className="max-w-[540px] mx-auto w-full">
                    <h3
                      className="text-[#1a3c8c] text-[36px] leading-[44px] mb-10 text-center"
                      style={{
                        fontFamily: "PT Sans, sans-serif",
                        fontWeight: 700
                      }}
                    >
                      Request a Demo
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* First Name & Last Name */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className="block font-['Open_Sans'] text-[#1a3c8c] text-[14px] font-semibold mb-2">
                            First name<span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            required
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full px-6 py-3.5 border-2 border-[#757d83] rounded-[60px] focus:border-[#43ABFF] focus:outline-none transition-colors font-['Open_Sans'] text-[16px] text-[#000e19]"
                            placeholder="Enter your first name"
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block font-['Open_Sans'] text-[#1a3c8c] text-[14px] font-semibold mb-2">
                            Last name<span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            required
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full px-6 py-3.5 border-2 border-[#757d83] rounded-[60px] focus:border-[#43ABFF] focus:outline-none transition-colors font-['Open_Sans'] text-[16px] text-[#000e19]"
                            placeholder="Enter your last name"
                          />
                        </div>
                      </div>

                      {/* Company Name */}
                      <div>
                        <label htmlFor="companyName" className="block font-['Open_Sans'] text-[#1a3c8c] text-[14px] font-semibold mb-2">
                          Company name<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="companyName"
                          name="companyName"
                          required
                          value={formData.companyName}
                          onChange={handleChange}
                          className="w-full px-6 py-3.5 border-2 border-[#757d83] rounded-[60px] focus:border-[#43ABFF] focus:outline-none transition-colors font-['Open_Sans'] text-[16px] text-[#000e19]"
                          placeholder="Enter your company name"
                        />
                      </div>

                      {/* Country */}
                      <div>
                        <label htmlFor="country" className="block font-['Open_Sans'] text-[#1a3c8c] text-[14px] font-semibold mb-2">
                          Country<span className="text-red-500">*</span>
                        </label>
                        <select
                          id="country"
                          name="country"
                          required
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full px-6 py-3.5 border-2 border-[#757d83] rounded-[60px] focus:border-[#43ABFF] focus:outline-none transition-colors font-['Open_Sans'] text-[16px] text-[#000e19] bg-white"
                        >
                          <option value="">Select a country</option>
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="UK">United Kingdom</option>
                          <option value="DE">Germany</option>
                          <option value="FR">France</option>
                          <option value="JP">Japan</option>
                          <option value="CN">China</option>
                          <option value="IN">India</option>
                          <option value="AU">Australia</option>
                          <option value="BR">Brazil</option>
                          <option value="MX">Mexico</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      {/* Company Email */}
                      <div>
                        <label htmlFor="companyEmail" className="block font-['Open_Sans'] text-[#1a3c8c] text-[14px] font-semibold mb-2">
                          Company email<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="companyEmail"
                          name="companyEmail"
                          required
                          value={formData.companyEmail}
                          onChange={handleChange}
                          className="w-full px-6 py-3.5 border-2 border-[#757d83] rounded-[60px] focus:border-[#43ABFF] focus:outline-none transition-colors font-['Open_Sans'] text-[16px] text-[#000e19]"
                          placeholder="your.email@company.com"
                        />
                      </div>

                      {/* Job Title */}
                      <div>
                        <label htmlFor="jobTitle" className="block font-['Open_Sans'] text-[#1a3c8c] text-[14px] font-semibold mb-2">
                          Job title<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="jobTitle"
                          name="jobTitle"
                          required
                          value={formData.jobTitle}
                          onChange={handleChange}
                          className="w-full px-6 py-3.5 border-2 border-[#757d83] rounded-[60px] focus:border-[#43ABFF] focus:outline-none transition-colors font-['Open_Sans'] text-[16px] text-[#000e19]"
                          placeholder="Enter your job title"
                        />
                      </div>

                      {/* Data Challenges */}
                      <div>
                        <label htmlFor="challenges" className="block font-['Open_Sans'] text-[#1a3c8c] text-[14px] font-semibold mb-2">
                          Tell us about your current data challenges<span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="challenges"
                          name="challenges"
                          required
                          value={formData.challenges}
                          onChange={handleChange}
                          rows={3}
                          className="w-full px-6 py-3.5 border-2 border-[#757d83] rounded-[30px] focus:border-[#43ABFF] focus:outline-none transition-colors font-['Open_Sans'] text-[16px] text-[#000e19] resize-none"
                          placeholder="Please describe your current data challenges..."
                        />
                      </div>

                      {/* Submit Button */}
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-[#43ABFF] text-white py-4 rounded-[60px] font-['Open_Sans'] text-[20px] font-semibold hover:bg-[#3A9AE5] transition-all duration-300 shadow-[0px_1px_18px_0px_rgba(0,0,0,0.12),0px_6px_10px_0px_rgba(0,0,0,0.14),0px_3px_5px_-1px_rgba(0,0,0,0.2)] flex items-center justify-center gap-2 mt-6"
                      >
                        Request Demo
                        <ArrowRight className="w-5 h-5" />
                      </motion.button>

                      <p className="text-center font-['Open_Sans'] text-[#4a5565] text-[13px] leading-[20px] mt-4">
                        Our team will contact you within 1–2 business days
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}