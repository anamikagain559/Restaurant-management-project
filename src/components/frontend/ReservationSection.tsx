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
      <div className="absolute inset-0 bg-mesh opacity-10"></div>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="glass-panel p-16 rounded-[4rem] border border-white/10 shadow-glow-teal flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1">
            <div className="text-kona-teal font-black tracking-[0.4em] uppercase text-[10px] mb-6">
              Reservation Systems
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.85]">
              Secure Your <br /> <span className="text-kona-teal">Experience</span>
            </h2>
            <p className="text-white/40 text-lg leading-relaxed font-light mb-12 italic">
              Our reservation algorithm ensures optimal environment and service
              orchestration for your party. Select your coordinates below.
            </p>

            <form onSubmit={handleReservationSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  required
                  placeholder="Guest Name"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-kona-teal outline-none text-white transition-all font-medium text-xs placeholder:text-white/20"
                  value={reservation.name}
                  onChange={(e) => setReservation({ ...reservation, name: e.target.value })}
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="tel"
                  required
                  placeholder="Communication Port"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-kona-teal outline-none text-white transition-all font-medium text-xs placeholder:text-white/20"
                  value={reservation.phone}
                  onChange={(e) => setReservation({ ...reservation, phone: e.target.value })}
                />
              </div>
              <div className="relative md:col-span-2">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  required
                  placeholder="Digital Signaling (Email)"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-kona-teal outline-none text-white transition-all font-medium text-xs placeholder:text-white/20"
                  value={reservation.email}
                  onChange={(e) => setReservation({ ...reservation, email: e.target.value })}
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="date"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-kona-teal outline-none text-white transition-all font-medium text-xs [color-scheme:dark]"
                  value={reservation.date}
                  onChange={(e) => setReservation({ ...reservation, date: e.target.value })}
                />
              </div>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="time"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-kona-teal outline-none text-white transition-all font-medium text-xs [color-scheme:dark]"
                  value={reservation.time}
                  onChange={(e) => setReservation({ ...reservation, time: e.target.value })}
                />
              </div>
              <div className="relative md:col-span-2">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <select
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-kona-teal outline-none text-white transition-all font-medium text-xs appearance-none"
                  value={reservation.guests}
                  onChange={(e) => setReservation({ ...reservation, guests: e.target.value })}
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10, 12].map(n => (
                    <option key={n} value={n} className="bg-slate-900">{n} Participants</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={isReserving}
                className="md:col-span-2 w-full bg-white text-slate-950 py-6 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] hover:scale-[1.02] transition-all shadow-glow disabled:opacity-50"
              >
                {isReserving ? 'Processing Sequence...' : 'Initialize Booking'}
              </button>
            </form>
          </div>

          <div className="w-full lg:w-1/3 aspect-square rounded-[3rem] overflow-hidden border-8 border-white/5 relative group">
            <img
              src="https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Luxury Table"
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-60"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
