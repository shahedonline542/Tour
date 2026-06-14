import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Phone, CheckCircle, AlertCircle, HelpCircle, Loader2, Users } from 'lucide-react';
import { RegistrationData } from '../types';

interface RegistrationFormProps {
  appsScriptUrl: string;
  onSuccess: (newData: RegistrationData) => void;
}

export default function RegistrationForm({ appsScriptUrl, onSuccess }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    participation: 'yes' as 'yes' | 'no' | 'maybe',
    hasFamily: 'no' as 'yes' | 'no',
    familyCount: 0,
    emergencyPhone: '',
    notes: '',
    agreement: false,
    paidAlready: 'no' as 'yes' | 'no',
    paymentMethod: '' as 'bKash' | 'Nagad' | 'Upay' | 'Rocket' | '',
    paidAmount: '',
    transactionId: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const phoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'দয়া করে আপনার পূর্ণ নাম লিখুন';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'নামটি অন্তত ৩টি অক্ষরের হতে হবে';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'মোবাইল নম্বরটি আবশ্যক';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = 'দয়া করে একটি সঠিক ১১ ডিজিটের মোবাইল নম্বর লিখুন (যেমন: 01712345678)';
    }

    if (!formData.emergencyPhone.trim()) {
      newErrors.emergencyPhone = 'জরুরি যোগাযোগ নম্বর আবশ্যক';
    } else if (!phoneRegex.test(formData.emergencyPhone.trim())) {
      newErrors.emergencyPhone = 'একটি সচল ১১ ডিজিটের জরুরি মোবাইল নম্বর লিখুন';
    } else if (formData.emergencyPhone.trim() === formData.phone.trim()) {
      newErrors.emergencyPhone = 'জরুরি নম্বরটি আপনার নিজের মোবাইল নম্বর থেকে ভিন্ন হতে হবে';
    }

    if (formData.hasFamily === 'yes' && (formData.familyCount <= 0 || isNaN(formData.familyCount))) {
      newErrors.familyCount = 'দয়া করে পরিবারের সদস্য সংখ্যা লিখুন (ন্যূনতম ১)';
    }

    if (formData.paidAlready === 'yes') {
      if (!formData.paymentMethod) {
        newErrors.paymentMethod = 'দয়া করে পেমেন্ট মাধ্যম নির্বাচন করুন';
      }
      if (!formData.paidAmount.trim()) {
        newErrors.paidAmount = 'দয়া করে পেমেন্টের পরিমাণ লিখুন';
      } else if (isNaN(Number(formData.paidAmount.trim())) || Number(formData.paidAmount.trim()) <= 0) {
        newErrors.paidAmount = 'দয়া করে একটি সঠিক সংখ্যা লিখুন';
      }
      if (!formData.transactionId.trim()) {
        newErrors.transactionId = 'দয়া করে Transaction ID লিখুন';
      }
    }

    if (!formData.agreement) {
      newErrors.agreement = 'আয়োজকদের নির্দেশনা মেনে চলতে আপনাকে একমত হতে হবে';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
      if (checked) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    }
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // reset family count if hasFamily changes to no
      if (name === 'hasFamily' && value === 'no') {
        updated.familyCount = 0;
      }
      return updated;
    });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      // scroll to first error
      const firstErrorEl = document.querySelector('.text-rose-400');
      if (firstErrorEl) {
        firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const submissionData: RegistrationData = {
      id: 'reg_' + Date.now(),
      timestamp: new Date().toLocaleString('bn-BD', { timeZone: 'Asia/Dhaka' }),
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      participation: formData.participation,
      hasFamily: formData.hasFamily,
      familyCount: formData.hasFamily === 'yes' ? Number(formData.familyCount) : 0,
      emergencyPhone: formData.emergencyPhone.trim(),
      notes: formData.notes.trim(),
      agreement: formData.agreement,
      paidAlready: formData.paidAlready,
      paymentMethod: formData.paidAlready === 'yes' ? formData.paymentMethod : '',
      paidAmount: formData.paidAlready === 'yes' ? formData.paidAmount.trim() : '',
      transactionId: formData.paidAlready === 'yes' ? formData.transactionId.trim() : '',
      adminPaymentStatus: formData.paidAlready === 'yes' ? 'Pending' : 'Unpaid'
    };

    try {
      // 1. Submit to our central Express Server Backend
      const serverRes = await fetch('/api/registrations/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!serverRes.ok) {
        throw new Error('সার্ভারে ডেটা পাঠাতে ব্যর্থ হয়েছে!');
      }

      const responseJson = await serverRes.json();
      const finalSubmission = responseJson.data || submissionData;

      // 2. Double save in local storage first to always guarantee storage as fallback
      const existing = localStorage.getItem('marketing_tour_registrations');
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(finalSubmission);
      localStorage.setItem('marketing_tour_registrations', JSON.stringify(list));

      // Success
      setIsSuccess(true);
      onSuccess(finalSubmission);
      // Reset form
      setFormData({
        name: '',
        phone: '',
        participation: 'yes',
        hasFamily: 'no',
        familyCount: 0,
        emergencyPhone: '',
        notes: '',
        agreement: false,
        paidAlready: 'no',
        paymentMethod: '',
        paidAmount: '',
        transactionId: ''
      });
    } catch (e: any) {
      console.error('Submission failed', e);
      // Even if network fails, we recorded locally, but indicate network state
      setSubmitError('সার্ভারে ডেটা পাঠাতে সমস্যা হয়েছে। তবে চিন্তা করবেন না, আমরা ডেটাটি সাময়িকভাবে ব্রাউজারে সংরক্ষণ করেছি।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="registration-section" className="py-24 px-4 bg-transparent text-white">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B] text-xs font-semibold uppercase tracking-wider mb-3">
            রেজিস্ট্রেশন ফরম
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-sans tracking-tight mb-3">
            আপনার <span className="text-[#F59E0B]">আসনটি নিশ্চিত</span> করুন
          </h2>
          <p className="text-slate-300 text-sm md:text-base">
            নিচের তথ্যগুলো সতর্কতার সাথে পূরণ করুন। লাল তারকা (*) চিহ্নিত ফিল্ডগুলো অবশ্যই পূরণীয়।
          </p>
        </div>

        <div className="p-8 pb-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F59E0B]/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#2DD4BF]/5 rounded-full blur-2xl pointer-events-none" />

          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-10"
              >
                <div className="w-20 h-20 bg-teal-500/10 border border-teal-500/30 text-teal-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-teal-500/5">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 font-sans">অভিনন্দন!</h3>
                <p className="text-slate-200 text-base leading-relaxed mb-8">
                  ধন্যবাদ। আপনার রেজিস্ট্রেশন সফলভাবে গ্রহণ করা হয়েছে। ট্যুর সংক্রান্ত পরবর্তী তথ্য WhatsApp অথবা সরাসরি যোগাযোগের মাধ্যমে জানানো হবে।
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 text-white text-sm font-semibold border border-white/5 transition active:scale-95 cursor-pointer"
                >
                  আরেকটি রেজিস্ট্রেশন করুন
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {submitError && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-sm flex gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* 1. Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-200">
                    ১. পূর্ণ নাম <span className="text-rose-400 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="আপনার পূর্ণ নাম টাইপ করুন..."
                      className={`w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-950/40 border ${errors.name ? 'border-rose-500 shadow-sm shadow-rose-500/10' : 'border-white/10 hover:border-white/20' } text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 font-sans text-sm md:text-base transition`}
                    />
                  </div>
                  {errors.name && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-rose-400 text-xs md:text-sm font-medium flex items-center gap-1.5 mt-1">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {errors.name}
                    </motion.p>
                  )}
                </div>

                {/* 2. Phone */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-semibold text-slate-200">
                    ২. মোবাইল নম্বর <span className="text-rose-400 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-5 h-5" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="যেমন: 019xxxxxxxx"
                      className={`w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-950/40 border ${errors.phone ? 'border-rose-500 shadow-sm shadow-rose-500/10' : 'border-white/10 hover:border-white/20' } text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 font-sans text-sm md:text-base transition`}
                    />
                  </div>
                  {errors.phone && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-rose-400 text-xs md:text-sm font-medium flex items-center gap-1.5 mt-1">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {errors.phone}
                    </motion.p>
                  )}
                </div>

                {/* 3. Participation */}
                <div className="space-y-2.5">
                  <label className="block text-sm font-semibold text-slate-200">
                    ৩. আপনি কি ট্যুরে অংশগ্রহণ করবেন? <span className="text-rose-400 font-bold">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'part-yes', value: 'yes', label: 'হ্যাঁ' },
                      { id: 'part-no', value: 'no', label: 'না' },
                      { id: 'part-maybe', value: 'maybe', label: 'এখনও নিশ্চিত নই' }
                    ].map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleRadioChange('participation', item.value)}
                        className={`p-3.5 rounded-xl border text-center font-medium cursor-pointer transition select-none flex items-center justify-center gap-2 ${
                          formData.participation === item.value
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/5'
                            : 'bg-slate-950/30 border-white/10 text-slate-300 hover:bg-slate-950/50 hover:border-white/20'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${formData.participation === item.value ? 'border-amber-400' : 'border-slate-500'}`}>
                          {formData.participation === item.value && <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />}
                        </span>
                        <span className="text-sm font-sans">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Family Members */}
                <div className="space-y-2.5">
                  <label className="block text-sm font-semibold text-slate-200">
                    ৪. আপনার সাথে কি পরিবারের কোনো সদস্য থাকবেন?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'fam-yes', value: 'yes', label: 'হ্যাঁ' },
                      { id: 'fam-no', value: 'no', label: 'না' }
                    ].map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleRadioChange('hasFamily', item.value)}
                        className={`p-3.5 rounded-xl border text-center font-medium cursor-pointer transition select-none flex items-center justify-center gap-2 ${
                          formData.hasFamily === item.value
                            ? 'bg-teal-500/20 border-teal-400 text-teal-300 shadow-md shadow-teal-500/5'
                            : 'bg-slate-950/30 border-white/10 text-slate-300 hover:bg-slate-950/50 hover:border-white/20'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${formData.hasFamily === item.value ? 'border-teal-400' : 'border-slate-500'}`}>
                          {formData.hasFamily === item.value && <span className="w-1.5 h-1.5 bg-teal-400 rounded-full" />}
                        </span>
                        <span className="text-sm font-sans">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Conditional Family Member Count */}
                <AnimatePresence>
                  {formData.hasFamily === 'yes' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, scaleY: 0.95 }}
                      animate={{ height: 'auto', opacity: 1, scaleY: 1 }}
                      exit={{ height: 0, opacity: 0, scaleY: 0.95 }}
                      transition={{ duration: 0.25 }}
                      className="origin-top space-y-2 overflow-hidden"
                    >
                      <label htmlFor="familyCount" className="block text-sm font-semibold text-teal-300">
                        ৫. পরিবারের সদস্য সংখ্যা (আপনার বাদে) <span className="text-rose-400 font-bold">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Users className="w-5 h-5 text-teal-400/80" />
                        </div>
                        <input
                          type="number"
                          id="familyCount"
                          name="familyCount"
                          min="1"
                          max="10"
                          value={formData.familyCount || ''}
                          onChange={handleChange}
                          placeholder="পরিবারের সদস্য সংখ্যা লিখুন..."
                          className={`w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-950/40 border ${errors.familyCount ? 'border-rose-500' : 'border-teal-500/30 hover:border-teal-500/50' } text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-400 focus:border-teal-400 font-sans text-sm md:text-base transition`}
                        />
                      </div>
                      {errors.familyCount && (
                        <p className="text-rose-400 text-xs font-medium flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          {errors.familyCount}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 6. Emergency Phone */}
                <div className="space-y-2">
                  <label htmlFor="emergencyPhone" className="block text-sm font-semibold text-slate-200">
                    ৬. জরুরি যোগাযোগ নম্বর <span className="text-rose-400 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-5 h-5" />
                    </div>
                    <input
                      type="tel"
                      id="emergencyPhone"
                      name="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={handleChange}
                      placeholder="যেমন: 018xxxxxxxx (পরিবার বা অভিভাবক)"
                      className={`w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-950/40 border ${errors.emergencyPhone ? 'border-rose-500 shadow-sm shadow-rose-500/10' : 'border-white/10 hover:border-white/20' } text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 font-sans text-sm md:text-base transition`}
                    />
                  </div>
                  {errors.emergencyPhone && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-rose-400 text-xs md:text-sm font-medium flex items-center gap-1.5 mt-1">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {errors.emergencyPhone}
                    </motion.p>
                  )}
                </div>

                {/* 7. Optional Advance Payment Section */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden space-y-4">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#2DD4BF]/5 rounded-full blur-xl pointer-events-none" />
                  
                  <div className="flex items-center gap-2 text-[#2DD4BF] font-extrabold text-base border-b border-white/5 pb-2.5">
                    <span className="text-xl">💳</span>
                    <span>৭. অগ্রিম পেমেন্ট (ঐচ্ছিক)</span>
                  </div>

                  <div className="space-y-1 text-sm text-slate-300">
                    <p className="font-bold flex justify-between">
                      <span>পেমেন্ট নম্বর:</span>
                      <span className="text-amber-400 select-all font-mono text-base">01838393330</span>
                    </p>
                    <p className="text-xs text-slate-400 font-medium">
                      bKash / Nagad / Upay / Rocket (Personal)
                    </p>
                  </div>

                  <div className="space-y-3 pt-1">
                    <p className="block text-sm font-semibold text-slate-200">
                      আপনি কি অগ্রিম পেমেন্ট করেছেন?
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleRadioChange('paidAlready', 'yes')}
                        className={`py-3.5 px-4 rounded-xl text-sm font-bold border transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                          formData.paidAlready === 'yes'
                            ? 'bg-[#2DD4BF]/20 border-[#2DD4BF] text-white shadow-lg'
                            : 'bg-slate-950/20 border-white/10 hover:border-white/20 text-slate-400'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${formData.paidAlready === 'yes' ? 'border-[#2DD4BF]' : 'border-slate-500'}`}>
                          {formData.paidAlready === 'yes' && <span className="w-2 h-2 rounded-full bg-[#2DD4BF]" />}
                        </span>
                        হ্যাঁ
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRadioChange('paidAlready', 'no')}
                        className={`py-3.5 px-4 rounded-xl text-sm font-bold border transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                          formData.paidAlready === 'no'
                            ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg'
                            : 'bg-slate-950/20 border-white/10 hover:border-white/20 text-slate-400'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${formData.paidAlready === 'no' ? 'border-amber-500' : 'border-slate-500'}`}>
                          {formData.paidAlready === 'no' && <span className="w-2 h-2 rounded-full bg-amber-400" />}
                        </span>
                        না
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {formData.paidAlready === 'yes' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 pt-3 border-t border-white/5 overflow-hidden"
                      >
                        {/* paymentMethod option select buttons */}
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-300">
                            পেমেন্ট মাধ্যম <span className="text-rose-400">*</span>
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {(['bKash', 'Nagad', 'Upay', 'Rocket'] as const).map((method) => (
                              <button
                                key={method}
                                type="button"
                                onClick={() => handleRadioChange('paymentMethod', method)}
                                className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all duration-200 text-center cursor-pointer ${
                                  formData.paymentMethod === method
                                    ? 'bg-[#2DD4BF]/20 border-[#2DD4BF] text-teal-300'
                                    : 'bg-slate-950/30 border-white/5 hover:border-white/10 text-slate-400 font-sans'
                                }`}
                              >
                                {method}
                              </button>
                            ))}
                          </div>
                          {errors.paymentMethod && (
                            <p className="text-rose-400 text-xs font-semibold">{errors.paymentMethod}</p>
                          )}
                        </div>

                        {/* paidAmount input */}
                        <div className="space-y-1.5">
                          <label htmlFor="paidAmount" className="block text-xs font-bold text-slate-300">
                            প্রদত্ত টাকার পরিমাণ (টাকা) <span className="text-rose-400">*</span>
                          </label>
                          <input
                            type="text"
                            id="paidAmount"
                            name="paidAmount"
                            value={formData.paidAmount}
                            onChange={handleChange}
                            placeholder="যেমন: ২৫০ বা ৩০০"
                            className={`w-full px-4 py-2.5 rounded-xl bg-slate-950/40 border ${errors.paidAmount ? 'border-rose-500 shadow-sm shadow-rose-500/10' : 'border-white/10 hover:border-white/20' } text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-400 focus:border-teal-400 font-sans text-sm transition`}
                          />
                          {errors.paidAmount && (
                            <p className="text-rose-400 text-xs font-semibold">{errors.paidAmount}</p>
                          )}
                        </div>

                        {/* Transaction ID input */}
                        <div className="space-y-1.5">
                          <label htmlFor="transactionId" className="block text-xs font-bold text-slate-300">
                            Transaction ID <span className="text-rose-400">*</span>
                          </label>
                          <input
                            type="text"
                            id="transactionId"
                            name="transactionId"
                            value={formData.transactionId}
                            onChange={handleChange}
                            placeholder="বিকাশ বা নগদ ট্রানজেকশন আইডি"
                            className={`w-full px-4 py-2.5 rounded-xl bg-slate-950/40 border ${errors.transactionId ? 'border-rose-500 shadow-sm shadow-rose-500/10' : 'border-white/10 hover:border-white/20' } text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-400 focus:border-teal-400 text-sm transition`}
                          />
                          {errors.transactionId && (
                            <p className="text-rose-400 text-xs font-semibold">{errors.transactionId}</p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 8. Notes */}
                <div className="space-y-2">
                  <label htmlFor="notes" className="block text-sm font-semibold text-slate-200">
                    ৮. বিশেষ মন্তব্য
                  </label>
                  <div className="relative">
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="খাবারের এলার্জি বা অন্য যেকোনো মন্তব্য এখানে লিখতে পারেন..."
                      className="w-full px-4 py-3.5 rounded-xl bg-slate-950/40 border border-white/10 hover:border-white/20 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 font-sans text-sm md:text-base transition resize-none"
                    />
                  </div>
                </div>

                {/* 9. Agreement */}
                <div className="space-y-1.5">
                  <label className="flex items-start gap-3.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      id="agreement"
                      name="agreement"
                      checked={formData.agreement}
                      onChange={handleChange}
                      className="mt-1 h-5 w-5 rounded border-white/10 text-amber-500 focus:ring-amber-400 bg-slate-950/50 appearance-none checked:bg-amber-400 checked:border-amber-400 relative cursor-pointer flex items-center justify-center before:content-['✓'] before:text-slate-900 before:font-sans before:font-bold before:opacity-0 checked:before:opacity-100 before:text-xs"
                    />
                    <span className="text-sm text-slate-300 leading-snug">
                      ৯. আমি ইনফরমাল এই ট্যুরের সুশৃঙ্খলতা রক্ষার্থে ও সফল বাস্তবায়নে আয়োজকদের সকল সার্বিক নির্দেশনা এবং আইনসমূহ মেনে চলতে মনেপ্রাণে সম্মত আছি <span className="text-rose-400 font-bold">*</span>
                    </span>
                  </label>
                  {errors.agreement && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-rose-400 text-xs md:text-sm font-medium flex items-center gap-1.5 !mt-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {errors.agreement}
                    </motion.p>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  id="btn-submit-registration"
                  className="w-full py-4 rounded-full bg-[#2DD4BF] hover:bg-[#2DD4BF]/80 text-[#0A192F] font-extrabold text-base md:text-lg shadow-xl shadow-teal-500/10 transition duration-300 active:scale-95 disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      অনুরোধ প্রসেস হচ্ছে...
                    </>
                  ) : (
                    'রেজিস্ট্রেশন সাবমিট করুন'
                  )}
                </button>
              </form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
