import { 
  Calendar,
  Clock,
  MapPin
} from "lucide-react";

export function Events() {
  const eventsList = [
    {
      id: 1,
      title: "Biological Fusion Tasting",
      date: "October 15, 2026",
      time: "19:00 - 22:30",
      location: "Main Dining Hall",
      image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80",
      description: "An exclusive 7-course tasting menu exploring the convergence of biological aesthetics and molecular gastronomy."
    },
    {
      id: 2,
      title: "Neon Synthesis Gala",
      date: "November 02, 2026",
      time: "20:00 - 01:00",
      location: "The Sky Lounge",
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80",
      description: "Our signature annual event featuring luminous cocktails, ambient holographic art, and a curated selection of synth-pop."
    },
    {
      id: 3,
      title: "Chef's Prototype Showcase",
      date: "December 12, 2026",
      time: "18:30 - 21:00",
      location: "Private Conservatory",
      image: "https://images.unsplash.com/photo-1560624052-449f5ddf0f31?w=800&q=80",
      description: "Be the first to taste unreleased prototypes from our culinary lab in an intimate, interactive session with the executive chef."
    }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-64 pb-32 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://i.ibb.co.com/93m8pnrp/slider-bg1-1.webp" 
            className="w-full h-full object-cover opacity-60" 
            alt="Hero Background" 
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950 z-0"></div>
        <div className="absolute inset-0 bg-mesh opacity-20 z-0 mix-blend-overlay"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-2xl text-white/60 text-[10px] font-black uppercase tracking-[0.5em] mb-12 animate-shimmer overflow-hidden">
             <span className="flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-kona-teal animate-pulse"></span>
               Curated Experiences
             </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.85] text-glow">
            Upcoming <br/> <span className="text-kona-teal italic font-light drop-shadow-lg">Events</span>
          </h1>
          <p className="max-w-2xl mx-auto text-white/40 text-lg font-light leading-relaxed italic">
            Join our exclusive gatherings showcasing culinary innovation and biological aesthetics.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 relative z-20 pb-32 -mt-10">
        <div className="space-y-12">
          {eventsList.map((event) => (
            <div key={event.id} className="bg-white rounded-[3rem] overflow-hidden group border border-slate-900 hover:border-black transition-all duration-700 shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] flex flex-col md:flex-row">
              <div className="md:w-2/5 relative overflow-hidden h-72 md:h-auto">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-50/80 via-transparent to-transparent hidden md:block z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-50/80 via-transparent to-transparent md:hidden z-10"></div>
              </div>
              <div className="p-10 md:w-3/5 flex flex-col justify-center relative z-20">
                <div className="flex flex-wrap items-center gap-6 mb-6">
                  <span className="flex items-center gap-2 text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black">
                    <Calendar className="w-4 h-4 text-kona-teal" /> {event.date}
                  </span>
                  <span className="flex items-center gap-2 text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black">
                    <Clock className="w-4 h-4 text-kona-teal" /> {event.time}
                  </span>
                  <span className="flex items-center gap-2 text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black">
                    <MapPin className="w-4 h-4 text-kona-teal" /> {event.location}
                  </span>
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-tighter group-hover:text-kona-teal transition-colors">
                  {event.title}
                </h3>
                <p className="text-slate-500 font-light leading-relaxed italic mb-10">
                  {event.description}
                </p>
                <div>
                  <button className="px-8 py-4 bg-slate-900 rounded-full text-[10px] text-white font-black uppercase tracking-[0.3em] hover:bg-kona-teal transition-all active:scale-95 shadow-xl">
                    Reserve Protocol
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
