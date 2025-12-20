import { Facebook, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#002C6B] via-[#002C6B] to-[#530075] text-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#F14600]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Logo & About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#F14600] to-[#F14600]/80 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold">ZUTE</span>
              </div>
              <div>
                <div className="text-white font-bold">ZUTE</div>
                <div className="text-xs text-white/70">Teachers Empowerment</div>
              </div>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              Empowering teachers across Zambia through advocacy, welfare, and professional development.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white mb-4 font-bold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-white/80 hover:text-[#F14600] transition-colors text-sm">
                  About ZUTE
                </a>
              </li>
              <li>
                <a href="#programs" className="text-white/80 hover:text-[#F14600] transition-colors text-sm">
                  Programs
                </a>
              </li>
              <li>
                <a href="#membership" className="text-white/80 hover:text-[#F14600] transition-colors text-sm">
                  Membership
                </a>
              </li>
              <li>
                <a href="#contact" className="text-white/80 hover:text-[#F14600] transition-colors text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white mb-4 font-bold">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/80 hover:text-[#F14600] transition-colors text-sm">
                  Member Portal
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-[#F14600] transition-colors text-sm">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#news" className="text-white/80 hover:text-[#F14600] transition-colors text-sm">
                  News & Updates
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-[#F14600] transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-white mb-4 font-bold">Connect With Us</h4>
            <div className="flex gap-3 mb-4">
              <a 
                href="#" 
                className="w-11 h-11 bg-white/10 hover:bg-[#F14600] backdrop-blur-sm rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-11 h-11 bg-white/10 hover:bg-[#F14600] backdrop-blur-sm rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-11 h-11 bg-white/10 hover:bg-[#F14600] backdrop-blur-sm rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >

              </a>
            </div>
            <p className="text-white/80 text-sm">
              Follow us for updates and announcements
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 mt-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/70">
            <p>© 2025 ZUTE. All Rights Reserved.</p>
            <p>
              Designed & Developed by <span className="text-[#F14600]">Chisomo Mutale</span> | ZUTE Innovation Initiative
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
