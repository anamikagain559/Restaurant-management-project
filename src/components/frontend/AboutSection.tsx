import React from 'react';
import { Leaf, Star, Wine } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="relative py-32 overflow-hidden bg-white">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-kona-teal/5 rounded-full blur-[120px] -z-10"></div>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <div className="glass-panel p-10 rounded-[3rem] shadow-glow-teal relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-kona-teal/30 to-transparent"></div>
              <div className="text-kona-teal font-black tracking-[0.4em] uppercase text-[10px] mb-6">
                Biological Intelligence
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-kona-maroon mb-8 tracking-tighter uppercase leading-[0.9]">
                Wholesome <br /> <span className="opacity-40">Innovation</span>
              </h2>
              <p className="text-slate-600 mb-8 leading-relaxed font-medium text-lg">
                Founded with a passion for organic vibrancy, SUNFLOWER is a
                sanctuary for sensory exploration. We believe that great dining
                is an algorithm of <span className="text-kona-teal font-black">nature + technology</span>,
                sourced directly from local ecosystem partners.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: Leaf, title: 'Eco-System' },
                  { icon: Star, title: 'Pure-Grade' },
                  { icon: Wine, title: 'Sensory-IQ' }
                ].map((feature, idx) => (
                  <div
                    key={idx}
                    className="glass-card p-4 rounded-2xl flex flex-col items-center text-center group/item hover:bg-white transition-all">
                    <feature.icon className="w-6 h-6 text-kona-teal mb-3 group-hover/item:scale-125 transition-transform" />
                    <h3 className="font-black text-kona-maroon uppercase text-[8px] tracking-[0.2em]">
                      {feature.title}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="relative order-1 lg:order-2">
            <div className="absolute inset-0 bg-mesh opacity-20 blur-3xl -z-10"></div>
            <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.1)] border-8 border-white group">
              <div 
                className="w-full h-full bg-kona-light flex items-center justify-center bg-cover bg-center group-hover:scale-110 transition-transform duration-1000 grayscale-[0.2] hover:grayscale-0"
                style={{ backgroundImage: `url('https://i.ibb.co.com/nq1CgR1W/restaurant-decoration.jpg')` }}
              ></div>
            </div>
            <div className="absolute -bottom-10 -right-10 glass-panel p-8 rounded-[2rem] shadow-2xl max-w-xs hidden xl:block animate-float">
              <div className="flex items-center gap-5 mb-4">
                <div className="w-14 h-14 bg-kona-maroon rounded-full flex items-center justify-center text-white shadow-xl">
                  <Star className="w-7 h-7 fill-white" />
                </div>
                <div>
                  <div className="text-2xl font-black text-kona-maroon">4.9/5</div>
                  <div className="text-[10px] text-kona-teal font-black uppercase tracking-widest">
                    AI Verified Excellence
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-500 font-medium leading-relaxed italic">
                "A masterpiece of organic luxury."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
