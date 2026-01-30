import { Header } from "../components/Header";
import { HeroNew } from "../components/HeroNew";
import { WhyEdgeDataScroll } from "../components/WhyEdgeDataScroll";
import { ResilienceEngineNew } from "../components/ResilienceEngineNew";
import { Industry40New } from "../components/Industry40New";
import { UseCasesNew } from "../components/UseCasesNew";
import { SocialProofNew } from "../components/SocialProofNew";
import { CTABlockNew } from "../components/CTABlockNew";
import { Footer } from "../components/Footer";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const industry40Ref = useRef<HTMLDivElement>(null);
  const socialProofRef = useRef<HTMLDivElement>(null);
  
  // Track scroll for Industry 4.0 start (white -> dark)
  const { scrollYProgress: industry40Progress } = useScroll({
    target: industry40Ref,
    offset: ["start 0.7", "start 0.1"],
  });
  
  // Track scroll for Social Proof start (dark -> white fade out)
  const { scrollYProgress: socialProofProgress } = useScroll({
    target: socialProofRef,
    offset: ["start 0.8", "start 0.2"],
  });
  
  // Background: white -> dark when entering Industry 4.0, dark -> white when entering Social Proof
  const backgroundColor = useTransform(
    [industry40Progress, socialProofProgress],
    ([industry40, socialProof]) => {
      // Fade to dark as we enter Industry 4.0
      if (industry40 > 0 && industry40 < 1) {
        const r = Math.round(255 - (240 * industry40));
        const g = Math.round(255 - (240 * industry40));
        const b = Math.round(255 - (235 * industry40));
        return `rgb(${r}, ${g}, ${b})`;
      }
      // Gradually fade back to white when entering Social Proof
      else if (socialProof > 0 && socialProof < 1) {
        const fadeProgress = socialProof;
        const r = Math.round(15 + (240 * fadeProgress));
        const g = Math.round(15 + (240 * fadeProgress));
        const b = Math.round(20 + (235 * fadeProgress));
        return `rgb(${r}, ${g}, ${b})`;
      }
      // Stay dark during Industry 4.0 and Use Cases (before Social Proof starts)
      else if (industry40 >= 1 && socialProof === 0) {
        return "rgb(15, 15, 20)";
      }
      // Back to white after Social Proof transition completes
      else if (socialProof >= 1) {
        return "rgb(255, 255, 255)";
      }
      // Default: white
      return "rgb(255, 255, 255)";
    }
  );
  
  // Text colors transition with background
  const textColor = useTransform(
    [industry40Progress, socialProofProgress],
    ([industry40, socialProof]) => {
      if (industry40 > 0.5 && socialProof < 0.5) {
        return "rgb(255, 255, 255)";
      }
      return "rgb(26, 60, 140)";
    }
  );
  
  const paragraphColor = useTransform(
    [industry40Progress, socialProofProgress],
    ([industry40, socialProof]) => {
      if (industry40 > 0.5 && socialProof < 0.5) {
        return "#ececec";
      }
      return "#4a5565";
    }
  );
  
  // Header text color
  const headerTextColor = useTransform(
    [industry40Progress, socialProofProgress],
    ([industry40, socialProof]) => {
      if (industry40 > 0.2 && socialProof < 0.5) {
        return "rgb(255, 255, 255)";
      }
      return "rgb(55, 65, 81)"; // gray-700
    }
  );
  
  const headerBgColor = useTransform(
    [industry40Progress, socialProofProgress],
    ([industry40, socialProof]) => {
      if (industry40 > 0.2 && socialProof < 0.5) {
        return "rgba(15, 15, 20, 0.9)";
      }
      return "rgba(255, 255, 255, 0.9)";
    }
  );
  
  const headerBorderColor = useTransform(
    [industry40Progress, socialProofProgress],
    ([industry40, socialProof]) => {
      if (industry40 > 0.2 && socialProof < 0.5) {
        return "rgba(255, 255, 255, 0.1)";
      }
      return "rgba(229, 231, 235, 1)"; // gray-200
    }
  );

  return (
    <motion.div 
      ref={containerRef}
      className="min-h-screen"
      style={{ backgroundColor }}
    >
      <Header 
        textColor={headerTextColor} 
        bgColor={headerBgColor}
        borderColor={headerBorderColor}
      />
      <main>
        <HeroNew textColor={textColor} paragraphColor={paragraphColor} />
        <WhyEdgeDataScroll textColor={textColor} paragraphColor={paragraphColor} />
        <ResilienceEngineNew textColor={textColor} paragraphColor={paragraphColor} />
        <div ref={industry40Ref}>
          <Industry40New textColor={textColor} paragraphColor={paragraphColor} />
        </div>
        <UseCasesNew textColor={textColor} paragraphColor={paragraphColor} />
        <div ref={socialProofRef}>
          <SocialProofNew textColor={textColor} paragraphColor={paragraphColor} />
        </div>
        <CTABlockNew />
      </main>
      <Footer textColor={textColor} paragraphColor={paragraphColor} />
    </motion.div>
  );
}
