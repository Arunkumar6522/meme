import { useState } from "react";
import svgPathsLeft from "../imports/svg-nmkf02oxa3";
import svgPathsRight from "../imports/svg-qgk7z6fib9";
import AiIcon from "../imports/Container-6026-283";

function Badge() {
  return (
    <div className="bg-white box-border content-stretch flex gap-[8px] md:gap-[10.667px] items-center px-[10px] md:px-[12px] py-[6px] md:py-[8px] rounded-[60px] shadow-[0px_0px_1.333px_0px_rgba(44,58,114,0.05),0px_2.667px_8px_0px_rgba(44,58,114,0.05),0px_13.333px_24px_0px_rgba(58,76,146,0.1)] border border-[#b6bccd]">
      <div className="shrink-0 w-[26.667px]">
        <AiIcon />
      </div>
      <p className="font-medium leading-[1.6] text-[#1a3c8c] text-[16px] md:text-[21.333px] text-center whitespace-nowrap" style={{ fontFamily: "Open Sans, sans-serif" }}>
        Resilient Intelligence Engine
      </p>
    </div>
  );
}

function Heading() {
  return (
    <div className="w-full max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
      <h1
        className="text-center leading-[1.2] text-[36px] sm:text-[48px] md:text-[56px] lg:text-[64px] bg-clip-text text-transparent"
        style={{
          WebkitTextFillColor: "transparent",
          backgroundImage: "linear-gradient(rgb(3, 105, 161) 0%, rgb(26, 60, 140) 100%)",
          fontFamily: "PT Sans, sans-serif",
          fontWeight: 700
        }}
      >
        Bridge the Gap Between Shop Floor and Top Floor
      </h1>
    </div>
  );
}

function Paragraph({ paragraphColor }: { paragraphColor?: any }) {
  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
      <p className="font-['Open_Sans'] text-[#4a5565] text-[16px] sm:text-[20px] md:text-[24px] lg:text-[26px] leading-[26px] sm:leading-[32px] md:leading-[38px] lg:leading-[42px] text-center">
        The first edge-to-cloud DataOps platform that transforms fragmented industrial signals into a secure, AI-ready "Single Source of Truth."
      </p>
    </div>
  );
}

function Buttons() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 md:gap-[15.995px] items-center justify-center px-4">
      {/* Request Demo Button */}
      <button
        className="h-[48px] w-full sm:w-[180px] bg-[#43ABFF] rounded-[60px] shadow-[0px_1px_18px_0px_rgba(0,0,0,0.12),0px_6px_10px_0px_rgba(0,0,0,0.14),0px_3px_5px_-1px_rgba(0,0,0,0.2)] flex items-center justify-center px-[32px] py-[8px] hover:bg-[#3A9AE5] hover:shadow-[0px_2px_24px_0px_rgba(0,0,0,0.18),0px_8px_16px_0px_rgba(0,0,0,0.16),0px_4px_8px_-1px_rgba(0,0,0,0.24)] transition-all duration-300 ease-out"
      >
        <p className="font-['Open_Sans'] text-white text-[18px] leading-[28px] text-center whitespace-nowrap" style={{ fontWeight: 600 }}>
          Request demo
        </p>
      </button>

      {/* Learn More Button */}
      <button
        className="h-[48px] w-full sm:w-[180px] bg-white border border-[#43ABFF] rounded-[60px] shadow-[0px_1px_18px_0px_rgba(0,0,0,0.12),0px_6px_10px_0px_rgba(0,0,0,0.14),0px_3px_5px_-1px_rgba(0,0,0,0.2)] flex items-center justify-center px-[32px] py-[8px] hover:bg-[rgba(67,171,255,0.05)] hover:shadow-[0px_2px_24px_0px_rgba(0,0,0,0.18),0px_8px_16px_0px_rgba(0,0,0,0.16),0px_4px_8px_-1px_rgba(0,0,0,0.24)] transition-all duration-300 ease-out"
      >
        <p
          className="font-['Open_Sans'] text-[18px] leading-[28px] text-center whitespace-nowrap bg-clip-text text-transparent"
          style={{
            fontWeight: 600,
            WebkitTextFillColor: "transparent",
            backgroundImage: "linear-gradient(rgb(67, 171, 255) 0%, rgb(67, 171, 255) 100%)",
          }}
        >
          Learn More
        </p>
      </button>
    </div>
  );
}

function Categories() {
  const categories = [
    "DATA MESH",
    "DATAOPS",
    "UNIFIED DATA FABRIC",
    "UNIFIED NAMESPACE"
  ];

  return (
    <div className="flex flex-row flex-wrap items-center justify-center gap-6 md:gap-8 lg:gap-12 mt-8 md:mt-12 px-4">
      {categories.map((category, index) => (
        <div key={category}>
          <span
            className="font-['Open_Sans'] text-[#6b7280] text-[11px] md:text-[13px] lg:text-[14px] font-medium tracking-[0.15em] uppercase whitespace-nowrap"
            style={{ letterSpacing: "0.15em" }}
          >
            {category}
          </span>
        </div>
      ))}
    </div>
  );
}

export function HeroNew({ textColor, paragraphColor }: { textColor?: any; paragraphColor?: any }) {
  return (
    <section className="relative min-h-[auto] md:min-h-[90vh] overflow-hidden flex items-center justify-center py-20 md:py-12 sm:py-16 lg:py-20">
      {/* Left flowing lines - Static */}
      <div className="absolute h-[500px] sm:h-[600px] lg:h-[702px] left-0 top-1/2 -translate-y-1/2 w-[400px] sm:w-[500px] lg:w-[662px] pointer-events-none hidden md:block">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 661.994 702">
          <defs>
            <linearGradient id="leftGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopOpacity="0.8" stopColor="#43ABFF" />
              <stop offset="100%" stopOpacity="0" stopColor="#43ABFF" />
            </linearGradient>
          </defs>
          <path
            id="leftPath"
            d={svgPathsLeft.p391de280}
            stroke="url(#leftGradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Animated node 1 */}
          <circle r="6" fill="#43ABFF">
            <animateMotion
              dur="12s"
              repeatCount="indefinite"
              path={svgPathsLeft.p391de280}
              keyPoints="0;1"
              keyTimes="0;1"
              calcMode="linear"
            />
            <animate
              attributeName="opacity"
              values="1;1;0"
              keyTimes="0;0.7;1"
              dur="12s"
              repeatCount="indefinite"
            />
          </circle>
          {/* Animated node 2 with delay */}
          <circle r="6" fill="#43ABFF">
            <animateMotion
              dur="12s"
              repeatCount="indefinite"
              path={svgPathsLeft.p391de280}
              keyPoints="0;1"
              keyTimes="0;1"
              calcMode="linear"
              begin="4s"
            />
            <animate
              attributeName="opacity"
              values="1;1;0"
              keyTimes="0;0.7;1"
              dur="12s"
              repeatCount="indefinite"
              begin="4s"
            />
          </circle>
          {/* Animated node 3 with delay */}
          <circle r="6" fill="#43ABFF">
            <animateMotion
              dur="12s"
              repeatCount="indefinite"
              path={svgPathsLeft.p391de280}
              keyPoints="0;1"
              keyTimes="0;1"
              calcMode="linear"
              begin="8s"
            />
            <animate
              attributeName="opacity"
              values="1;1;0"
              keyTimes="0;0.7;1"
              dur="12s"
              repeatCount="indefinite"
              begin="8s"
            />
          </circle>
        </svg>
      </div>

      {/* Right flowing lines - Static */}
      <div className="absolute h-[500px] sm:h-[600px] lg:h-[702px] right-0 top-1/2 -translate-y-1/2 w-[400px] sm:w-[500px] lg:w-[662px] pointer-events-none scale-x-[-1] hidden md:block">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 661.994 702">
          <defs>
            <linearGradient id="rightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopOpacity="0.8" stopColor="#43ABFF" />
              <stop offset="100%" stopOpacity="0" stopColor="#43ABFF" />
            </linearGradient>
          </defs>
          <path
            id="rightPath"
            d={svgPathsRight.p391de280}
            stroke="url(#rightGradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Animated node 1 */}
          <circle r="6" fill="#43ABFF">
            <animateMotion
              dur="12s"
              repeatCount="indefinite"
              path={svgPathsRight.p391de280}
              keyPoints="0;1"
              keyTimes="0;1"
              calcMode="linear"
            />
            <animate
              attributeName="opacity"
              values="1;1;0"
              keyTimes="0;0.7;1"
              dur="12s"
              repeatCount="indefinite"
            />
          </circle>
          {/* Animated node 2 with delay */}
          <circle r="6" fill="#43ABFF">
            <animateMotion
              dur="12s"
              repeatCount="indefinite"
              path={svgPathsRight.p391de280}
              keyPoints="0;1"
              keyTimes="0;1"
              calcMode="linear"
              begin="4s"
            />
            <animate
              attributeName="opacity"
              values="1;1;0"
              keyTimes="0;0.7;1"
              dur="12s"
              repeatCount="indefinite"
              begin="4s"
            />
          </circle>
          {/* Animated node 3 with delay */}
          <circle r="6" fill="#43ABFF">
            <animateMotion
              dur="12s"
              repeatCount="indefinite"
              path={svgPathsRight.p391de280}
              keyPoints="0;1"
              keyTimes="0;1"
              calcMode="linear"
              begin="8s"
            />
            <animate
              attributeName="opacity"
              values="1;1;0"
              keyTimes="0;0.7;1"
              dur="12s"
              repeatCount="indefinite"
              begin="8s"
            />
          </circle>
        </svg>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 relative z-10 w-full mt-12 md:mt-0">
        <div className="flex flex-col items-center justify-center gap-6 sm:gap-8 lg:gap-10">
          <Badge />
          <Heading />
          <Paragraph paragraphColor={paragraphColor} />
          <Buttons />
          <Categories />
        </div>
      </div>
    </section>
  );
}