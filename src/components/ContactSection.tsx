import { Phone, MessageSquare, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

export default function ContactSection() {
  const contacts = [
    {
      name: 'জি এম রবিউল হাসান',
      role: 'প্রধান সমন্বয়কারী, মার্কেটিং বিভাগ',
      phone: '01964334759',
      whatsapp: '8801964334759',
      imageText: 'RH'
    },
    {
      name: 'পাপড়ি চক্রবর্তী',
      role: 'সমন্বয়কারী, মার্কেটিং বিভাগ',
      phone: '01964334759', // Share coordinated organizer contact or generic help desk
      whatsapp: '8801964334759',
      imageText: 'PC'
    }
  ];

  return (
    <section id="contact-section" className="py-20 px-4 bg-transparent text-white relative">
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#F59E0B]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-sans tracking-tight">
            যেকোনো প্রয়োজনে <span className="text-[#F59E0B]">যোগাযোগ করুন</span>
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm md:text-base">
            ট্যুরে অংশগ্রহণকারী সদস্য সংখ্যা নিশ্চিতকরণ বা পেমেন্ট সংক্রান্ত যেকোনো বিষয়ে আপনার ডিপার্টমেন্ট প্রতিনিধির সাথে সরাসরি কথা বলুন।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {contacts.map((contact, index) => (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={index}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center text-center backdrop-blur-md relative overflow-hidden group"
            >
              {/* Outer decorative light */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#2DD4BF]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#2DD4BF]/10 to-[#F59E0B]/10 border border-white/10 text-white font-bold text-lg flex items-center justify-center font-sans shadow-md mb-4 group-hover:scale-105 transition-transform duration-300">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F59E0B] to-[#2DD4BF]">
                  {contact.imageText}
                </span>
              </div>

              <h3 className="text-lg md:text-xl font-bold font-sans text-slate-100">{contact.name}</h3>
              <p className="text-xs text-slate-400 font-semibold mb-6 uppercase tracking-wider">{contact.role}</p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full mt-auto">
                <a
                  href={`tel:${contact.phone}`}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#2DD4BF] hover:bg-[#2DD4BF]/80 text-[#0A192F] font-bold text-sm flex items-center justify-center gap-2 transition active:scale-95"
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  সরাসরি কল
                </a>
                <a
                  href={`https://wa.me/${contact.whatsapp}`}
                  target="_blank"
                  rel="noreferrer referrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/20 font-bold text-sm flex items-center justify-center gap-2 transition active:scale-95"
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  হোয়াটসঅ্যাপ
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
