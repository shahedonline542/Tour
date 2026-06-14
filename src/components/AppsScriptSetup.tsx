import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileSpreadsheet, Clipboard, CheckCircle, Info, RefreshCw, Undo2, Play, Save
} from 'lucide-react';

interface AppsScriptSetupProps {
  currentUrl: string;
  onSave: (url: string) => void;
  onBack: () => void;
}

export default function AppsScriptSetup({ currentUrl, onSave, onBack }: AppsScriptSetupProps) {
  const [urlInput, setUrlInput] = useState(currentUrl);
  const [copiedScript, setCopiedScript] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // The actual Apps Script code for Google Sheets integration
  const appsScriptCode = `/**
 * Google Sheets Database Bridge for Marketing Tour 2026
 * Developed for Azam Khan Government Commerce College marketing department tour.
 * Setup:
 * 1. Open Google Sheet
 * 2. Extensions -> Apps Script
 * 3. Delete any default code and paste this script.
 * 4. Click "Save" icon (or Ctrl+S).
 * 5. Click "Deploy" -> "New Deployment"
 * 6. Select "Web App" as Type.
 * 7. Execute as: "Me" (your email)
 * 8. Who has access: "Anyone" (Critical for anonymous submissions!)
 * 9. Click "Deploy" and authorize approvals.
 * 10. Copy the Web App URL and paste it in the Admin Dashboard!
 */

function doGet(e) {
  return HtmlService.createHtmlOutput("GET request received. Server active! Use POST to submit registration data.");
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Ensure headings exist in the first row if the sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "পূর্ণ নাম",
        "মোবাইল নম্বর",
        "অংশগ্রহণ করবেন",
        "পরিবারের সদস্য",
        "সদস্য সংখ্যা",
        "জরুরি যোগাযোগ",
        "মন্তব্য",
        "অগ্রিম পেমেন্ট করেছেন?",
        "পেমেন্ট মাধ্যম",
        "টাকার পরিমাণ",
        "Transaction ID",
        "পেমেন্ট স্ট্যাটাস"
      ]);
      // Format headers
      sheet.getRange(1, 1, 1, 13).setFontWeight("bold").setBackground("#0f2446").setFontColor("#ffffff");
    }
    
    let params;
    if (e.postData.type === "application/x-www-form-urlencoded") {
      params = e.parameter;
    } else {
      params = JSON.parse(e.postData.contents);
    }
    
    const timestamp = params.timestamp || new Date().toLocaleString("bn-BD", { timeZone: "Asia/Dhaka" });
    const name = params.name || "";
    const phone = params.phone || "";
    const participation = params.participation || "";
    const hasFamily = params.hasFamily || "";
    const familyCount = params.familyCount || "0";
    const emergencyPhone = params.emergencyPhone || "";
    const notes = params.notes || "";
    const paidAlready = params.paidAlready || "না";
    const paymentMethod = params.paymentMethod || "";
    const paidAmount = params.paidAmount || "";
    const transactionId = params.transactionId || "";
    const adminPaymentStatus = params.adminPaymentStatus || "Unpaid";
    
    // Append submission data row instantly
    sheet.appendRow([
      timestamp,
      name,
      phone,
      participation,
      hasFamily,
      familyCount,
      emergencyPhone,
      notes,
      paidAlready,
      paymentMethod,
      paidAmount,
      transactionId,
      adminPaymentStatus
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Data appended successfully to Google Sheet!"
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}`;

  const copyScriptToClipboard = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(urlInput.trim());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Configuration Input for GAS */}
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <FileSpreadsheet className="w-5 h-5 text-teal-400" />
          গুগল শিট কানেক্টর লিঙ্ক
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          আপনার গুগল অ্যাপস স্ক্রিপ্ট (Google Apps Script) ওয়েব অ্যাপ ডিপ্লয়মেন্ট ইউআরএলটি নিচের বক্সে পেস্ট করে সেভ করুন। এরপর থেকে পেজে সম্পন্ন করা সব নতুন রেজিস্ট্রেশন সরাসরি লাইভ গুগল স্প্রেডশিটে জমা হবে।
        </p>

        <form onSubmit={handleSaveUrl} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              placeholder="https://script.google.com/macros/s/.../exec"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-950/50 border border-white/10 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400 text-slate-100 font-mono"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              লিঙ্ক সেভ করুন
            </button>
          </div>

          {isSaved && (
            <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-teal-400 text-sm font-semibold flex items-center gap-1.5 mt-2">
              <CheckCircle className="w-4 h-4" />
              লিঙ্কটি সফলভাবে সেভ হয়েছে!
            </motion.p>
          )}
        </form>
      </div>

      {/* Deployment Multi-step Guide & Guide Details */}
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-bold font-sans">গুগল অ্যাপস স্ক্রিপ্ট ডিপ্লয়মেন্ট গাইড</h2>
            <p className="text-slate-400 text-sm mt-0.5">গুগল শিটে ডেটা জমা করার জন্য নিচের ৪টি সহজ ধাপ পূর্ণ করুন।</p>
          </div>
          <button
            onClick={copyScriptToClipboard}
            className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-sm font-semibold flex items-center gap-2 transition active:scale-95 cursor-pointer"
          >
            {copiedScript ? (
              <>
                <CheckCircle className="w-4 h-4 text-teal-400" />
                <span className="text-teal-300">কপি সম্পন্ন!</span>
              </>
            ) : (
              <>
                <Clipboard className="w-4 h-4 text-amber-400" />
                <span>কোড কপি করুন</span>
              </>
            )}
          </button>
        </div>

        {/* Steps List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 text-sm text-slate-300">
            {/* Step 1 */}
            <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5 flex gap-3">
              <div className="w-6 h-6 rounded-full bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">১</div>
              <div>
                <h4 className="font-bold text-white text-base">১. গুগল স্প্রেডশিট তৈরি</h4>
                <p className="mt-1 leading-relaxed">
                  আপনার গুগল ড্রাইভে গিয়ে একটি নতুন খালি Google Sheet তৈরি করুন। প্রথম সারিতে কোনো কলামে টাইটেল না দিলেও স্ক্রিপ্ট নিজে থেকেই কলাম হেডার তৈরি করে নেবে।
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5 flex gap-3">
              <div className="w-6 h-6 rounded-full bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">২</div>
              <div>
                <h4 className="font-bold text-white text-base">২. অ্যাপস স্ক্রিপ্ট ওপেন</h4>
                <p className="mt-1 leading-relaxed">
                  স্প্রেডশিটের উপরের মেনুবার থেকে <strong>Extensions (সম্প্রসারণ)</strong> -&gt; <strong>Apps Script (অ্যাপস স্ক্রিপ্ট)</strong> ক্লিক করুন।
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5 flex gap-3">
              <div className="w-6 h-6 rounded-full bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">৩</div>
              <div>
                <h4 className="font-bold text-white text-base">৩. কোড পেস্ট এবং সেভ</h4>
                <p className="mt-1 leading-relaxed">
                  সেখানে থাকা পূর্বের সকল কোড ডিলিট করে দিয়ে ডানদিকের 'কোড কপি করুন' বাটনে ক্লিক করে পাওয়া সম্পূর্ণ কোড পেস্ট করুন। ফাইলটি ওপরে থাকা সেভ আইকনে ক্লিক করে সেভ করুন।
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-sm text-slate-300">
            {/* Step 4 */}
            <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5 flex gap-3">
              <div className="w-6 h-6 rounded-full bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">৪</div>
              <div>
                <h4 className="font-bold text-white text-base">৪. অ্যাপাবলিকেশন ডিপ্লয় (Web App)</h4>
                <p className="mt-1 leading-relaxed">
                  ডানদিকের কোণে <strong>Deploy (প্রয়োগ করুন)</strong> -&gt; <strong>New Deployment (নতুন প্রয়োগ)</strong> সিলেক্ট করুন। গিয়ার আইকন থেকে <strong>Web App (ওয়েব অ্যাপ্লিকেশন)</strong> টাইপ বাছুন।
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5 flex gap-3">
              <div className="w-6 h-6 rounded-full bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">৫</div>
              <div>
                <h4 className="font-bold text-white text-base">৫. পারমিশন কনফিগারেশন</h4>
                <p className="mt-1 leading-relaxed">
                  Execute as হিসেবে <strong>"Me" (আপনার ইমেইল)</strong> এবং Who has access বক্সে অবশ্যই <strong>"Anyone" (যেকোনো ব্যক্তি)</strong> নির্বাচন করুন। এটি খুবই গুরুত্বপূর্ণ! অন্যথায় ইউজারদের ডেটা গুগল শিট এক্সেপ্ট করবে না।
                </p>
              </div>
            </div>

            {/* Step 6 */}
            <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5 flex gap-3">
              <div className="w-6 h-6 rounded-full bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">৬</div>
              <div>
                <h4 className="font-bold text-white text-base">৬. ডিপ্লয়মেন্ট ইউআরএল ব্যবহার</h4>
                <p className="mt-1 leading-relaxed">
                  সবশেষে <strong>Deploy</strong> চাপলে একটি 'Web App URL' পপআপ হবে। সেটি কপি করে এনে এই কন্ট্রোল সেন্টারের উপরের বক্সে পেস্ট করে সেভ করুন।
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Apps Script Preview Code Area */}
        <div className="rounded-2xl border border-white/10 overflow-hidden bg-slate-950">
          <div className="px-5 py-3 border-b border-white/10 flex justify-between items-center bg-slate-950/80">
            <span className="text-xs font-mono text-slate-400">apps-script.gs</span>
            <span className="text-xs text-amber-400 bg-amber-500/15 border border-amber-500/20 px-2 py-0.5 rounded">javascript</span>
          </div>
          <pre className="p-5 overflow-auto text-xs font-mono text-slate-300 max-h-80 leading-relaxed max-w-full">
            {appsScriptCode}
          </pre>
        </div>
      </div>

      <div className="flex justify-start">
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-full border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white transition flex items-center gap-2 text-sm cursor-pointer"
        >
          <Undo2 className="w-4 h-4" />
          ড্যাশবোর্ডে ফিরে যান
        </button>
      </div>
    </div>
  );
}
