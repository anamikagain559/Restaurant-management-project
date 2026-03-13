import { useState, useEffect } from "react";
import { 
  MenuIcon,
  X,
  LayoutDashboard,
  LogOut,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useCurrentUser, logout } from "../../redux/features/auth/authSlice";
import logo from "../../assets/logo.png";
import Swal from "sweetalert2";

export function Contact() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(useCurrentUser);

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

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

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    Swal.fire({
      title: 'Message Sent',
      text: 'Our AI concierge has received your transmission. We will respond shortly.',
      icon: 'success',
      confirmButtonColor: '#0d9488',
      background: '#020617',
      color: '#fff',
      customClass: {
        popup: 'rounded-[2rem] border border-white/10 shadow-glow-teal',
        confirmButton: 'rounded-xl px-8 py-3 font-bold uppercase tracking-widest text-xs'
      }
    });
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  const navItems = ["Home", "About", "Menu", "Events", "Contact"];

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
                  else if (item === 'Contact') navigate('/contact');
                  else navigate('/');
                }}
                className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:scale-110 ${item === 'Contact' ? 'text-white border-b-2 border-white pb-1' : 'text-white/90 hover:text-white'}`}
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

          {/* Mobile Menu Button */}
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
               Establish Connection
             </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.85] text-glow">
            Contact <br/> <span className="text-kona-teal italic font-light drop-shadow-lg">Protocol</span>
          </h1>
          <p className="max-w-2xl mx-auto text-white/40 text-lg font-light leading-relaxed italic">
            Initiate a dialogue with our concierge team. We anticipate your arrival.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 relative z-20 pb-32 -mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Details */}
          <div className="space-y-8">
            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 hover:border-slate-200 transition-all duration-700 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-kona-teal to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <h3 className="text-3xl font-black text-slate-900 mb-8 uppercase tracking-tighter">Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-6 group/item cursor-pointer">
                  <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center group-hover/item:border-kona-teal transition-colors">
                    <MapPin className="w-6 h-6 text-kona-teal" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Coordinates</h4>
                    <p className="text-slate-800 font-medium tracking-wide">123 Cyber Avenue, Neo-Tokyo District 9</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 group/item cursor-pointer">
                  <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center group-hover/item:border-kona-teal transition-colors">
                    <Phone className="w-6 h-6 text-kona-teal" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Frequency</h4>
                    <p className="text-slate-800 font-medium tracking-wide">+880 1234 567 890</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 group/item cursor-pointer">
                  <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center group-hover/item:border-kona-teal transition-colors">
                    <Mail className="w-6 h-6 text-kona-teal" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Transmission</h4>
                    <p className="text-slate-800 font-medium tracking-wide">concierge@sunflower.ai</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-slate-100">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Social Network Integrations</h4>
                <div className="flex gap-4">
                  <a href="#" className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-kona-teal hover:border-kona-teal transition-all border border-slate-100">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-kona-teal hover:border-kona-teal transition-all border border-slate-100">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="#" className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-kona-teal hover:border-kona-teal transition-all border border-slate-100">
                    <Twitter className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-[3rem] p-10 border border-slate-100 hover:border-slate-200 transition-all duration-700 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-kona-teal/10 blur-[100px] leading-none rounded-full pointer-events-none"></div>
            
            <h3 className="text-3xl font-black text-slate-900 mb-8 uppercase tracking-tighter">Send Transmission</h3>
            
            <form onSubmit={handleContactSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Identity</label>
                  <input 
                    type="text" 
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-kona-teal focus:ring-4 focus:ring-kona-teal/10 transition-all font-medium tracking-wide"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Email Uplink</label>
                  <input 
                    type="email" 
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-kona-teal focus:ring-4 focus:ring-kona-teal/10 transition-all font-medium tracking-wide"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Subject</label>
                <input 
                  type="text" 
                  required
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-kona-teal focus:ring-4 focus:ring-kona-teal/10 transition-all font-medium tracking-wide"
                  placeholder="Inquiry Topic"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Message Body</label>
                <textarea 
                  required
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-kona-teal focus:ring-4 focus:ring-kona-teal/10 transition-all font-medium tracking-wide resize-none"
                  placeholder="Enter your message sequence here..."
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full group relative overflow-hidden rounded-2xl bg-slate-900 text-white px-8 py-5 flex justify-center items-center gap-4 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-kona-teal to-teal-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></div>
                <span className="relative z-10 text-xs font-black tracking-[0.3em] uppercase">Initialize Transfer</span>
                <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </button>
            </form>
          </div>

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
