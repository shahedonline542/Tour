import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Users, Heart, ClipboardList, Shield, ShieldCheck, Mail, Sparkles, Navigation, Compass } from 'lucide-react';
import { RegistrationData } from './types';
import HeroSection from './components/HeroSection';
import EventDetails from './components/EventDetails';
import TimelineSection from './components/TimelineSection';
import FAQSection from './components/FAQSection';
import RegistrationForm from './components/RegistrationForm';
import ContactSection from './components/ContactSection';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [view, setView] = useState<'user' | 'admin'>('user');
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [appsScriptUrl, setAppsScriptUrl] = useState<string>('');

  // Local storage loading & pre-populating mock records for seamless testing
  useEffect(() => {
    // 1. Get Google Apps Script Web App URL
    const savedUrl = localStorage.getItem('marketing_tour_script_url');
    if (savedUrl) {
      setAppsScriptUrl(savedUrl);
    }

    // 2. Load registrations or pre-populate with mock samples
    const savedRegs = localStorage.getItem('marketing_tour_registrations');
    if (savedRegs) {
      setRegistrations(JSON.parse(savedRegs));
    } else {
      const mockData: RegistrationData[] = [
        {
          id: 'mock_1',
          timestamp: '১৪/৬/২০২৬, সকাল ১০:১৮:৩০',
          name: 'জি এম রবিউল হাসান',
          phone: '01964334759',
          participation: 'yes',
          hasFamily: 'yes',
          familyCount: 1,
          emergencyPhone: '01712345678',
          notes: 'খুলনা স্টেশন থেকে সরাসরি যাত্রা করবো এবং ফিরবো। খাবারের ঝাল কম হলে ভালো হয়।',
          agreement: true
        },
        {
          id: 'mock_2',
          timestamp: '১৪/৬/২০২৬, সকাল ১০:২৫:৪৫',
          name: 'পাপড়ি চক্রবর্তী',
          phone: '01911122233',
          participation: 'yes',
          hasFamily: 'no',
          familyCount: 0,
          emergencyPhone: '01888777666',
          notes: 'আমাদের মার্কেটিং বিভাগের (২য় বর্ষ) সকলের স্বতঃস্ফূর্ত অংশগ্রহণ কামনা করছি!',
          agreement: true
        }
      ];
      localStorage.setItem('marketing_tour_registrations', JSON.stringify(mockData));
      setRegistrations(mockData);
    }

    // 3. Simple URL router mapping
    const handleUrlChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/admin' || hash === '#admin') {
        setView('admin');
      } else {
        setView('user');
      }
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const handleNewRegistration = (newData: RegistrationData) => {
    setRegistrations((prev) => [newData, ...prev]);
  };

  const handleUpdateRegistration = (updatedReg: RegistrationData) => {
    setRegistrations((prev) => {
      const newList = prev.map((r) => (r.id === updatedReg.id ? updatedReg : r));
      localStorage.setItem('marketing_tour_registrations', JSON.stringify(newList));
      return newList;
    });
  };

  const handleDeleteRegistration = (id: string) => {
    setRegistrations((prev) => {
      const newList = prev.filter((r) => r.id !== id);
      localStorage.setItem('marketing_tour_registrations', JSON.stringify(newList));
      return newList;
    });
  };

  const handleRefreshData = () => {
    const savedRegs = localStorage.getItem('marketing_tour_registrations');
    if (savedRegs) {
      setRegistrations(JSON.parse(savedRegs));
    }
  };

  const handleClearLocalData = () => {
    localStorage.removeItem('marketing_tour_registrations');
    setRegistrations([]);
  };

  const handleUpdateAppsScriptUrl = (url: string) => {
    localStorage.setItem('marketing_tour_script_url', url);
    setAppsScriptUrl(url);
  };

  const scrollToRegistration = () => {
    const el = document.getElementById('registration-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0A192F] text-white flex flex-col justify-between selection:bg-[#F59E0B]/30 relative overflow-hidden font-sans">
      {/* Background Mesh Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#2DD4BF] rounded-full blur-[150px] opacity-[0.12] pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-[#F59E0B] rounded-full blur-[150px] opacity-[0.08] pointer-events-none z-0"></div>

      {/* Dynamic Main Header Navigation */}
      <header className="sticky top-0 z-50 bg-[#0A192F]/65 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center relative z-10">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => { window.location.hash = ''; setView('user'); }}>
            <div className="w-10 h-10 rounded-xl bg-[#F59E0B] flex items-center justify-center text-[#0A192F] shadow-lg shadow-amber-500/20">
              <Compass className="w-5.5 h-5.5 animate-[spin_25s_linear_infinite]" />
            </div>
            <div>
              <span className="font-extrabold text-sm md:text-base block font-sans tracking-tight text-white">
                মার্কেটিং ২য় বর্ষ ট্যুর ২০২৬
              </span>
              <span className="text-[10px] md:text-xs text-[#2DD4BF] block font-medium tracking-wide">
                আযমখান সরকারি কমার্স কলেজ
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-4">
            {view === 'user' ? (
              <>
                <a
                  href="#event-details"
                  className="hidden md:inline-block text-sm font-semibold text-slate-300 hover:text-[#2DD4BF] transition"
                >
                  বিস্তারিত
                </a>
                <a
                  href="#timeline-section"
                  className="hidden md:inline-block text-sm font-semibold text-slate-300 hover:text-[#2DD4BF] transition"
                >
                  সময়সূচী
                </a>
                <a
                  href="#faq-section"
                  className="hidden md:inline-block text-sm font-semibold text-slate-300 hover:text-[#2DD4BF] transition"
                >
                  জিজ্ঞাসা
                </a>
                <button
                  onClick={scrollToRegistration}
                  id="header-register-btn"
                  className="px-5 py-2.5 rounded-full bg-[#2DD4BF] hover:bg-[#2DD4BF]/80 text-[#0A192F] font-bold text-sm shadow-lg shadow-teal-500/10 active:scale-95 transition cursor-pointer"
                >
                  সিট বুকিং
                </button>
              </>
            ) : (
              <button
                onClick={() => { window.location.hash = ''; setView('user'); }}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/10 transition cursor-pointer"
              >
                ইউজার পেইজ
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Body Switcher with smooth Fade-In Animations */}
      <main className="flex-grow relative z-10">
        <AnimatePresence mode="wait">
          {view === 'user' ? (
            <motion.div
              key="user-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Hero Section */}
              <HeroSection onRegisterClick={scrollToRegistration} />

              {/* Department Statistics Ribbon */}
              <section className="bg-white/5 border-y border-white/10 py-8 px-4 text-center backdrop-blur-md relative z-10 my-4 shadow-lg shadow-black/10">
                <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <h4 className="text-2xl md:text-3xl font-extrabold text-[#F59E0B] font-mono">২০ জুন</h4>
                    <p className="text-xs text-slate-300 mt-1 font-medium">ভ্রমণ ও আড্ডা</p>
                  </div>
                  <div>
                    <h4 className="text-2xl md:text-3xl font-extrabold text-[#2DD4BF] font-mono">আকিজ সিটি</h4>
                    <p className="text-xs text-slate-300 mt-1 font-medium">অনিন্দ্য বিনোদন স্পট</p>
                  </div>
                  <div>
                    <h4 className="text-2xl md:text-3xl font-extrabold text-[#2DD4BF] font-mono">১১:০০ AM</h4>
                    <p className="text-xs text-slate-300 mt-1 font-medium">বিদায় খুলনা রেলস্টেশন</p>
                  </div>
                  <div>
                    <h4 className="text-2xl md:text-3xl font-extrabold text-[#F59E0B] font-mono">২৫০-৩০০ BDT</h4>
                    <p className="text-xs text-slate-300 mt-1 font-medium">সম্ভাব্য জনপ্রতি বাজেট</p>
                  </div>
                </div>
              </section>

              {/* Important Info / Event Details section */}
              <EventDetails />

              {/* Timeline Section */}
              <TimelineSection />

              {/* Form Section */}
              <RegistrationForm appsScriptUrl={appsScriptUrl} onSuccess={handleNewRegistration} />

              {/* FAQ Accordion Section */}
              <FAQSection />
            </motion.div>
          ) : (
            <motion.div
              key="admin-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AdminDashboard
                registrations={registrations}
                onRefresh={handleRefreshData}
                onClearAll={handleClearLocalData}
                appsScriptUrl={appsScriptUrl}
                onUpdateUrl={handleUpdateAppsScriptUrl}
                onUpdateRegistration={handleUpdateRegistration}
                onDeleteRegistration={handleDeleteRegistration}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Area with hidden Admin trigger */}
      <footer className="bg-[#0A192F]/80 border-t border-white/10 backdrop-blur-md py-10 px-6 text-slate-300 text-sm relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          {/* Logo Brand Footer */}
          <div>
            <div className="flex items-center gap-2 justify-center md:justify-start mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
              <p className="font-bold text-white tracking-wide font-sans">মার্কেটিং বিভাগ (২য় বর্ষ), আযমখান কমার্স কলেজ</p>
            </div>
            <p className="text-xs text-slate-400 font-medium tracking-tight mb-2.5">Built for Marketing Dept • Azam Khan Gov Commerce College</p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-[#2DD4BF] text-xs font-bold shadow-md shadow-teal-500/5">
              <span className="flex h-1.5 w-1.5 rounded-full bg-[#2DD4BF] animate-pulse" />
              Developed by Sk Shahed
            </div>
          </div>

          {/* Special Quick Actions & Link to Hidden Admin */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <span className="hidden sm:inline-block text-white/10">|</span>
            <button
              onClick={() => {
                if (view === 'user') {
                  window.location.hash = 'admin';
                  setView('admin');
                } else {
                  window.location.hash = '';
                  setView('user');
                }
              }}
              className="text-slate-300 hover:text-[#2DD4BF] transition flex items-center gap-1.5 font-bold cursor-pointer bg-transparent border-none outline-none"
            >
              <Shield className="w-3.5 h-3.5 text-[#2DD4BF]" />
              অ্যাডমিন পোর্টাল
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
