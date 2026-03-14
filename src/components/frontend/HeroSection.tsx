import React from 'react';
import { Clock, UtensilsCrossed, Users, Star } from 'lucide-react';

interface HeroSectionProps {
  navigate: (path: string) => void;
  scrollToSection: (id: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ navigate, scrollToSection }) => {
  return (
    <section
      id="home"
      className="relative min-h-[110vh] flex items-center justify-center overflow-hidden bg-slate-950">

      <div className="absolute inset-0 z-0">
        <img 
          src="https://i.ibb.co.com/dsJ59VbS/slider-bg2.webp" 
          className="w-full h-full object-cover opacity-60" 
          alt="Hero Background" 
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950 z-0"></div>
      <div className="absolute inset-0 bg-mesh opacity-20 z-0 mix-blend-overlay"></div>
      
      {/* Animated Particle Field */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full blur-[100px] animate-pulse z-0"
          style={{
            width: `${Math.random() * 400 + 200}px`,
            height: `${Math.random() * 400 + 200}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            backgroundColor: i % 2 === 0 ? 'rgba(180, 255, 255, 0.1)' : 'rgba(255, 180, 200, 0.1)',
            animationDuration: `${Math.random() * 4 + 3}s`,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-20 text-center px-4 max-w-6xl mx-auto pt-20">
        <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-2xl text-white/60 text-[10px] font-black uppercase tracking-[0.5em] mb-12 animate-shimmer overflow-hidden">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-kona-teal animate-pulse"></span>
            Redefining Organic Luxury
          </span>
          <span className="w-px h-3 bg-white/20"></span>
          <span>Est. 2024</span>
        </div>

        <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] font-black text-white mb-10 leading-[0.85] tracking-tighter text-glow">
          <span className="block italic font-light opacity-50 text-3xl sm:text-5xl tracking-[0.2em] mb-6 drop-shadow-lg">THE GOLDEN</span>
          <span className="relative">
            SUNFLOWER
            <span className="absolute -inset-2 bg-kona-teal/20 blur-[60px] -z-10 rounded-full"></span>
          </span>
        </h1>

        <p className="text-xl sm:text-2xl text-white/50 mb-16 max-w-2xl mx-auto leading-relaxed font-light tracking-wide drop-shadow-md">
          Where artificial intelligence meets natural perfection.
          Experience a sanctuary of <span className="text-white font-medium">hyper-organic dining</span> and sensory excellence.
        </p>

        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-24">
          <button
            onClick={() => navigate('/menu')}
            className="group relative px-14 py-6 bg-white text-slate-950 rounded-full font-black text-xs uppercase tracking-[0.3em] transition-all hover:scale-105 shadow-[0_0_50px_rgba(255,255,255,0.3)] hover:shadow-[0_0_70px_rgba(255,255,255,0.5)] active:scale-95">
            Discovery Menu
            <div className="absolute inset-0 rounded-full border border-white/50 group-hover:scale-125 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
          </button>
          <button
            onClick={() => scrollToSection('reservations')}
            className="relative px-14 py-6 text-white border border-white/20 rounded-full font-black text-xs uppercase tracking-[0.3em] transition-all hover:bg-white/5 backdrop-blur-md overflow-hidden group">
            <span className="relative z-10">Private Reservation</span>
            <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:left-full transition-all duration-1000"></div>
          </button>
        </div>

        <div className="flex flex-col items-center gap-4 opacity-40 hover:opacity-100 transition-opacity">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white">Infinite Journey</p>
          <div className="w-px h-24 bg-gradient-to-b from-white to-transparent"></div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent z-20 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <StatsItem icon={Clock} value="15+" label="Years of Excellence" />
            <StatsItem icon={UtensilsCrossed} value="200+" label="Signature Dishes" />
            <StatsItem icon={Users} value="50K+" label="Happy Guests" />
            <StatsItem icon={Star} value="4.9" label="Guest Rating" highlighted />
          </div>
        </div>
      </div>
    </section>
  );
};

interface StatsItemProps {
  icon: any;
  value: string;
  label: string;
  highlighted?: boolean;
}

const StatsItem: React.FC<StatsItemProps> = ({ icon: Icon, value, label, highlighted }) => (
  <div className={`text-center p-4 rounded-2xl backdrop-blur-sm border transition-colors group ${
    highlighted 
      ? 'bg-white/40 border-white shadow-xl shadow-kona-teal/5' 
      : 'bg-white/5 border-white/10 hover:border-orange-500/30'
  }`}>
    <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${
      highlighted ? 'bg-kona-teal/10' : 'bg-orange-500/20'
    }`}>
      <Icon className={`w-6 h-6 ${highlighted ? 'text-kona-teal fill-kona-teal' : 'text-orange-500'}`} />
    </div>
    <div className={`text-3xl md:text-4xl mb-1 ${highlighted ? 'font-black text-kona-maroon' : 'font-bold text-white'}`}>
      {value}
    </div>
    <div className={`text-xs uppercase tracking-widest ${highlighted ? 'text-kona-teal font-black' : 'text-slate-400 font-medium'}`}>
      {label}
    </div>
  </div>
);
