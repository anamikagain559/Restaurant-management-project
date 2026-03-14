import React from 'react';
import { User, Phone, Mail, Calendar, Clock, Users } from 'lucide-react';

interface ReservationSectionProps {
  reservation: {
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    guests: string;
  };
  setReservation: React.Dispatch<React.SetStateAction<any>>;
  handleReservationSubmit: (e: React.FormEvent) => void;
  isReserving: boolean;
}

export const ReservationSection: React.FC<ReservationSectionProps> = ({
  reservation,
  setReservation,
  handleReservationSubmit,
  isReserving
}) => {
  return (
    <section id="reservations" className="py-32 bg-slate-950 relative overflow-hidden">
      {/* Dynamic Background Elements - Synced with Hero */}
      <div className="absolute inset-0 bg-mesh opacity-20 mix-blend-overlay"></div>
      
      {/* High-Intensity Organic Glows */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-kona-teal/15 rounded-full blur-[160px] -mr-96 -mt-96 animate-pulse duration-[5000ms]"></div>
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-kona-maroon/15 rounded-full blur-[160px] -ml-96 -mb-96 animate-pulse duration-[7000ms]" style={{ animationDelay: '3s' }}></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="bg-white/[0.03] backdrop-blur-[40px] p-8 md:p-14 lg:p-24 rounded-[4rem] md:rounded-[6rem] border border-white/10 shadow-[0_0_100px_rgba(0,161,142,0.1)] flex flex-col lg:flex-row items-center gap-20 md:gap-32 transition-all duration-700">
          
          <div className="flex-1 w-full relative z-10">
            <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-full bg-kona-teal/10 border border-kona-teal/20 backdrop-blur-2xl text-white text-[10px] font-black uppercase tracking-[0.5em] mb-12 animate-shimmer overflow-hidden">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-kona-teal animate-pulse"></span>
                Reservation System
              </span>
            </div>
            
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-10 tracking-tighter uppercase leading-[0.85]">
              <span className="block italic font-light text-white/50 text-2xl md:text-3xl tracking-[0.2em] mb-4">SECURE YOUR</span>
              <span className="relative bg-gradient-to-br from-white via-white to-kona-teal bg-clip-text text-transparent drop-shadow-[0_10px_30px_rgba(0,161,142,0.3)]">
                GUEST EXPERIENCE
                <span className="absolute -inset-x-8 top-1/2 -translate-y-1/2 h-20 bg-kona-teal/5 blur-[60px] -z-10 rounded-full"></span>
              </span>
            </h2>
            
            <p className="text-xl text-white/40 mb-16 max-w-xl leading-relaxed font-light tracking-wide italic">
              Experience the perfect blend of tradition and hospitality. 
              <span className="text-white/60 block mt-4 not-italic font-medium uppercase text-[10px] tracking-[0.4em]">Fill out the details below</span>
            </p>

            <form onSubmit={handleReservationSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              <div className="relative group/field">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-kona-teal transition-all duration-500" />
                <input
                  type="text"
                  required
                  placeholder="FULL NAME"
                  className="w-full bg-white/[0.03] border border-white/20 rounded-3xl pl-16 pr-8 py-6 focus:border-kona-teal/40 focus:bg-white/[0.08] outline-none text-white transition-all font-black text-[11px] uppercase tracking-[0.2em] placeholder:text-white backdrop-blur-md"
                  value={reservation.name}
                  onChange={(e) => setReservation({ ...reservation, name: e.target.value })}
                />
              </div>
              
              <div className="relative group/field">
                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-kona-teal transition-all duration-500" />
                <input
                  type="tel"
                  required
                  placeholder="PHONE NUMBER"
                  className="w-full bg-white/[0.03] border border-white/20 rounded-3xl pl-16 pr-8 py-6 focus:border-kona-teal/40 focus:bg-white/[0.08] outline-none text-white transition-all font-black text-[11px] uppercase tracking-[0.2em] placeholder:text-white backdrop-blur-md"
                  value={reservation.phone}
                  onChange={(e) => setReservation({ ...reservation, phone: e.target.value })}
                />
              </div>
              
              <div className="relative md:col-span-2 group/field">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-kona-teal transition-all duration-500" />
                <input
                  type="email"
                  required
                  placeholder="EMAIL ADDRESS"
                  className="w-full bg-white/[0.03] border border-white/20 rounded-3xl pl-16 pr-8 py-6 focus:border-kona-teal/40 focus:bg-white/[0.08] outline-none text-white transition-all font-black text-[11px] uppercase tracking-[0.2em] placeholder:text-white backdrop-blur-md"
                  value={reservation.email}
                  onChange={(e) => setReservation({ ...reservation, email: e.target.value })}
                />
              </div>
              
              <div className="relative group/field">
                <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-kona-teal transition-all duration-500" />
                <input
                  type="date"
                  required
                  className="w-full bg-white/[0.03] border border-white/20 rounded-3xl pl-16 pr-8 py-6 focus:border-kona-teal/40 focus:bg-white/[0.08] outline-none text-white transition-all font-black text-[11px] uppercase tracking-[0.2em] [color-scheme:dark] backdrop-blur-md"
                  value={reservation.date}
                  onChange={(e) => setReservation({ ...reservation, date: e.target.value })}
                />
              </div>
              
              <div className="relative group/field">
                <Clock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-kona-teal transition-all duration-500" />
                <input
                  type="time"
                  required
                  className="w-full bg-white/[0.03] border border-white/20 rounded-3xl pl-16 pr-8 py-6 focus:border-kona-teal/40 focus:bg-white/[0.08] outline-none text-white transition-all font-black text-[11px] uppercase tracking-[0.2em] [color-scheme:dark] backdrop-blur-md"
                  value={reservation.time}
                  onChange={(e) => setReservation({ ...reservation, time: e.target.value })}
                />
              </div>
              
              <div className="relative md:col-span-2 group/field">
                <Users className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-kona-teal transition-all duration-500" />
                <select
                  className="w-full bg-white/[0.03] border border-white/20 rounded-3xl pl-16 pr-10 py-6 focus:border-kona-teal/40 focus:bg-white/[0.08] outline-none text-white transition-all font-black text-[11px] uppercase tracking-[0.2em] appearance-none cursor-pointer backdrop-blur-md"
                  value={reservation.guests}
                  onChange={(e) => setReservation({ ...reservation, guests: e.target.value })}
                >
                  <option value="" disabled className="bg-slate-900">NUMBER OF GUESTS</option>
                  {[1, 2, 3, 4, 5, 6, 8, 10, 12].map(n => (
                    <option key={n} value={n} className="bg-slate-900">{n} GUESTS</option>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/40 group-focus-within/field:text-kona-teal transition-colors">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isReserving}
                className="md:col-span-2 relative group mt-4 h-24 w-full overflow-hidden rounded-full bg-white font-black text-[12px] uppercase tracking-[0.5em] text-slate-950 transition-all duration-700 hover:scale-105 shadow-[0_20px_50px_rgba(255,255,255,0.15)] hover:shadow-[0_30px_80px_rgba(0,161,142,0.4)] hover:bg-white/90 disabled:opacity-50"
              >
                <div className="relative z-10 flex items-center justify-center gap-4">
                  {isReserving ? 'PROCESSING SEQUENCE...' : 'CONFIRM RESERVATION'}
                  {!isReserving && <span className="w-1.5 h-1.5 rounded-full bg-kona-teal animate-ping"></span>}
                </div>
                <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-kona-teal/20 to-transparent transition-all duration-1000 group-hover:left-full"></div>
              </button>
            </form>
          </div>

          <div className="w-full lg:w-[600px] aspect-[4/5] rounded-[5rem] overflow-hidden border border-white/20 relative group hidden lg:block shadow-3xl">
            <img
              src="https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Luxury Table"
              className="w-full h-full object-cover transition-all duration-[3000ms] scale-100 group-hover:scale-110"
            />
            {/* Real Color Overlay with dynamic lighting */}
            <div className="absolute inset-0 bg-gradient-to-br from-kona-teal/10 via-transparent to-kona-maroon/20 opacity-30 group-hover:opacity-0 transition-opacity duration-1000"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>
            
            {/* Premium Frame Detail */}
            <div className="absolute inset-0 border-[40px] border-slate-950/20 pointer-events-none group-hover:border-slate-950/10 transition-all duration-1000"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
