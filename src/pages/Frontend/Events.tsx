import { useState, useEffect } from "react";
import { 
  Calendar,
  Clock,
  MapPin,
  MenuIcon,
  X,
  LayoutDashboard,
  LogOut,
  Instagram,
  Facebook,
  Twitter,
  Phone
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useCurrentUser, logout } from "../../redux/features/auth/authSlice";
import logo from "../../assets/logo.png";

export function Events() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(useCurrentUser);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navItems = ["Home", "About", "Menu", "Events", "Contact"];

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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-slate-900/50 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] py-3 m-4 rounded-3xl' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex justify-between items-center text-glow">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="relative w-14 h-14 animate-float">
              <img 
                src={logo} 
                alt="Sunflower Logo" 
                className="w-full h-full object-cover rounded-full border-2 border-white/50 shadow-[0_0_30px_rgba(255,255,255,0.3)] group-hover:rotate-12 transition-transform duration-700"
              />
              <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse"></div>
            </div>
            <span className="text-3xl font-black tracking-tighter text-white drop-shadow-lg">
              SUNFLOWER
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => {
                  if (item === 'Home') navigate('/');
                  else if (item === 'Menu') navigate('/menu');
                  else if (item === 'Events') navigate('/events');
                  else navigate('/');
                }}
                className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:scale-110 ${item === 'Events' ? 'text-white border-b-2 border-white pb-1' : 'text-white/90 hover:text-white'}`}
              >
                {item}
              </button>
            ))}

            {user ? (
              <div className="flex items-center gap-4 border-l border-white/20 pl-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/90 hover:text-white transition-all">
                  <LayoutDashboard className="w-4 h-4" /> Portal
                </button>
                <button
                  onClick={handleLogout}
                  className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-white hover:bg-white hover:text-kona-maroon transition-all">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="text-[10px] font-black uppercase tracking-[0.3em] text-white/90 hover:text-white transition-all">
                Login
              </button>
            )}

          </div>

          {/* Mobile Menu Button  */}
          <button
            className="md:hidden w-12 h-12 glass-card flex items-center justify-center text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </nav>

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

      {/* Footer - AI Premium */}
      <footer className="bg-slate-950 text-white pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-5"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32">
            <div>
              <div className="flex items-center gap-4 mb-10">
                <div className="w-16 h-16 glass-card rounded-full p-1 border border-white/20">
                  <img src="https://images.unsplash.com/photo-1597843798133-e157ad0563f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" alt="Logo" className="w-full h-full object-cover rounded-full" />
                </div>
                <h3 className="text-4xl font-black tracking-tighter text-glow">SUNFLOWER</h3>
              </div>
              <p className="text-white/30 text-lg font-light leading-relaxed max-w-md italic mb-12">
                Merging biological aesthetics with technological precision. 
                Experience the next iteration of culinary excellence.
              </p>
              <div className="flex gap-4">
                {[Instagram, Facebook, Twitter].map((Icon, i) => (
                  <button key={i} className="w-12 h-12 glass-card rounded-full flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 transition-all hover:scale-110">
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
                        onClick={() => {
                          if (item === 'Home') navigate('/');
                          else if (item === 'Menu') navigate('/menu');
                          else if (item === 'Events') navigate('/events');
                          else if (item === 'Contact') navigate('/contact');
                          else { navigate(`/#${item.toLowerCase()}`); setIsMobileMenuOpen(false); }
                        }}
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
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-kona-teal mb-8">Connect</h4>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4 group">
                    <MapPin className="w-5 h-5 text-white/20 group-hover:text-kona-teal transition-colors" />
                    <span className="text-xs text-white/40 leading-relaxed font-light">Biological District 01,<br/>Global Synthesis Park</span>
                  </li>
                  <li className="flex items-center gap-4 group">
                    <Phone className="w-5 h-5 text-white/20 group-hover:text-kona-teal transition-colors" />
                    <span className="text-xs text-white/40 font-light">+1 (555) AI-EXPERIENCE</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/10">
              &copy; {new Date().getFullYear()} SUNFLOWER SYNDICATE. ALL RIGHTS RESERVED.
            </p>
            <div className="flex gap-10 text-[9px] font-black uppercase tracking-[0.4em] text-white/20">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
