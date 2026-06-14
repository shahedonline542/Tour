import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock, Search, Download, RefreshCw, LogOut, Users, CheckCircle2,
  AlertCircle, ChevronRight, FileSpreadsheet, Eye, EyeOff, Settings, Trash2, ShieldCheck,
  CreditCard, Edit
} from 'lucide-react';
import { RegistrationData } from '../types';
import AppsScriptSetup from './AppsScriptSetup';

interface AdminDashboardProps {
  registrations: RegistrationData[];
  onRefresh: () => void;
  onClearAll: () => void;
  appsScriptUrl: string;
  onUpdateUrl: (url: string) => void;
  onUpdateRegistration: (updatedReg: RegistrationData) => void;
  onDeleteRegistration: (id: string) => void;
}

// Compact, standard synchronous SHA-256 implementation
function hashPassword(str: string): string {
  const chrsz = 8;
  const hexcase = 0;
  
  function safe_add(x: number, y: number) {
    const lsw = (x & 0xFFFF) + (y & 0xFFFF);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }
  
  function S(X: number, n: number) { return (X >>> n) | (X << (32 - n)); }
  function R(X: number, n: number) { return (X >>> n); }
  function Ch(x: number, y: number, z: number) { return ((x & y) ^ ((~x) & z)); }
  function Maj(x: number, y: number, z: number) { return ((x & y) ^ (x & z) ^ (y & z)); }
  function Sigma0256(x: number) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
  function Sigma1256(x: number) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
  function Gamma0256(x: number) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
  function Gamma1256(x: number) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }
  
  function core_sha256(m: any[], l: number) {
    const K = [
      0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
      0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
      0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
      0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
      0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
      0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
      0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
      0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3E7, 0xC67178F2
    ];
    let HASH = [0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19];
    const W = new Array(64);
    let a, b, c, d, e, f, g, h;
    let T1, T2;
    
    m[l >> 5] |= 0x80 << (24 - l % 32);
    m[((l + 64 >> 9) << 4) + 15] = l;
    
    for (let i = 0; i < m.length; i += 16) {
      a = HASH[0];
      b = HASH[1];
      c = HASH[2];
      d = HASH[3];
      e = HASH[4];
      f = HASH[5];
      g = HASH[6];
      h = HASH[7];
      
      for (let j = 0; j < 64; j++) {
        if (j < 16) W[j] = m[i + j];
        else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
        T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
        T2 = safe_add(Sigma0256(a), Maj(a, b, c));
        h = g;
        g = f;
        f = e;
        e = safe_add(d, T1);
        d = c;
        c = b;
        b = a;
        a = safe_add(T1, T2);
      }
      
      HASH[0] = safe_add(a, HASH[0]);
      HASH[1] = safe_add(b, HASH[1]);
      HASH[2] = safe_add(c, HASH[2]);
      HASH[3] = safe_add(d, HASH[3]);
      HASH[4] = safe_add(e, HASH[4]);
      HASH[5] = safe_add(f, HASH[5]);
      HASH[6] = safe_add(g, HASH[6]);
      HASH[7] = safe_add(h, HASH[7]);
    }
    return HASH;
  }
  
  function str2binb(ascii: string) {
    const bin = [];
    const mask = (1 << chrsz) - 1;
    for (let i = 0; i < ascii.length * chrsz; i += chrsz) {
      bin[i >> 5] |= (ascii.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
    }
    return bin;
  }
  
  function binb2hex(binarray: number[]) {
    const hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    let ascii = "";
    for (let i = 0; i < binarray.length * 4; i++) {
       ascii += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) +
                hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
    }
    return ascii;
  }
  
  return binb2hex(core_sha256(str2binb(str), str.length * chrsz));
}

const isSha256 = (str: string) => /^[a-f0-9]{64}$/i.test(str);

export default function AdminDashboard({
  registrations,
  onRefresh,
  onClearAll,
  appsScriptUrl,
  onUpdateUrl,
  onUpdateRegistration,
  onDeleteRegistration
}: AdminDashboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [curPasswordHash, setCurPasswordHash] = useState(() => {
    const saved = localStorage.getItem('admin_dashboard_password') || 'marketingtour2026';
    if (isSha256(saved)) {
      return saved;
    } else {
      const hashed = hashPassword(saved);
      localStorage.setItem('admin_dashboard_password', hashed);
      return hashed;
    }
  });

  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [filterParticipation, setFilterParticipation] = useState<string>('all');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string>('all');
  const [showConfig, setShowConfig] = useState(false);

  // States for Edit / Delete operations
  const [editingRegistration, setEditingRegistration] = useState<RegistrationData | null>(null);
  const [editForm, setEditForm] = useState<RegistrationData | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);

  useEffect(() => {
    if (editingRegistration) {
      setEditForm({ ...editingRegistration });
      setEditError(null);
    } else {
      setEditForm(null);
      setEditError(null);
    }
  }, [editingRegistration]);

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const handleEditFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;

    if (!editForm.name.trim()) {
      setEditError('দয়া করে সঠিক নাম লিখুন');
      return;
    }
    if (!editForm.phone.trim()) {
      setEditError('দয়া করে সঠিক ফোন নম্বর লিখুন');
      return;
    }
    if (!editForm.emergencyPhone.trim()) {
      setEditError('দয়া করে সঠিক জরুরি নম্বর লিখুন');
      return;
    }

    if (editForm.paidAlready === 'yes') {
      if (!editForm.paymentMethod) {
        setEditError('দয়া করে পেমেন্ট মাধ্যম নির্বাচন করুন');
        return;
      }
      if (!editForm.paidAmount || isNaN(Number(editForm.paidAmount)) || Number(editForm.paidAmount) <= 0) {
        setEditError('দয়া করে প্রদত্ত সঠিক টাকার পরিমাণ লিখুন');
        return;
      }
      if (!editForm.transactionId?.trim()) {
        setEditError('দয়া করে Transaction ID লিখুন');
        return;
      }
    }

    onUpdateRegistration(editForm);
    setEditingRegistration(null);
  };

  // Stats Calculations
  const totalRegistrations = registrations.length;
  const confirmedCount = registrations.filter(r => r.participation === 'yes').length;
  const totalFamilyCount = registrations.reduce((sum, r) => sum + (r.familyCount || 0), 0);
  const totalHeads = totalRegistrations + totalFamilyCount;

  // Real Payment Stats Calculations
  const paidParticipantsCount = registrations.filter(r => r.adminPaymentStatus === 'Paid').length;
  const unpaidParticipantsCount = registrations.filter(r => r.adminPaymentStatus !== 'Paid').length;
  const totalAmountCollected = registrations
    .filter(r => r.adminPaymentStatus === 'Paid')
    .reduce((sum, r) => sum + Number(r.paidAmount || 0), 0);

  // Search and Filtering
  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.phone.includes(searchTerm) ||
      reg.emergencyPhone.includes(searchTerm);

    const matchesParticipation =
      filterParticipation === 'all' || reg.participation === filterParticipation;

    const matchesPaymentStatus =
      filterPaymentStatus === 'all' ||
      (filterPaymentStatus === 'Paid' && reg.adminPaymentStatus === 'Paid') ||
      (filterPaymentStatus === 'Pending' && reg.adminPaymentStatus === 'Pending') ||
      (filterPaymentStatus === 'Unpaid' && (reg.adminPaymentStatus === 'Unpaid' || !reg.adminPaymentStatus));

    return matchesSearch && matchesParticipation && matchesPaymentStatus;
  });

  const latestRegistration = registrations.length > 0 ? registrations[0] : null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (hashPassword(password) === curPasswordHash) {
      setIsAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('ভুল পাসওয়ার্ড। দয়া করে আবার চেষ্টা করুন।');
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError('');
    setPasswordChangeSuccess('');

    if (hashPassword(oldPassword) !== curPasswordHash) {
      setPasswordChangeError('পুরাতন পাসওয়ার্ডটি সঠিক নয়!');
      return;
    }
    if (newPassword.trim().length < 4) {
      setPasswordChangeError('নতুন পাসওয়ার্ডটি অত্যন্ত ছোট! কমপক্ষে ৪ অক্ষরের হতে হবে।');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordChangeError('নতুন পাসওয়ার্ড দুটি মিলছে না!');
      return;
    }

    // Pass
    const hashedNew = hashPassword(newPassword);
    localStorage.setItem('admin_dashboard_password', hashedNew);
    setCurPasswordHash(hashedNew);
    setPasswordChangeSuccess('পাসওয়ার্ডটি সফলভাবে পরিবর্তন করা হয়েছে!');
    setOldPassword('');
    setNewPassword('');
    setConfirmNewPassword('');

    setTimeout(() => {
      setPasswordChangeSuccess('');
      setShowPasswordChange(false);
    }, 2500);
  };

  const handleExportCSV = () => {
    if (registrations.length === 0) {
      alert('রপ্তানি করার মতো কোনো রেজিস্ট্রেশন তথ্য নেই!');
      return;
    }

    // Prepare CSV header in Bengali/English with payment fields
    const headers = [
      'Timestamp', 'Name', 'Mobile Number', 'Participation', 'Has Family', 'Family Members', 'Emergency Contact', 'Special Comments',
      'Paid Already?', 'Payment Method', 'Paid Amount', 'Transaction ID', 'Payment Status'
    ];
    const rows = registrations.map(reg => [
      `"${reg.timestamp}"`,
      `"${reg.name}"`,
      `"${reg.phone}"`,
      `"${reg.participation === 'yes' ? 'হ্যাঁ' : reg.participation === 'no' ? 'না' : 'এখনও নিশ্চিত নই'}"`,
      `"${reg.hasFamily === 'yes' ? 'হ্যাঁ' : 'না'}"`,
      reg.familyCount,
      `"${reg.emergencyPhone}"`,
      `"${reg.notes ? reg.notes.replace(/"/g, '""') : ''}"`,
      `"${reg.paidAlready === 'yes' ? 'হ্যাঁ' : 'না'}"`,
      `"${reg.paymentMethod || ''}"`,
      `"${reg.paidAmount || ''}"`,
      `"${reg.transactionId || ''}"`,
      `"${reg.adminPaymentStatus || 'Unpaid'}"`
    ]);

    const csvContent = '\uFEFF' // UTF-8 BOM
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Tour_Registrations_Marketing_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans py-12 px-4 selection:bg-amber-500/30">
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          /* PASSWORD MODAL FORM */
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-md mx-auto pt-16"
          >
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl">
              <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/25 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/5">
                <Lock className="w-8 h-8" />
              </div>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold font-sans">প্যানেল এক্সেস সিকিউরিটি</h2>
                <p className="text-slate-400 text-sm mt-1">
                  অর্গানাইজার ডেটাবোর্ড সুরক্ষার স্বার্থে পাসওয়ার্ড প্রদান করুন।
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="admin-pass" className="text-sm font-semibold text-slate-300 block">
                    অ্যাডমিন পাসওয়ার্ড
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="admin-pass"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="পাসওয়ার্ড লিখুন..."
                      autoFocus
                      className="w-full pl-4 pr-11 py-3.5 rounded-xl bg-slate-950/50 border border-white/10 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 font-sans text-sm md:text-base transition text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-rose-400 text-xs md:text-sm font-medium flex items-center gap-1 mt-1">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {passwordError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  id="btn-admin-login"
                  className="w-full py-4 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold transition duration-300 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-5 h-5" />
                  ভেরিফাই এবং প্রবেশ করুন
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          /* ADMIN DASHBOARD VIEW */
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-6xl mx-auto space-y-8"
          >
            {/* Header block with title and logout */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-teal-400 animate-pulse" />
                  <span className="text-xs text-teal-400 font-bold font-mono tracking-wider uppercase">
                    Admin Portal Live
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                  মার্কেটিং ২য় বর্ষ ট্যুর <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">২০২৬ কন্ট্রোল সেন্টার</span>
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    setShowConfig(!showConfig);
                    setShowPasswordChange(false);
                  }}
                  className={`px-4 py-2.5 rounded-xl border text-sm font-semibold flex items-center gap-2 transition cursor-pointer ${
                    showConfig
                      ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/5'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  {showConfig ? 'ড্যাশবোর্ড দেখুন' : 'গুগল শিট সেটআপ'}
                </button>
                <button
                  onClick={() => {
                    setShowPasswordChange(!showPasswordChange);
                    setShowConfig(false);
                  }}
                  className={`px-4 py-2.5 rounded-xl border text-sm font-semibold flex items-center gap-2 transition cursor-pointer ${
                    showPasswordChange
                      ? 'bg-[#2DD4BF]/20 border-[#2DD4BF] text-[#2DD4BF] shadow-md shadow-teal-500/5'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                  }`}
                >
                  <Lock className="w-4 h-4 text-[#2DD4BF]" />
                  {showPasswordChange ? 'ড্যাশবোর্ড দেখুন' : 'পাসওয়ার্ড পরিবর্তন'}
                </button>
                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 hover:bg-rose-500/15 text-sm font-semibold flex items-center gap-2 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  লগ আউট
                </button>
              </div>
            </div>

            {showConfig ? (
              /* APPS SCRIPT CONFIGURATION HUB */
              <AppsScriptSetup
                currentUrl={appsScriptUrl}
                onSave={onUpdateUrl}
                onBack={() => setShowConfig(false)}
              />
            ) : showPasswordChange ? (
              /* PASSWORD CHANGE SECTION */
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md mx-auto p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl relative"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#2DD4BF]/5 rounded-full blur-2xl pointer-events-none" />
                <div className="w-12 h-12 bg-[#F59E0B]/10 text-[#F59E0B] rounded-full flex items-center justify-center mb-6">
                  <Lock className="w-6 h-6" />
                </div>
                
                <h2 className="text-xl font-bold mb-2">অ্যাডমিন পাসওয়ার্ড পরিবর্তন</h2>
                <p className="text-slate-400 text-xs mb-6 leading-relaxed">
                  ভবিষ্যতের সিকিউরড এক্সেস নিশ্চিত করতে পুরাতন পাসওয়ার্ড ভেরিফাই করে নতুন পাসওয়ার্ড সেট করুন।
                </p>

                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 block">
                      বর্তমান পাসওয়ার্ড
                    </label>
                    <input
                      type="password"
                      placeholder="পুরাতন সঠিক পাসওয়ার্ড"
                      required
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/40 border border-white/10 focus:outline-none focus:ring-1 focus:ring-amber-400 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 block">
                      নতুন পাসওয়ার্ড
                    </label>
                    <input
                      type="password"
                      placeholder="কমপক্ষে ৪ অক্ষরের পাসওয়ার্ড"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/40 border border-white/10 focus:outline-none focus:ring-1 focus:ring-amber-400 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 block">
                      নতুন পাসওয়ার্ডটি পুনরায় টাইপ করুন
                    </label>
                    <input
                      type="password"
                      placeholder="আবারও একই নতুন পাসওয়ার্ড লিখুন"
                      required
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/40 border border-white/10 focus:outline-none focus:ring-1 focus:ring-amber-400 text-sm"
                    />
                  </div>

                  {passwordChangeError && (
                    <p className="text-rose-400 text-xs font-medium flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {passwordChangeError}
                    </p>
                  )}

                  {passwordChangeSuccess && (
                    <p className="text-teal-400 text-xs font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      {passwordChangeSuccess}
                    </p>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowPasswordChange(false)}
                      className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold transition"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-[#2DD4BF] hover:bg-[#2DD4BF]/80 text-[#0A192F] text-xs font-extrabold transition"
                    >
                      নতুন পাসওয়ার্ড সেট করুন
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              /* GENERAL DASHBOARD SECTION */
              <>
                {/* Stats Blocks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-xs">মোট রেজিস্ট্রেশন ফরম</p>
                      <h3 className="text-3xl font-bold text-white mt-1">{totalRegistrations} জন</h3>
                    </div>
                    <div className="p-3 bg-white/5 text-amber-400 rounded-xl">
                      <FileSpreadsheet className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-xs">নিশ্চিত অংশগ্রহণকারী (হ্যাঁ)</p>
                      <h3 className="text-3xl font-bold text-teal-400 mt-1">{confirmedCount} জন</h3>
                    </div>
                    <div className="p-3 bg-teal-500/10 text-teal-400 rounded-xl">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-xs">পরিবারের মোট সদস্য সংখ্যা</p>
                      <h3 className="text-3xl font-bold text-amber-300 mt-1">{totalFamilyCount} জন</h3>
                    </div>
                    <div className="p-3 bg-white/5 text-amber-300 rounded-xl">
                      <Users className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-xs">মোট আসন বরাদ্দ (সদস্যসহ)</p>
                      <h3 className="text-3xl font-bold text-cyan-400 mt-1">{totalHeads} জন</h3>
                    </div>
                    <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl">
                      <Users className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* 💳 অগ্রিম পেমেন্ট ট্র্যাকিং (Advanced Payment Metrics) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-6 rounded-2xl bg-teal-500/5 border border-teal-500/10 flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-xs font-semibold">🟢 Paid Participants</p>
                      <h3 className="text-3xl font-extrabold text-teal-400 mt-1.5">{paidParticipantsCount} জন</h3>
                    </div>
                    <div className="p-2.5 bg-teal-500/10 text-[#2DD4BF] rounded-xl font-bold font-mono text-xs tracking-wider">
                      PAID
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/10 flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-xs font-semibold">🔴 Unpaid Participants</p>
                      <h3 className="text-3xl font-extrabold text-[#F43F5E] mt-1.5">{unpaidParticipantsCount} জন</h3>
                    </div>
                    <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl font-bold font-mono text-xs tracking-wider">
                      UNPAID
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-amber-500/5 border border-[#F59E0B]/10 flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-xs font-semibold font-sans">💰 Total Amount Collected</p>
                      <h3 className="text-3xl font-extrabold text-[#F59E0B] mt-1.5">{totalAmountCollected} ৳</h3>
                    </div>
                    <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl font-bold font-mono text-xs tracking-wider">
                      BDT
                    </div>
                  </div>
                </div>

                {/* Latest Submission Alert */}
                {latestRegistration && (
                  <div className="p-5 rounded-2xl bg-teal-500/5 border border-teal-500/20 text-slate-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-teal-500/10 rounded-lg text-teal-400">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 font-medium">সর্বশেষ আবেদন:</span>
                        <p className="text-sm font-semibold text-white">
                          {latestRegistration.name} ({latestRegistration.phone}) - {latestRegistration.timestamp}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-teal-300 font-semibold bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20">
                      সফল রেজিস্ট্রেশন
                    </div>
                  </div>
                )}

                {/* Operations & Table Controls */}
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
                    {/* Search Field */}
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Search className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="নাম অথবা মোবাইল নম্বর দিয়ে খুঁজুন..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/40 border border-white/10 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400"
                      />
                    </div>

                    {/* Filter Selector & Buttons */}
                    <div className="flex flex-wrap items-center gap-3">
                      <select
                        value={filterParticipation}
                        onChange={(e) => setFilterParticipation(e.target.value)}
                        className="px-3 py-2.5 rounded-xl bg-slate-950/40 border border-white/10 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400 text-slate-200"
                      >
                        <option value="all">অংশগ্রহণ: সকল</option>
                        <option value="yes">হ্যাঁ</option>
                        <option value="no">না</option>
                        <option value="maybe">নিশ্চিত নই</option>
                      </select>

                      <select
                        value={filterPaymentStatus}
                        onChange={(e) => setFilterPaymentStatus(e.target.value)}
                        className="px-3 py-2.5 rounded-xl bg-slate-950/40 border border-white/10 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400 text-slate-200 font-sans"
                      >
                        <option value="all">পেমেন্ট: সকল</option>
                        <option value="Paid">🟢 Paid</option>
                        <option value="Pending">🟡 Pending</option>
                        <option value="Unpaid">🔴 Unpaid</option>
                      </select>

                      <button
                        onClick={onRefresh}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
                        title="রिफ্রেশ ডেটা"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>

                      <button
                        onClick={handleExportCSV}
                        className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center gap-2 transition cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        CSV ডাউনলোড
                      </button>

                      {registrations.length > 0 && (
                        <button
                          onClick={() => setShowClearAllConfirm(true)}
                          className="px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 hover:bg-rose-500/20 font-bold text-sm flex items-center gap-2 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                          স্থানীয় ডেটা মুছুন
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Responsive Table UI */}
                  <div className="overflow-x-auto rounded-xl border border-white/5">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-950/60 border-b border-white/10 text-slate-400 text-xs md:text-sm font-semibold tracking-wide">
                          <th className="p-4 font-sans font-medium">সময় ও তারিখ</th>
                          <th className="p-4 font-sans font-medium">পূর্ণ নাম</th>
                          <th className="p-4 font-sans font-medium">মোবাইল নম্বর</th>
                          <th className="p-4 font-sans font-medium">অংশগ্রহণ করবেন?</th>
                          <th className="p-4 font-sans font-medium">পরিবারের সদস্য</th>
                          <th className="p-4 font-sans font-medium">জরুরি নম্বর</th>
                          <th className="p-4 font-sans font-medium">বিশেষ মন্তব্য</th>
                          <th className="p-4 font-sans font-medium">অগ্রিম পেমেন্ট?</th>
                          <th className="p-4 font-sans font-medium">Transaction ID</th>
                          <th className="p-4 font-sans font-medium">পেমেন্ট স্ট্যাটাস</th>
                          <th className="p-4 font-sans font-medium text-center">অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-xs md:text-sm text-slate-200">
                        {filteredRegistrations.length === 0 ? (
                          <tr>
                            <td colSpan={11} className="p-12 text-center text-slate-500">
                              কোনো রেজিস্ট্রেশন তথ্য খুঁজে পাওয়া যায়নি।
                            </td>
                          </tr>
                        ) : (
                          filteredRegistrations.map((item, index) => (
                            <tr
                              key={item.id}
                              className="hover:bg-white/5 transition duration-150"
                            >
                              <td className="p-4 font-mono text-slate-400 whitespace-nowrap">
                                {item.timestamp}
                              </td>
                              <td className="p-4 font-bold text-white whitespace-nowrap">
                                {item.name}
                              </td>
                              <td className="p-4 font-mono whitespace-nowrap">
                                <a href={`tel:${item.phone}`} className="hover:text-amber-300 transition">
                                  {item.phone}
                                </a>
                              </td>
                              <td className="p-4">
                                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                  item.participation === 'yes'
                                    ? 'bg-teal-500/10 text-teal-300 border border-teal-500/20'
                                    : item.participation === 'no'
                                    ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                                    : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                                }`}>
                                  {item.participation === 'yes' ? 'হ্যাঁ' : item.participation === 'no' ? 'না' : 'নিশ্চিত নই'}
                                </span>
                              </td>
                              <td className="p-4">
                                <span className="text-slate-300">
                                  {item.hasFamily === 'yes' ? `হ্যাঁ (${item.familyCount} জন)` : 'না'}
                                </span>
                              </td>
                              <td className="p-4 font-mono white-space-nowrap">
                                <a href={`tel:${item.emergencyPhone}`} className="text-slate-300 hover:text-amber-300 transition">
                                  {item.emergencyPhone}
                                </a>
                              </td>
                              <td className="p-4 max-w-[180px] truncate text-slate-400" title={item.notes}>
                                {item.notes || '-'}
                              </td>
                              <td className="p-4 whitespace-nowrap">
                                {item.paidAlready === 'yes' ? (
                                  <div className="text-xs">
                                    <div className="font-bold text-[#2DD4BF] font-sans">{item.paymentMethod}</div>
                                    <div className="text-emerald-400 font-mono font-medium mt-0.5">{item.paidAmount} ৳</div>
                                  </div>
                                ) : (
                                  <span className="text-xs text-slate-500 font-sans">না</span>
                                )}
                              </td>
                              <td className="p-4 font-mono text-xs whitespace-nowrap">
                                {item.transactionId ? (
                                  <span className="text-amber-400 select-all font-semibold" title={item.transactionId}>
                                    {item.transactionId}
                                  </span>
                                ) : (
                                  <span className="text-slate-500">-</span>
                                )}
                              </td>
                              <td className="p-4">
                                <select
                                  value={item.adminPaymentStatus || 'Unpaid'}
                                  onChange={(e) => {
                                    const updatedVal = e.target.value as 'Paid' | 'Pending' | 'Unpaid';
                                    onUpdateRegistration({
                                      ...item,
                                      adminPaymentStatus: updatedVal
                                    });
                                  }}
                                  className={`px-2 py-1 rounded-full text-[11px] font-bold focus:outline-none cursor-pointer border ${
                                    (item.adminPaymentStatus || 'Unpaid') === 'Paid'
                                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                      : (item.adminPaymentStatus || 'Unpaid') === 'Pending'
                                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                                      : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                                  }`}
                                >
                                  <option value="Paid" className="bg-slate-900 text-emerald-400">🟢 Paid</option>
                                  <option value="Pending" className="bg-slate-900 text-amber-300">🟡 Pending</option>
                                  <option value="Unpaid" className="bg-slate-900 text-rose-300">🔴 Unpaid</option>
                                </select>
                              </td>
                              <td className="p-4 text-center whitespace-nowrap">
                                <div className="flex justify-center items-center gap-1.5">
                                  <button
                                    onClick={() => setEditingRegistration(item)}
                                    className="px-2.5 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/15 text-[#2DD4BF] border border-teal-500/20 hover:border-[#2DD4BF]/40 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                    title="সম্পাদনা করুন"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                    সম্পাদনা
                                  </button>
                                  <button
                                    onClick={() => handleDeleteClick(item.id, item.name)}
                                    className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/15 text-rose-300 border border-rose-500/20 hover:border-rose-500/40 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                    title="মুছে ফেলুন"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    মুছুন
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Table Stats Indicator */}
                  <div className="flex justify-between items-center text-sm text-slate-400">
                    <p>
                      ফিল্টারকৃত তথ্য: <span className="text-white font-semibold">{filteredRegistrations.length}</span> (মোট {totalRegistrations} এর মধ্যে)
                    </p>
                    <p className="hidden sm:block text-xs text-slate-500">
                      * মোবাইল নম্বর বা নামে ট্যাপ করে সরাসরি কল করা সম্ভব।
                    </p>
                  </div>

                  {/* Developer Credit Info in Admin */}
                  <div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-2">
                    <p>সিস্টেম সংস্করণ: ২.০ (লাইভ গুগল শিট সিঙ্ক)</p>
                    <p className="font-extrabold text-[#2DD4BF] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] animate-pulse" />
                      ডিজাইন এবং ডেভেলপমেন্টে: Sk Shahed
                    </p>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Edit Registration Modal */}
      <AnimatePresence>
        {editingRegistration && editForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0F1E36] border border-white/10 rounded-3xl p-6 md:p-8 text-left shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-xl">✏️</span>
                  <h3 className="text-xl font-bold font-sans text-white">রেজিস্ট্রেশন তথ্য সম্পাদনা</h3>
                </div>
                <button
                  onClick={() => setEditingRegistration(null)}
                  className="p-1.5 px-3 text-xs py-1 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 transition duration-150 cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>

              <form onSubmit={handleEditFormSubmit} className="space-y-5">
                {editError && (
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 animate-bounce" />
                    <span>{editError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-400">পূর্ণ নাম</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => prev ? { ...prev, name: e.target.value } : null)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/50 border border-white/10 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans"
                      required
                    />
                  </div>

                  {/* Mobile Number */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-400">মোবাইল নম্বর</label>
                    <input
                      type="text"
                      value={editForm.phone}
                      onChange={(e) => setEditForm(prev => prev ? { ...prev, phone: e.target.value } : null)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/50 border border-white/10 text-white font-sans text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                      required
                    />
                  </div>

                  {/* Participation Status */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-400">অংশগ্রহণ করবেন?</label>
                    <select
                      value={editForm.participation}
                      onChange={(e) => setEditForm(prev => prev ? { ...prev, participation: e.target.value as 'yes' | 'no' | 'maybe' } : null)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/50 border border-white/10 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-200"
                    >
                      <option value="yes" className="bg-slate-900">হ্যাঁ (Yes)</option>
                      <option value="no" className="bg-slate-900">না (No)</option>
                      <option value="maybe" className="bg-slate-900">নিশ্চিত নই (Maybe)</option>
                    </select>
                  </div>

                  {/* Has Family Section */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-400">পরিবারের সদস্য থাকবে?</label>
                    <select
                      value={editForm.hasFamily}
                      onChange={(e) => {
                        const val = e.target.value as 'yes' | 'no';
                        setEditForm(prev => prev ? { 
                          ...prev, 
                          hasFamily: val, 
                          familyCount: val === 'no' ? 0 : (prev.familyCount || 1) 
                        } : null);
                      }}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/50 border border-white/10 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-200"
                    >
                      <option value="no" className="bg-slate-900">না (No)</option>
                      <option value="yes" className="bg-slate-900">হ্যাঁ (Yes)</option>
                    </select>
                  </div>

                  {/* Family Count (Only if yes) */}
                  {editForm.hasFamily === 'yes' && (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-400">পরিবারের সদস্য সংখ্যা</label>
                      <input
                        type="number"
                        min="1"
                        value={editForm.familyCount || 1}
                        onChange={(e) => setEditForm(prev => prev ? { ...prev, familyCount: parseInt(e.target.value) || 1 } : null)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950/50 border border-white/10 text-white font-sans text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                        required
                      />
                    </div>
                  )}

                  {/* Emergency Contact */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-400">জরুরি যোগাযোগের নম্বর</label>
                    <input
                      type="text"
                      value={editForm.emergencyPhone}
                      onChange={(e) => setEditForm(prev => prev ? { ...prev, emergencyPhone: e.target.value } : null)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950/50 border border-white/10 text-white font-sans text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                      required
                    />
                  </div>
                </div>

                {/* Comments/Notes */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-400">বিশেষ মন্তব্য/নোট</label>
                  <textarea
                    value={editForm.notes || ''}
                    onChange={(e) => setEditForm(prev => prev ? { ...prev, notes: e.target.value } : null)}
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950/50 border border-white/10 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                  <div className="text-xs font-bold text-[#2DD4BF] uppercase tracking-wider font-mono">
                    Payment Management
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Paid Already */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-400">অগ্রিম পেমেন্ট করেছেন?</label>
                      <select
                        value={editForm.paidAlready || 'no'}
                        onChange={(e) => {
                          const val = e.target.value as 'yes' | 'no';
                          setEditForm(prev => prev ? {
                            ...prev,
                            paidAlready: val,
                            paymentMethod: val === 'no' ? '' : (prev.paymentMethod || 'bKash'),
                            paidAmount: val === 'no' ? '' : (prev.paidAmount || '250'),
                            adminPaymentStatus: val === 'yes' ? 'Paid' : 'Unpaid'
                          } : null);
                        }}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950/50 border border-white/10 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-200"
                      >
                        <option value="no" className="bg-slate-900">না</option>
                        <option value="yes" className="bg-slate-900">হ্যাঁ</option>
                      </select>
                    </div>

                    {/* Payment Status Dropdown (🟢 Paid, 🟡 Pending, 🔴 Unpaid) */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-400">পেমেন্ট স্ট্যাটাস</label>
                      <select
                        value={editForm.adminPaymentStatus || 'Unpaid'}
                        onChange={(e) => setEditForm(prev => prev ? { ...prev, adminPaymentStatus: e.target.value as 'Paid' | 'Pending' | 'Unpaid' } : null)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950/50 border border-white/10 text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                      >
                        <option value="Paid" className="bg-slate-900 text-emerald-400">🟢 Paid</option>
                        <option value="Pending" className="bg-slate-900 text-amber-300">🟡 Pending</option>
                        <option value="Unpaid" className="bg-slate-900 text-rose-300">🔴 Unpaid</option>
                      </select>
                    </div>
                  </div>

                  {editForm.paidAlready === 'yes' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      {/* payment method */}
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-semibold text-slate-400">পেমেন্ট মাধ্যম</label>
                        <select
                          value={editForm.paymentMethod || 'bKash'}
                          onChange={(e) => setEditForm(prev => prev ? { ...prev, paymentMethod: e.target.value as any } : null)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950/50 border border-white/10 text-white text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-200"
                        >
                          <option value="bKash" className="bg-slate-900">bKash</option>
                          <option value="Nagad" className="bg-slate-900">Nagad</option>
                          <option value="Upay" className="bg-slate-900">Upay</option>
                          <option value="Rocket" className="bg-slate-900">Rocket</option>
                        </select>
                      </div>

                      {/* paid amount */}
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-semibold text-slate-400">প্রদত্ত পরিমাণ (৳)</label>
                        <input
                          type="text"
                          value={editForm.paidAmount || ''}
                          onChange={(e) => setEditForm(prev => prev ? { ...prev, paidAmount: e.target.value } : null)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950/50 border border-white/10 text-white font-sans text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                          placeholder="টাকার অংক"
                        />
                      </div>

                      {/* Transaction ID */}
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-semibold text-slate-400 font-sans">Transaction ID</label>
                        <input
                          type="text"
                          value={editForm.transactionId || ''}
                          onChange={(e) => setEditForm(prev => prev ? { ...prev, transactionId: e.target.value } : null)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950/50 border border-white/10 text-white text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans"
                          placeholder="বিকাশ আইডি"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setEditingRegistration(null)}
                    className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-medium text-xs transition duration-150 cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-300 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/10 active:scale-95 transition cursor-pointer"
                  >
                    সেভ করুন
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-[#0F1E36] border border-white/10 rounded-3xl p-6 text-center shadow-2xl"
            >
              <div className="w-14 h-14 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2 font-sans">রেজিস্ট্রেশন মুছে ফেলার নিশ্চয়তা</h3>
              <p className="text-slate-300 text-xs font-sans px-2 mb-6 leading-relaxed">
                আপনি কি নিশ্চিতভাবে <span className="text-rose-400 font-bold">"{deleteTarget.name}"</span> এর রেজিস্ট্রেশনটি মুছে ফেলতে চান? এটি আর ফিরিয়ে আনা সম্ভব নয়!
              </p>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs transition duration-150 cursor-pointer"
                >
                  বাতিল করুন
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteRegistration(deleteTarget.id);
                    setDeleteTarget(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-500/20 active:scale-95 transition cursor-pointer"
                >
                  হ্যাঁ, মুছে ফেলুন
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Clear All Confirmation Modal */}
      <AnimatePresence>
        {showClearAllConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-[#0F1E36] border border-white/10 rounded-3xl p-6 text-center shadow-2xl"
            >
              <div className="w-14 h-14 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-base font-bold text-white mb-2 font-sans">সকল স্থানীয় ডেটা মুছে ফেলার নিশ্চয়তা</h3>
              <p className="text-slate-300 text-xs font-sans px-2 mb-6 leading-relaxed">
                আপনি কি নিশ্চিত যে আপনি স্থানীয় সঞ্চয়স্থানের সমস্ত রেজিস্ট্রেশন মুছে ফেলতে চান? গুগল শিট সিঙ্কের ডেটা এতে প্রভাবিত হবে না।
              </p>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowClearAllConfirm(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs transition duration-150 cursor-pointer"
                >
                  বাতিল করুন
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClearAll();
                    setShowClearAllConfirm(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-500/20 active:scale-95 transition cursor-pointer"
                >
                  হ্যাঁ, সব মুছুন
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
