import { motion } from 'motion/react';
import { Calendar, MapPin, Navigation } from 'lucide-react';

interface HeroSectionProps {
  onRegisterClick: () => void;
}

export default function HeroSection({ onRegisterClick }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden py-24 md:py-32 flex flex-col items-center justify-center text-center px-4 bg-transparent">
      {/* Background Decorative Rings/Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2DD4BF]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#F59E0B]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 text-[#2DD4BF] text-sm font-medium mb-6 backdrop-blur-md"
      >
        <span className="flex h-2 w-2 rounded-full bg-[#2DD4BF] animate-pulse" />
        ট্যুর রেজিস্ট্রেশন চলছে
      </motion.div>

      {/* Main Titles */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-3xl mb-4 font-sans drop-shadow-md"
      >
        ইনফরমাল ডিপার্টমেন্ট <span className="text-[#F59E0B]">ট্যুর ২০২৬</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-lg md:text-xl text-slate-300 font-medium mb-10 max-w-xl"
      >
        মার্কেটিং বিভাগ
        <br />
        <span className="text-[#2DD4BF] font-semibold text-xl md:text-2xl">আযমখান সরকারি কমার্স কলেজ</span>
      </motion.p>

      {/* Badges/Details Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl w-full mb-12"
      >
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-left">
          <div className="p-3 rounded-xl bg-[#F59E0B]/20 text-[#F59E0B]">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs">ভ্রমণের তারিখ</p>
            <p className="text-white font-semibold text-base">২০ জুন, শনিবার</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-left">
          <div className="p-3 rounded-xl bg-[#2DD4BF]/20 text-[#2DD4BF]">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs">ভ্রমণ স্থান</p>
            <p className="text-white font-semibold text-base">আকিজ সিটি, নওয়াপাড়া</p>
          </div>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full"
      >
        <button
          onClick={onRegisterClick}
          id="btn-hero-register"
          className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#2DD4BF] hover:bg-[#2DD4BF]/80 text-[#0A192F] font-extrabold text-lg shadow-lg shadow-teal-500/20 active:scale-95 transition pointer-events-auto cursor-pointer"
        >
          রেজিস্ট্রেশন করুন
        </button>
        <a
          href="#event-details"
          className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 text-white font-semibold text-lg hover:bg-white/15 active:scale-95 transition border border-white/10 flex items-center justify-center gap-2"
        >
          <Navigation className="w-5 h-5 text-[#2DD4BF]" />
          বিস্তারিত দেখুন
        </a>
      </motion.div>
    </section>
  );
}
