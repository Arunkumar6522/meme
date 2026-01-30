import { Linkedin, Youtube, MapPin, Phone, Mail } from "lucide-react";
import Frame70 from "../imports/Frame70";

export function Footer({ textColor, paragraphColor }: { textColor?: any; paragraphColor?: any }) {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 md:py-16">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-[200px] h-[34px]">
                <Frame70 />
              </div>
            </div>
            <p className="text-slate-400 max-w-sm mb-6">
              EdgeData 360. Reliable manufacturing data, from edge to cloud.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-[#43ABFF] transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-[#43ABFF] transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white mb-4 font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="hover:text-[#43ABFF] transition-colors">Home</a></li>
              <li><a href="#why-edgedata" className="hover:text-[#43ABFF] transition-colors">Why EdgeData</a></li>
              <li><a href="#industry40" className="hover:text-[#43ABFF] transition-colors">Industry 5.0</a></li>
              <li><a href="#use-cases" className="hover:text-[#43ABFF] transition-colors">Industries</a></li>
              <li><a href="#pricing" className="hover:text-[#43ABFF] transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-white mb-4 font-semibold">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#43ABFF] flex-shrink-0 mt-0.5" />
                <p className="text-slate-400 text-sm">
                  Cupertino, CA, USA
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#43ABFF] flex-shrink-0" />
                <a href="tel:+14089811878" className="text-slate-400 text-sm hover:text-[#43ABFF] transition-colors">
                  +1 408 981 1878
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#43ABFF] flex-shrink-0" />
                <a href="mailto:info@ed360.com" className="text-slate-400 text-sm hover:text-[#43ABFF] transition-colors">
                  info@ed360.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © 2025 Edge Data 360. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-[#43ABFF] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#43ABFF] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#43ABFF] transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}