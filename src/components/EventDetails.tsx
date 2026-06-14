import { Calendar, Compass, MapPin, Coffee, Train, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';

export default function EventDetails() {
  const details = [
    {
      icon: <Calendar className="w-6 h-6 text-[#F59E0B]" />,
      title: 'তারিখ ও দিন',
      desc: '২০ জুন, শনিবার',
      badge: '২০২৬',
      bg: 'bg-white/5 border-white/10 hover:border-[#F59E0B]/30'
    },
    {
      icon: <Train className="w-6 h-6 text-[#2DD4BF]" />,
      title: 'যাত্রার সময় ও স্থান',
      desc: 'সকাল ১১:০০ টা',
      subDesc: 'খুলনা রেলওয়ে স্টেশন থেকে যাত্রা',
      badge: 'রেল ভ্রমণ',
      bg: 'bg-white/5 border-white/10 hover:border-[#2DD4BF]/30'
    },
    {
      icon: <MapPin className="w-6 h-6 text-[#F59E0B]" />,
      title: 'গন্তব্যস্থল',
      desc: 'আকিজ সিটি, নওয়াপাড়া',
      subDesc: 'অভয়নগর, যশোর',
      badge: 'মনোরম পরিবেশ',
      bg: 'bg-white/5 border-white/10 hover:border-[#F59E0B]/30'
    },
    {
      icon: <Coffee className="w-6 h-6 text-[#2DD4BF]" />,
      title: 'খাবারের ব্যবস্থা',
      desc: 'মধ্যাহ্নভোজ ও নাস্তা',
      subDesc: 'দুপুরের সুস্বাদু খাবারের সুব্যবস্থা',
      badge: 'ফ্রি মিল',
      bg: 'bg-white/5 border-white/10 hover:border-[#2DD4BF]/30'
    },
    {
      icon: <Compass className="w-6 h-6 text-[#F59E0B]" />,
      title: 'প্রত্যাবর্তন',
      desc: 'সন্ধ্যায় খুলনা প্রত্যাবর্তন',
      subDesc: 'একই দিনে নিরাপদ ফিরে আসা',
      badge: 'বিকেল/সন্ধ্যা',
      bg: 'bg-white/5 border-white/10 hover:border-[#F59E0B]/30'
    },
    {
      icon: <DollarSign className="w-6 h-6 text-[#2DD4BF]" />,
      title: 'সম্ভাব্য খরচ',
      desc: '২৫০ থেকে ৩০০ টাকা মাত্র',
      subDesc: 'জনপ্রতি নামমাত্র চাঁদা',
      badge: 'জনপ্রতি',
      bg: 'bg-white/5 border-white/10 hover:border-[#2DD4BF]/30'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80 } }
  };

  return (
    <section id="event-details" className="py-20 px-4 bg-transparent text-white relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#2DD4BF]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-sans tracking-tight">
            ট্যুর সংক্রান্ত <span className="text-[#2DD4BF]">গুরুত্বপূর্ণ তথ্য</span>
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm md:text-base">
            আমাদের মার্কেটিং বিভাগের (২য় বর্ষ) জমকালো ও ইনফরমাল ভ্রমণের যাবতীয় বিবরণ নিচে দেওয়া হলো। সম্পূর্ণ পরিকল্পনাটি সকলের সুবিধা বিবেচনায় করা হয়েছে।
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {details.map((detail, index) => (
            <motion.div
              variants={itemVariants}
              key={index}
              className={`p-6 rounded-2xl bg-white/5 border backdrop-blur-md hover:translate-y-[-4px] transition-all duration-300 ${detail.bg} group`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/5 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  {detail.icon}
                </div>
                {detail.badge && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-slate-300 font-medium">
                    {detail.badge}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-1 font-sans">{detail.title}</h3>
              <p className="text-white font-bold text-lg mb-1 leading-relaxed">{detail.desc}</p>
              {detail.subDesc && <p className="text-slate-300 text-sm">{detail.subDesc}</p>}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
