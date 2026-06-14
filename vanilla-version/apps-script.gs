/**
 * Google Sheets Database Bridge for Marketing Tour 2026
 * Developed for Azam Khan Government Commerce College marketing department tour.
 * 
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
        "মন্তব্য"
      ]);
      // Format headers
      sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#0f2446").setFontColor("#ffffff");
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
    
    // Append submission data row instantly
    sheet.appendRow([
      timestamp,
      name,
      phone,
      participation,
      hasFamily,
      familyCount,
      emergencyPhone,
      notes
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
}
