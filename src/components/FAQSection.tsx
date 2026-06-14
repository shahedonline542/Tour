import { useState } from 'react';
import { HelpCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FAQItem } from '../types';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: 'ভ্রমণ বা ট্যুরের সম্ভাব্য মোট খরচ কত হতে পারে?',
      answer: 'আমাদের এই ঘরোয়া ভ্রমণের সম্ভাব্য খরচ জনপ্রতি মাত্র ২৫০ থেকে ৩০০ টাকা নির্ধারিত হয়েছে। এতে যাতায়াত এবং দুপুরের সুস্বাদু প্যাকেট খাবার অন্তর্ভুক্ত রয়েছে।'
    },
    {
      question: 'টাকা জমা দেওয়ার প্রক্রিয়া কী বা কাকে দেবো?',
      answer: 'টাকা সরাসরি ক্যাশ অথবা সুবিধাজনক মোবাইল ব্যাংকিংয়ের (বিকাশ বা নগদ) মাধ্যমে আয়োজক কমিটির প্রতিনিধির কাছে দেওয়া যাবে। বিস্তারিত তথ্যের জন্য আমাদের যোগাযোগ সেকশনে দেওয়া জি এম রবিউল হাসানের নম্বরে (01964334759) যোগাযোগ করুন।'
    },
    {
      question: 'আমরা কীভাবে খুলনা থেকে সেখানে যাবো?',
      answer: 'আমরা খুলনা রেলওয়ে স্টেশন থেকে সকাল ১১ টা নাগাদ একটি সংযোগকারী ট্রেনে চড়ে চমৎকার আড্ডা দিতে দিতে যাত্রা শুরু করবো। ফিরতি পথেও ট্রেনে আসার পরিকল্পনা রয়েছে।'
    },
    {
      question: 'ট্যুরে কি পরিবারের কোনো সদস্যকে সাথে আনা যাবে?',
      answer: 'হ্যাঁ, অবশ্যই! বিশ্ববিদ্যালয়ের বন্ধুদের পাশাপাশি আপনি আপনার পরিবারের ঘনিষ্ঠ সদস্যদেরও সাথে আনতে পারেন। রেজিস্ট্রেশনের সময়ে অবশ্যই পরিবারের সদস্য সংখ্যা নির্দিষ্ট করবেন, যাতে আমরা খাবার ও সামগ্রিক ব্যবস্থাপনা পূর্বেই নির্ভুল হিসেব করতে পারি।'
    },
    {
      question: 'রেজিস্ট্রেশনের শেষ সময় শেষ কবে?',
      answer: 'আয়োজকদের সব প্রস্তুতি এবং খাবারের নিখুঁত অর্ডার দেওয়ার সুবিধার্থে ভ্রমণের অন্তত ২-৩ দিন পূর্বে রেজিস্ট্রেশন সম্পূর্ণ করার আবশ্যিক অনুরোধ জানানো যাচ্ছে।'
    }
  ];

  return (
    <section id="faq-section" className="py-20 px-4 bg-transparent text-white relative">
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-[#2DD4BF]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-sans tracking-tight">
            সাধারণ <span className="text-[#2DD4BF]">জিজ্ঞাসা (FAQ)</span>
          </h2>
          <p className="text-slate-300 text-sm md:text-base">
            ট্যুর সংক্রান্ত আপনার মনে উঁকি দেওয়া কিছু সাধারণ প্রশ্ন এবং সেগুলোর সমাধান নিচে দেওয়া হলো।
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden backdrop-blur-md transition-all duration-300"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors focus:outline-none focus:ring-1 focus:ring-teal-400/50"
                >
                  <div className="flex items-start gap-3.5 pr-4">
                    <HelpCircle className="w-5 h-5 text-[#2DD4BF] shrink-0 mt-1" />
                    <span className="font-semibold text-base md:text-lg text-slate-100 font-sans text-left leading-snug">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronRight
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="p-6 pt-0 border-t border-white/10 text-slate-300 leading-relaxed text-sm md:text-base bg-white/5">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
