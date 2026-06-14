/**
 * Administrative operations controller for vanilla Admin Panel
 */

let allRegistrations = [];

window.addEventListener('DOMContentLoaded', () => {
  // Check if already authenticated during current browser tab session
  const isAuth = sessionStorage.getItem('marketing_tour_admin_auth');
  if (isAuth === 'true') {
    revealAdminDashboard();
  }
});

/**
 * Handle password verification
 */
function handleAdminLogin(event) {
  event.preventDefault();
  const passInput = document.getElementById('admin-pass');
  const errorEl = document.getElementById('login-error');

  if (passInput.value === 'marketingtour2026') {
    sessionStorage.setItem('marketing_tour_admin_auth', 'true');
    revealAdminDashboard();
    errorEl.classList.add('hidden');
    passInput.value = "";
  } else {
    errorEl.classList.remove('hidden');
    passInput.focus();
  }
}

/**
 * Reveal the dashboard layout after login
 */
function revealAdminDashboard() {
  document.getElementById('login-modal').classList.add('hidden');
  document.getElementById('admin-panel').classList.remove('hidden');

  // Load configuration URL in the input
  const storedUrl = localStorage.getItem('marketing_tour_script_url');
  if (storedUrl) {
    document.getElementById('config-sheet-url').value = storedUrl;
  }

  // Load and render records
  loadRegistrations();
}

/**
 * Log out
 */
function handleAdminLogout() {
  sessionStorage.removeItem('marketing_tour_admin_auth');
  document.getElementById('admin-panel').classList.add('hidden');
  document.getElementById('login-modal').classList.remove('hidden');
}

/**
 * Open/close Google Sheet endpoints config panel
 */
function toggleConfigPanel() {
  const panel = document.getElementById('config-panel');
  const btn = document.getElementById('btn-toggle-config');
  if (panel.classList.contains('hidden')) {
    panel.classList.remove('hidden');
    btn.textContent = "ড্যাশবোর্ড দেখুন";
  } else {
    panel.classList.add('hidden');
    btn.textContent = "গুগল শিট কানেক্ট";
  }
}

/**
 * Save customized Apps Script configuration URL
 */
function saveAppsScriptUrl() {
  const urlVal = document.getElementById('config-sheet-url').value.trim();
  localStorage.setItem('marketing_tour_script_url', urlVal);
  
  const successMsg = document.getElementById('config-save-success');
  successMsg.classList.remove('hidden');
  setTimeout(() => successMsg.classList.add('hidden'), 2000);
}

/**
 * Get registration array from localStorage
 */
function loadRegistrations() {
  const saved = localStorage.getItem('marketing_tour_registrations');
  allRegistrations = saved ? JSON.parse(saved) : [];
  renderRegistrations();
}

/**
 * Refresh records list
 */
function refreshRegistrations() {
  loadRegistrations();
}

/**
 * Remove local database entries
 */
function wipeLocalStorageData() {
  if (confirm('আপনি কি নিশ্চিত যে আপনি স্থানীয় ব্রাউজারের সমস্ত রেজিস্ট্রেশন মুছে ফেলতে চান? গুগল শিট এর ডাটা এতে নিরাপদ থাকবে এবং মুছে যাবে না।')) {
    localStorage.removeItem('marketing_tour_registrations');
    allRegistrations = [];
    renderRegistrations();
  }
}

/**
 * Search and status filters, then DOM render table
 */
function renderRegistrations() {
  const body = document.getElementById('registrations-body');
  const searchVal = document.getElementById('admin-search').value.toLowerCase();
  const filterVal = document.getElementById('admin-filter').value;
  
  // Clear body
  body.innerHTML = "";

  const filtered = allRegistrations.filter(reg => {
    const matchesSearch = reg.name.toLowerCase().includes(searchVal) || 
                          reg.phone.includes(searchVal) || 
                          (reg.emergencyPhone && reg.emergencyPhone.includes(searchVal));
    
    if (filterVal === 'all') return matchesSearch;
    return matchesSearch && reg.participation === filterVal;
  });

  // Calculate statistics values
  let totalConfirmed = 0;
  let totalFamilies = 0;

  filtered.forEach(item => {
    if (item.participation === 'yes') {
      totalConfirmed++;
    }
    if (item.hasFamily === 'yes') {
      totalFamilies += (parseInt(item.familyCount) || 0);
    }
  });

  // Populate overall stats indicators using ALL registrations, not just filtered
  let overallTotal = allRegistrations.length;
  let overallConfirmed = allRegistrations.filter(r => r.participation === 'yes').length;
  let overallFamilies = allRegistrations.reduce((sum, r) => sum + (parseInt(r.familyCount) || 0), 0);
  let overallHeads = overallTotal + overallFamilies;

  document.getElementById('stat-total').textContent = `${overallTotal} জন`;
  document.getElementById('stat-confirmed').textContent = `${overallConfirmed} জন`;
  document.getElementById('stat-families').textContent = `${overallFamilies} জন`;
  document.getElementById('stat-heads').textContent = `${overallHeads} জন`;

  // Render rows
  if (filtered.length === 0) {
    body.innerHTML = `<tr><td colspan="7" class="p-12 text-center text-slate-500">কোনো রেজিস্ট্রেশন তথ্য খুঁজে পাওয়া যায়নি।</td></tr>`;
  } else {
    filtered.forEach(item => {
      const tr = document.createElement('tr');
      tr.className = "hover:bg-white/5 transition duration-150";

      const partBadge = item.participation === 'yes' 
        ? `<span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-500/10 text-teal-300 border border-teal-500/20">হ্যাঁ</span>`
        : item.participation === 'no'
        ? `<span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-300 border border-rose-500/20">না</span>`
        : `<span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">নিশ্চিত নই</span>`;

      const familyText = item.hasFamily === 'yes' ? `হ্যাঁ (${item.familyCount} জন)` : 'না';

      tr.innerHTML = `
        <td class="p-4 font-mono text-slate-400 whitespace-nowrap">${item.timestamp}</td>
        <td class="p-4 font-bold text-white whitespace-nowrap">${item.name}</td>
        <td class="p-4 font-mono whitespace-nowrap"><a href="tel:${item.phone}" class="hover:text-amber-300 transition">${item.phone}</a></td>
        <td class="p-4">${partBadge}</td>
        <td class="p-4 text-slate-300">${familyText}</td>
        <td class="p-4 font-mono whitespace-nowrap"><a href="tel:${item.emergencyPhone}" class="text-slate-300 hover:text-amber-300 transition">${item.emergencyPhone}</a></td>
        <td class="p-4 max-w-[180px] truncate text-slate-400" title="${item.notes || ''}">${item.notes || '-'}</td>
      `;
      body.appendChild(tr);
    });
  }

  document.getElementById('table-record-count').textContent = `ফিল্টারকৃত রেকর্ড সংখ্যা: ${filtered.length}`;
}

/**
 * Export actual registered records into CSV file format
 */
function exportCSVData() {
  if (allRegistrations.length === 0) {
    alert('রপ্তানি করার মতো কোনো রেজিস্ট্রেশন ডাটা নেই!');
    return;
  }

  const headers = ['Timestamp', 'Name', 'Mobile Number', 'Participation', 'Has Family', 'Family Members', 'Emergency Contact', 'Comments'];
  const rows = allRegistrations.map(reg => [
    `"${reg.timestamp}"`,
    `"${reg.name}"`,
    `"${reg.phone}"`,
    `"${reg.participation === 'yes' ? 'হ্যাঁ' : reg.participation === 'no' ? 'না' : 'এখনও নিশ্চিত নই'}"`,
    `"${reg.hasFamily === 'yes' ? 'হ্যাঁ' : 'না'}"`,
    reg.familyCount || 0,
    `"${reg.emergencyPhone}"`,
    `"${reg.notes ? reg.notes.replace(/"/g, '""') : ''}"`
  ]);

  const csvContent = '\uFEFF' // UTF-8 BOM representation
    + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'Marketing_Tour_Registrations_2026.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
