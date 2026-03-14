import React from 'react';
import { MapPin, Clock, Phone } from 'lucide-react';

export const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-32 bg-white relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-kona-teal/5 rounded-full blur-[100px] -z-10"></div>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-24">
          <div className="text-kona-teal font-black tracking-[0.4em] uppercase text-[10px] mb-6">
            Contact Nodes
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-kona-maroon mb-4 tracking-tighter uppercase leading-[0.85]">
            System <span className="opacity-40">Locations</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: MapPin,
              title: 'Coordinates',
              lines: ['123 Gourmet Avenue', 'Culinary District, NY 10012']
            },
            {
              icon: Clock,
              title: 'Operation Hours',
              lines: ['Daily: 11:00 — 22:00', 'Weekend: 10:00 — 23:00']
            },
            {
              icon: Phone,
              title: 'Emergency Feed',
              lines: ['(555) 123-4567', 'hello@sunflower.com']
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="glass-panel p-10 rounded-[3rem] text-center hover:bg-slate-50 transition-all border border-slate-100 group shadow-lg hover:shadow-2xl">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm group-hover:rotate-12 transition-transform">
                <item.icon className="w-8 h-8 text-kona-teal" />
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-kona-maroon mb-6">
                {item.title}
              </h3>
              {item.lines.map((line, i) => (
                <p key={i} className="text-slate-500 font-medium tracking-wide">
                  {line}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
