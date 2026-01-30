import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Frame68 from "../imports/Frame68";
import Frame69 from "../imports/Frame69-6023-452";

export function Header({ textColor, bgColor, borderColor }: { textColor?: any; bgColor?: any; borderColor?: any }) {
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Hide header when scrolling down, show when scrolling up
          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setHidden(true);
            setMobileMenuOpen(false); // Close mobile menu on scroll
          } else {
            setHidden(false);
          }
          
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Detect dark mode based on textColor
  useEffect(() => {
    // Check if textColor is white/light (dark mode)
    const checkDarkMode = () => {
      if (typeof textColor === 'string') {
        setIsDarkMode(textColor.includes('255, 255, 255') || textColor === 'rgb(255, 255, 255)');
      } else if (textColor?.get) {
        const value = textColor.get();
        setIsDarkMode(value.includes('255, 255, 255') || value === 'rgb(255, 255, 255)');
      }
    };
    
    checkDarkMode();
    
    // Subscribe to changes if it's a motion value
    if (textColor?.onChange) {
      return textColor.onChange(checkDarkMode);
    }
  }, [textColor]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ 
        opacity: 1, 
        y: hidden ? -100 : 0 
      }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b"
      style={{ 
        backgroundColor: bgColor,
        borderColor: borderColor,
      }}
    >
      <div className="max-w-[1920px] mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2 md:gap-3" onClick={(e) => {
            e.preventDefault();;
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}>
            <div className="w-[140px] h-[24px] sm:w-[170px] sm:h-[29px] md:w-[200px] md:h-[34px]">
              {isDarkMode ? <Frame69 /> : <Frame68 />}
            </div>
          </a>

          {/* Desktop Navigation - Centered */}
          <motion.nav className="hidden lg:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
            <motion.a 
              href="#home" 
              className="relative group" 
              style={{ color: textColor }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <span className="transition-colors duration-300 ease-out group-hover:text-[#43ABFF]">Home</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#43ABFF] transition-all duration-300 ease-out group-hover:w-full"></span>
            </motion.a>
            <motion.a 
              href="#why-edgedata" 
              className="relative group" 
              style={{ color: textColor }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <span className="transition-colors duration-300 ease-out group-hover:text-[#43ABFF]">Why EdgeData</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#43ABFF] transition-all duration-300 ease-out group-hover:w-full"></span>
            </motion.a>
            <motion.a 
              href="#industry40" 
              className="relative group" 
              style={{ color: textColor }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <span className="transition-colors duration-300 ease-out group-hover:text-[#43ABFF]">Industry 5.0</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#43ABFF] transition-all duration-300 ease-out group-hover:w-full"></span>
            </motion.a>
            <motion.a 
              href="#use-cases" 
              className="relative group" 
              style={{ color: textColor }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <span className="transition-colors duration-300 ease-out group-hover:text-[#43ABFF]">Industries</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#43ABFF] transition-all duration-300 ease-out group-hover:w-full"></span>
            </motion.a>
            <motion.a 
              href="#pricing" 
              className="relative group" 
              style={{ color: textColor }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <span className="transition-colors duration-300 ease-out group-hover:text-[#43ABFF]">Pricing</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#43ABFF] transition-all duration-300 ease-out group-hover:w-full"></span>
            </motion.a>
          </motion.nav>

          {/* CTA Button - Right side */}
          <div className="hidden lg:flex items-center">
            <motion.button 
              className="px-6 py-2.5 bg-[#43ABFF] text-white rounded-full hover:bg-[#3A9AE5] transition-all duration-300 ease-out shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              Get Started
            </motion.button>
          </div>

          {/* Mobile/Tablet Hamburger Button */}
          <motion.button
            className="lg:hidden p-2 rounded-lg hover:bg-[rgba(67,171,255,0.1)] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
            style={{ color: textColor }}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden border-t"
            style={{ 
              backgroundColor: bgColor,
              borderColor: borderColor,
            }}
          >
            <nav className="px-6 py-6 space-y-1">
              {/* Home Link */}
              <motion.a
                href="#home"
                className="block py-3 px-4 rounded-lg hover:bg-[rgba(67,171,255,0.1)] transition-colors"
                style={{ color: textColor }}
                onClick={(e) => {
                  e.preventDefault();
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                whileTap={{ scale: 0.98 }}
              >
                Home
              </motion.a>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-[rgba(67,171,255,0.3)] to-transparent my-4"></div>

              {/* Navigation Section */}
              <div className="mb-4">
                <p className="text-xs uppercase tracking-wider opacity-60 mb-3 px-4" style={{ color: textColor }}>
                  Navigation
                </p>
                <motion.a
                  href="#why-edgedata"
                  className="block py-3 px-4 rounded-lg hover:bg-[rgba(67,171,255,0.1)] transition-colors"
                  style={{ color: textColor }}
                  onClick={() => setMobileMenuOpen(false)}
                  whileTap={{ scale: 0.98 }}
                >
                  Why EdgeData
                </motion.a>
                <motion.a
                  href="#industry40"
                  className="block py-3 px-4 rounded-lg hover:bg-[rgba(67,171,255,0.1)] transition-colors"
                  style={{ color: textColor }}
                  onClick={() => setMobileMenuOpen(false)}
                  whileTap={{ scale: 0.98 }}
                >
                  Industry 5.0
                </motion.a>
                <motion.a
                  href="#use-cases"
                  className="block py-3 px-4 rounded-lg hover:bg-[rgba(67,171,255,0.1)] transition-colors"
                  style={{ color: textColor }}
                  onClick={() => setMobileMenuOpen(false)}
                  whileTap={{ scale: 0.98 }}
                >
                  Industries
                </motion.a>
                <motion.a
                  href="#pricing"
                  className="block py-3 px-4 rounded-lg hover:bg-[rgba(67,171,255,0.1)] transition-colors"
                  style={{ color: textColor }}
                  onClick={() => setMobileMenuOpen(false)}
                  whileTap={{ scale: 0.98 }}
                >
                  Pricing
                </motion.a>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-[rgba(67,171,255,0.3)] to-transparent my-4"></div>
              
              {/* Mobile CTA */}
              <motion.button
                className="w-full mt-4 px-6 py-3 bg-[#43ABFF] text-white rounded-full transition-all hover:bg-[#3A9AE5] font-medium"
                whileTap={{ scale: 0.98 }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </motion.button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}