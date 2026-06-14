/**
 * Client-Side Controller for Marketing Department Tour Registration 2026
 * Handles form validation, DOM manipulation, conditional fields, 
 * local storage preservation, and Apps Script POST integration.
 */

// Global constant fallback Web App URL (can be customized via input/localStorage)
let GAS_WEB_APP_URL = localStorage.getItem('marketing_tour_script_url') || "";

window.addEventListener('DOMContentLoaded', () => {
  // Pre-load saved Apps Script URL if available
  const savedUrl = localStorage.getItem('marketing_tour_script_url');
  if (savedUrl) {
    GAS_WEB_APP_URL = savedUrl;
  }
  
  // Set default sample registrations if local storage is completely empty
  const savedRegs = localStorage.getItem('marketing_tour_registrations');
  if (!savedRegs) {
    const mockRegs = [
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
        notes: 'আমাদের মার্কেটিং বিভাগের সকলের স্বতঃস্ফূর্ত অংশগ্রহণ কামনা করছি!',
        agreement: true
      }
    ];
    localStorage.setItem('marketing_tour_registrations', JSON.stringify(mockRegs));
  }
});

/**
 * Handle display toggle of the family count count field
 */
function toggleFamilyCount(show) {
  const box = document.getElementById('familyCountBox');
  const countInput = document.getElementById('familyCount');
  if (show) {
    box.classList.remove('hidden');
    countInput.required = true;
  } else {
    box.classList.add('hidden');
    countInput.required = false;
    countInput.value = "";
  }
}

/**
 * Toggle individual Frequently Asked Question block
 */
function toggleFaq(index) {
  const answer = document.getElementById(`faq-ans-${index}`);
  const icon = document.getElementById(`faq-icon-${index}`);
  
  if (answer.classList.contains('hidden')) {
    answer.classList.remove('hidden');
    icon.textContent = "▲";
  } else {
    answer.classList.add('hidden');
    icon.textContent = "▼";
  }
}

/**
 * Handle form submissions safely with Client-Side validations
 */
async function handleFormSubmit(event) {
  event.preventDefault();
  
  // Clear any existing error indications
  const errorElements = document.querySelectorAll('[id^="error-"]');
  errorElements.forEach(el => el.classList.add('hidden'));

  // Elements
  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const emergencyPhoneInput = document.getElementById('emergencyPhone');
  const familyCountInput = document.getElementById('familyCount');
  const agreementCheckbox = document.getElementById('agreement');
  const notesInput = document.getElementById('notes');

  const partRadio = document.querySelector('input[name="participation"]:checked');
  const familyRadio = document.querySelector('input[name="hasFamily"]:checked');
  
  // Validation States
  let isValid = true;
  const phoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;

  // Name check
  if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
    document.getElementById('error-name').classList.remove('hidden');
    isValid = false;
  }

  // Personal Phone Check
  if (!phoneInput.value.trim() || !phoneRegex.test(phoneInput.value.trim())) {
    document.getElementById('error-phone').classList.remove('hidden');
    isValid = false;
  }

  // Family members toggle check
  const hasFamily = familyRadio ? familyRadio.value : 'no';
  let familyCount = 0;
  if (hasFamily === 'yes') {
    familyCount = parseInt(familyCountInput.value);
    if (!familyCount || familyCount <= 0 || isNaN(familyCount)) {
      document.getElementById('error-familyCount').classList.remove('hidden');
      isValid = false;
    }
  }

  // Emergency Contact Check
  if (!emergencyPhoneInput.value.trim() || !phoneRegex.test(emergencyPhoneInput.value.trim())) {
    document.getElementById('error-emergencyPhone').classList.remove('hidden');
    isValid = false;
  } else if (emergencyPhoneInput.value.trim() === phoneInput.value.trim()) {
    const err = document.getElementById('error-emergencyPhone');
    err.textContent = "জরুরি নম্বরটি আপনার নিজের মোবাইল নম্বর থেকে ভিন্ন হতে হবে";
    err.classList.remove('hidden');
    isValid = false;
  }

  // Agreement checked check
  if (!agreementCheckbox.checked) {
    document.getElementById('error-agreement').classList.remove('hidden');
    isValid = false;
  }

  if (!isValid) {
    // Scroll to first invalid item
    const firstErr = document.querySelector('[id^="error-"]:not(.hidden)');
    if (firstErr) {
      firstErr.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  // Submitting Animation
  const submitBtn = document.getElementById('btn-submit');
  const originalBtnText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "অনুরোধ প্রসেস হচ্ছে...";

  // Construct Data Structure
  const submissionTimestamp = new Date().toLocaleString("bn-BD", { timeZone: "Asia/Dhaka" });
  const submission = {
    id: 'reg_' + Date.now(),
    timestamp: submissionTimestamp,
    name: nameInput.value.trim(),
    phone: phoneInput.value.trim(),
    participation: partRadio ? partRadio.value : 'yes',
    hasFamily: hasFamily,
    familyCount: familyCount,
    emergencyPhone: emergencyPhoneInput.value.trim(),
    notes: notesInput.value.trim(),
    agreement: agreementCheckbox.checked
  };

  try {
    // 1. Save data instantly in localStorage first
    const existing = localStorage.getItem('marketing_tour_registrations');
    const list = existing ? JSON.parse(existing) : [];
    list.unshift(submission);
    localStorage.setItem('marketing_tour_registrations', JSON.stringify(list));

    // 2. Submit to Apps Script Web App Endpoint if configured
    if (GAS_WEB_APP_URL && GAS_WEB_APP_URL.trim() !== "") {
      const urlParams = new URLSearchParams();
      urlParams.append('timestamp', submission.timestamp);
      urlParams.append('name', submission.name);
      urlParams.append('phone', submission.phone);
      urlParams.append('participation', submission.participation === 'yes' ? 'হ্যাঁ' : submission.participation === 'no' ? 'না' : 'এখনও নিশ্চিত নই');
      urlParams.append('hasFamily', submission.hasFamily === 'yes' ? 'হ্যাঁ' : 'না');
      urlParams.append('familyCount', String(submission.familyCount));
      urlParams.append('emergencyPhone', submission.emergencyPhone);
      urlParams.append('notes', submission.notes);

      await fetch(GAS_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: urlParams.toString()
      });
    }

    // Success UI Transition
    document.getElementById('registration-form').classList.add('hidden');
    document.getElementById('success-screen').classList.remove('hidden');

  } catch (error) {
    console.error('Submission tracking failed', error);
    alert('সার্ভারে ডেটা পাঠাতে ত্রুটি হয়েছে। তবে রেজিস্ট্রেশনটি ব্রাউজারের স্থানীয় স্টোরেজে সফলভাবে সুরক্ষিত হয়েছে!');
    document.getElementById('registration-form').classList.add('hidden');
    document.getElementById('success-screen').classList.remove('hidden');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
  }
}

/**
 * Reset form views to allow subsequent registrations
 */
function resetForm() {
  document.getElementById('registration-form').reset();
  toggleFamilyCount(false);
  document.getElementById('success-screen').classList.add('hidden');
  document.getElementById('registration-form').classList.remove('hidden');
}
