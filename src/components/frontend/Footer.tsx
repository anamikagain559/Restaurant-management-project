import React from 'react';
import { Instagram, Facebook, Twitter } from 'lucide-react';

import logo from '../../assets/logo.png';

interface FooterProps {
  navItems: string[];
  scrollToSection: (id: string) => void;
  navigate: (path: string) => void;
}

export const FrontendFooter: React.FC<FooterProps> = ({ navItems, scrollToSection, navigate }) => {
  const handleNavClick = (item: string) => {
    if (item === 'Home') navigate('/');
    else if (item === 'Menu') navigate('/menu');
    else if (item === 'Events') navigate('/events');
    else if (item === 'Contact') navigate('/contact');
    else {
      if (window.location.pathname !== '/') {
        navigate('/?scroll=' + item.toLowerCase());
      } else {
        scrollToSection(item.toLowerCase());
      }
    }
  };

  return (
    <footer className="bg-slate-950 text-white pt-32 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-5"></div>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32">
          <div>
            <div className="flex flex-row items-center gap-6 mb-12">
              <div
                className="w-20 h-20 glass-card rounded-full p-1 border border-white/20 flex items-center justify-center relative group cursor-pointer overflow-hidden shadow-2xl"
                onClick={() => navigate('/')}
              >
                <img
                  src={logo}
                  alt="Logo"
                  className="w-full h-full object-cover rounded-full relative z-10 group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div>
                <h3 className="text-4xl font-black tracking-tighter text-glow uppercase mb-1">SUNFLOWER</h3>
                <div className="flex items-center gap-3">
                  <span className="h-px w-6 bg-kona-teal"></span>
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">Premium Collective</span>
                </div>
              </div>
            </div>
            <p className="text-white/30 text-lg font-light leading-relaxed max-w-md italic mb-12">
              Merging biological aesthetics with technological precision.
              Experience the next iteration of culinary excellence.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <button
                  key={i}
                  className="w-12 h-12 glass-card rounded-full flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 transition-all hover:scale-110"
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-kona-teal mb-8">Navigation</h4>
              <ul className="space-y-4">
                {navItems.map(item => (
                  <li key={item}>
                    <button
                      onClick={() => handleNavClick(item)}
                      className="text-white/40 hover:text-white text-xs font-medium transition-all hover:translate-x-2 flex items-center gap-2 group"
                    >
                      <span className="w-0 h-px bg-kona-teal group-hover:w-4 transition-all"></span>
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-kona-teal mb-8">Systems</h4>
              <ul className="space-y-4">
                {['Registry', 'Reservations', 'Events', 'Privacy Protocol'].map(item => (
                  <li key={item}>
                    <button className="text-white/40 hover:text-white text-xs font-medium transition-all hover:translate-x-2 flex items-center gap-2 group">
                      <span className="w-0 h-px bg-white/20 group-hover:w-4 transition-all"></span>
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-16 border-t border-white/5 flex flex-col md:row items-center justify-between gap-8">
          <p className="text-white/10 text-[10px] font-black uppercase tracking-[0.3em]">
            © 2024 SUNFLOWER CORE SYSTEMS. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-10">
            <button className="text-white/10 hover:text-white text-[9px] font-black uppercase tracking-widest transition-colors">Security Registry</button>
            <button className="text-white/10 hover:text-white text-[9px] font-black uppercase tracking-widest transition-colors">API Access</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
