import { Clock, Navigation, Compass, Star, MapPin, Smile } from 'lucide-react';
import { motion } from 'motion/react';

export default function TimelineSection() {
  const timelineItems = [
    {
      time: 'সকাল ১১:০০ টা',
      title: 'যাত্রারম্ভ ও রেল জার্নি',
      description: 'খুলনা রেলওয়ে স্টেশন থেকে কুয়াশার চাদর ও নির্মল বাতাসে চড়ে ট্রেনযোগে আমাদের রোমাঞ্চকর যাত্রা শুরু হবে। বন্ধু-বান্ধবদের গান ও আড্ডায় মুখরিত থাকবে চারপাশ।',
      icon: <Clock className="w-5 h-5 text-[#F59E0B]" />,
      tag: 'স্টেশন ইভেন্ট'
    },
    {
      time: 'দুপুর ১২:০০ টা',
      title: 'নওয়াপাড়া পৌঁছানো',
      description: 'নওয়াপাড়া (অভয়নগর) স্টেশনে অবতরণ এবং সেখান থেকে বিশেষ গাড়িতে চড়ে মনোরম আকিজ সিটির উদ্দেশ্যে অগ্রগমন।',
      icon: <Navigation className="w-5 h-5 text-[#2DD4BF]" />,
      tag: 'ট্রান্সফার'
    },
    {
      time: 'দুপুর ০১:৩০ টা',
      title: 'যোহরের নামায ও জোয়ারদার মধ্যাহ্নভোজ',
      description: 'ধর্মপ্রাণ সদস্যদের নিভৃতে যোহরের নামায আদায়ের বিরতি। নামাজ শেষে আমাদের জন্য অপেক্ষারত থাকবে মার্কেটিং বিভাগের সুস্বাদু ও আকর্ষণীয় দুপুরের খাবার।',
      icon: <Compass className="w-5 h-5 text-[#F59E0B]" />,
      tag: 'লঞ্চ ব্রেক'
    },
    {
      time: 'দুপুর ০২:৩০ টা',
      title: 'আকিজ সিটি পার্ক ঘুরে দেখা',
      description: 'অত্যಂತ দৃষ্টিনন্দন ও কোলাহলমুক্ত আকিজ সিটির বিভিন্ন দর্শনীয় স্থান ও সুন্দর আর্কিটেকচার ঘুরে দেখা। গ্রুপ ফটোসেশন এবং নানারকম অনাকাঙ্ক্ষিত মধুর স্মৃতি ধারণের সময়।',
      icon: <MapPin className="w-5 h-5 text-[#2DD4BF]" />,
      tag: 'প্রধান আকর্ষণ'
    },
    {
      time: 'বিকাল ০৫:৩০ টা',
      title: 'ফিরতি ট্রেনের উদ্দেশ্যে রওয়ানা',
      description: 'ফটোসেশন ও আড্ডা সমাপ্তি শেষে সুন্দর স্মৃতিগুলোকে বুকে ধারণ করে নওয়াপাড়া রেলস্টেশনের উদ্দেশ্যে আমাদের চমৎকার পথচলা।',
      icon: <Smile className="w-5 h-5 text-[#F59E0B]" />,
      tag: 'ঘরমুখো'
    },
    {
      time: 'সন্ধ্যা ০৬:৩০ টা',
      title: 'খুলনা প্রত্যাবর্তন ও বিদায়',
      description: 'সন্ধ্যা নাগাদ আমাদের চিরচেনা খুলনা রেলওয়ে স্টেশনে পৌঁছানো এবং সুন্দর একটি ভ্রমণের সফল সমাপ্তি শেষে সবার কাছ থেকে বিদায় গ্রহণ।',
      icon: <Star className="w-5 h-5 text-[#2DD4BF]" />,
      tag: 'সমাপ্ত'
    }
  ];

  return (
    <section id="timeline-section" className="py-20 px-4 bg-transparent text-white relative">
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#F59E0B]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-sans tracking-tight">
            ট্যুর <span className="text-[#F59E0B]">শিডিউল টাইমলাইন</span>
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm md:text-base">
            সারাদিনের কর্মপরিকল্পনা নিচে গুছিয়ে দেওয়া হলো যাতে কারোর কোনো বিভ্রান্তি বা বিলম্ব না ঘটে।
          </p>
        </div>

        <div className="relative border-l-2 border-slate-700 ml-4 md:ml-32">
          {timelineItems.map((item, index) => (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={index}
              className="mb-12 last:mb-0 pl-8 relative"
            >
              {/* Outer Left Time Label for wide screens */}
              <div className="hidden md:block absolute right-full mr-12 top-1 text-right w-40">
                <span className="text-[#F59E0B] font-bold block text-base font-mono">{item.time}</span>
                <span className="text-xs text-slate-300 px-2 py-0.5 rounded bg-white/5 border border-white/10 inline-block mt-1">
                  {item.tag}
                </span>
              </div>

              {/* Timeline Connector Dot */}
              <div className="absolute -left-[14px] top-1.5 w-6 h-6 rounded-full bg-slate-950 border-2 border-[#F59E0B] flex items-center justify-center shadow-lg shadow-amber-500/20">
                <span className="h-2 w-2 rounded-full bg-[#F59E0B] animate-pulse" />
              </div>

              {/* Mobile Time label displaying on top */}
              <div className="md:hidden flex items-center gap-2 mb-2">
                <span className="text-[#F59E0B] font-bold text-sm bg-[#F59E0B]/10 px-2 py-1 rounded border border-[#F59E0B]/20">
                  {item.time}
                </span>
                <span className="text-[10px] text-slate-300 px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                  {item.tag}
                </span>
              </div>

              {/* Card Container */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-1.5 rounded-lg bg-slate-800 text-[#2DD4BF]">
                    {item.icon}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold font-sans text-white leading-snug">
                    {item.title}
                  </h3>
                </div>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
