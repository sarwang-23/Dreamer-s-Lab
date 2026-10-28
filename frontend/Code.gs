/**
 * Building Dreams – Google Apps Script Backend
 * ─────────────────────────────────────────────
 * Handles form submissions from all pages:
 *   - Dreamers Lab Apply / Get-Started  (student)
 *   - University Founders Apply          (founder)
 *   - Schools / Get-Started partnership  (school)
 *   - Community Join                     (community)
 *   - Contact / Enquiry                  (contact)
 *   - Insights Newsletter                (newsletter)
 *   - Universities partnership           (universities)
 *
 * On each submission:
 *   1. Appends a row to the matching sheet tab in the spreadsheet
 *   2. Emails admin (rachit@thebuildingdreams.com)
 *   3. Sends a warm congratulations/confirmation email to the user
 *
 * SETUP INSTRUCTIONS
 * ──────────────────
 * 1. Open Google Sheets → Extensions → Apps Script
 * 2. Paste this entire file, replacing any default code
 * 3. Replace SPREADSHEET_ID below with your sheet ID (from the URL)
 * 4. Deploy → New Deployment → Web App
 *      Execute as: Me
 *      Who has access: Anyone
 * 5. Copy the web-app URL and put it in bd-form-handler.js (SCRIPT_URL constant)
 */

// CONFIG
var SPREADSHEET_ID = "1XtkAAF7FLPdSU3SSR8CZuzjduDH0FIB2FCvshysqejw"; // ✅ New Sheet (updated 2026-10-28)
var ADMIN_EMAIL    = "rachit@thebuildingdreams.com";
var SITE_NAME      = "Building Dreams";

// MAIN ENTRY POINT
function doPost(e) {
  try {
    var params   = e.parameter || {};
    var formType = params.form_type || "unknown";
    var refPage  = params.ref_page  || "Direct";
    Logger.log("=== FORM SUBMISSION ===");
    Logger.log("Form Type: " + formType);
    Logger.log("All params: " + JSON.stringify(params));
    var timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var result;

    switch (formType) {
      case "student_apply":        result = handleStudentApply(ss, params, timestamp, refPage);        break;
      case "founder_apply":        result = handleFounderApply(ss, params, timestamp, refPage);        break;
      case "pricing_enrol":
      case "enrol_apply":          result = handlePricingEnrol(ss, params, timestamp, refPage);        break;
      case "school_enquiry":       result = handleSchoolEnquiry(ss, params, timestamp, refPage);       break;
      case "community_join":       result = handleCommunityJoin(ss, params, timestamp, refPage);       break;
      case "contact_enquiry":      result = handleContactEnquiry(ss, params, timestamp, refPage);      break;
      case "newsletter":           result = handleNewsletter(ss, params, timestamp, refPage);          break;
      case "university_partnership": result = handleUniversityPartnership(ss, params, timestamp, refPage); break;
      default:                     result = { success: false, message: "Unknown form type: " + formType };
    }

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// SHEET HELPERS
function getOrCreateSheet(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    var hRange = sheet.getRange(1, 1, 1, headers.length);
    hRange.setBackground("#1a1a2e");
    hRange.setFontColor("#ffffff");
    hRange.setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// 1. STUDENT APPLICATION
function handleStudentApply(ss, p, ts, ref) {
  var userEmail = (p.parent_email || p.email || p.student_email || "").trim();
  Logger.log("[Student] parent_email=" + p.parent_email + " | email=" + p.email + " | student_email=" + p.student_email);
  Logger.log("[Student] Resolved userEmail=" + userEmail);
  var headers = ["Timestamp","Source Page","Student Name","Grade","School","Parent Name","Parent Email","Parent Phone","Interests","Idea / Problem","Why Building Dreams","Accessibility Notes"];
  var sheet = getOrCreateSheet(ss, "Student Applications", headers);
  sheet.appendRow([ts, ref, p.student_name||"", p.grade||"", p.school||"", p.parent_name||"", userEmail, p.parent_phone||"", p.interests||"", p.idea||"", p.why||"", p.accessibility||""]);

  sendAdminEmail("New Student Application – " + (p.student_name||"Unknown"), buildAdminTable("Student Application", {
    "Student Name": p.student_name, "Grade": p.grade, "School": p.school,
    "Parent Name": p.parent_name, "Parent Email": userEmail, "Parent Phone": p.parent_phone,
    "Interests": p.interests, "Idea / Problem": p.idea, "Why Building Dreams": p.why,
    "Notes": p.accessibility, "Source Page": ref, "Timestamp": ts
  }));

  var emailStatus = { sent: false, note: "No email provided" };
  if (userEmail) {
    emailStatus = sendUserEmail(userEmail, "Congratulations! Application to Building Dreams Received – Dreamers Lab", buildStudentConfirmation(p));
    Logger.log("[Student] emailStatus=" + JSON.stringify(emailStatus));
  } else {
    Logger.log("[Student] WARNING: userEmail is EMPTY — no confirmation email sent!");
  }
  return { success: true, message: "Application received successfully!", userEmailSentTo: userEmail, emailStatus: emailStatus };
}

// 2. FOUNDER APPLICATION
function handleFounderApply(ss, p, ts, ref) {
  var userEmail = (p.founder_email || p.email || "").trim();
  var headers = ["Timestamp","Source Page","Founder Name","Email","University","Course & Year","Startup Name","Current Stage","Problem Statement","Help Needed","Team Members","Time Commitment","Links"];
  var sheet = getOrCreateSheet(ss, "Founder Applications", headers);
  sheet.appendRow([ts, ref, p.founder_name||"", userEmail, p.university||"", p.course_year||"", p.startup_name||"", p.current_stage||"", p.problem_statement||"", p.help_needed||"", p.team_members||"", p.time_commitment||"", p.links||""]);

  sendAdminEmail("New Founder Application – " + (p.startup_name||p.founder_name||"Unknown"), buildAdminTable("Founder Application", {
    "Founder Name": p.founder_name, "Email": userEmail, "University": p.university,
    "Course & Year": p.course_year, "Startup Name": p.startup_name, "Current Stage": p.current_stage,
    "Problem Statement": p.problem_statement, "Help Needed": p.help_needed,
    "Team Members": p.team_members, "Time Commitment": p.time_commitment, "Links": p.links,
    "Source Page": ref, "Timestamp": ts
  }));

  var emailStatus = { sent: false, note: "No email provided" };
  if (userEmail) {
    emailStatus = sendUserEmail(userEmail, "Congratulations! Your Founder Application to Building Dreams is Received", buildFounderConfirmation(p));
  }
  return { success: true, message: "Founder application received!", userEmailSentTo: userEmail, emailStatus: emailStatus };
}

// 2b. PRICING / ENROLMENT
function handlePricingEnrol(ss, p, ts, ref) {
  var userEmail = (p.email || "").trim();
  var headers = ["Timestamp","Source Page","Program","Name","Email","Phone","Notes"];
  var sheet = getOrCreateSheet(ss, "Program Enrolments", headers);
  sheet.appendRow([ts, ref, p.program||"", p.name||"", userEmail, p.phone||"", p.notes||""]);

  sendAdminEmail("New Program Enrolment – " + (p.name||"Unknown") + " [" + (p.program||"Program") + "]", buildAdminTable("Program Enrolment", {
    "Program": p.program, "Name": p.name, "Email": userEmail, "Phone": p.phone,
    "Notes": p.notes, "Source Page": ref, "Timestamp": ts
  }));

  var emailStatus = { sent: false, note: "No email provided" };
  if (userEmail) {
    emailStatus = sendUserEmail(userEmail, "Congratulations! Welcome to Building Dreams – Enrolment Received", buildPricingEnrolConfirmation(p));
  }
  return { success: true, message: "Enrolment received successfully!", userEmailSentTo: userEmail, emailStatus: emailStatus };
}

// 3. SCHOOL ENQUIRY
function handleSchoolEnquiry(ss, p, ts, ref) {
  var userEmail = (p.email || p.school_email || "").trim();
  var headers = ["Timestamp","Source Page","Contact Name","Email","Phone","School Name","Grade Levels","Program Type","Message"];
  var sheet = getOrCreateSheet(ss, "School Enquiries", headers);
  sheet.appendRow([ts, ref, p.name||"", userEmail, p.phone||"", p.school||p.organisation||"", p.grades||"", p.program_type||"", p.message||""]);

  sendAdminEmail("New School Enquiry – " + (p.school||p.organisation||"Unknown"), buildAdminTable("School Enquiry", {
    "Contact Name": p.name, "Email": userEmail, "Phone": p.phone,
    "School": p.school||p.organisation, "Grade Levels": p.grades, "Program Type": p.program_type,
    "Message": p.message, "Source Page": ref, "Timestamp": ts
  }));

  var emailStatus = { sent: false, note: "No email provided" };
  if (userEmail) {
    emailStatus = sendUserEmail(userEmail, "Thank you for reaching out – Building Dreams for Schools", buildSchoolConfirmation(p));
  }
  return { success: true, message: "School enquiry received!", userEmailSentTo: userEmail, emailStatus: emailStatus };
}

// 4. COMMUNITY JOIN
function handleCommunityJoin(ss, p, ts, ref) {
  var userEmail = (p.email || "").trim();
  var headers = ["Timestamp","Source Page","Full Name","Email","Role","Interest / Domain","LinkedIn","Message"];
  var sheet = getOrCreateSheet(ss, "Community Members", headers);
  sheet.appendRow([ts, ref, p.name||"", userEmail, p.role||"", p.interest||"", p.linkedin||"", p.message||""]);

  sendAdminEmail("New Community Member – " + (p.name||"Unknown"), buildAdminTable("Community Join", {
    "Name": p.name, "Email": userEmail, "Role": p.role, "Interest": p.interest,
    "LinkedIn": p.linkedin, "Message": p.message, "Source Page": ref, "Timestamp": ts
  }));

  var emailStatus = { sent: false, note: "No email provided" };
  if (userEmail) {
    emailStatus = sendUserEmail(userEmail, "Welcome to the Building Dreams Community, " + (p.name||"there") + "!", buildCommunityConfirmation(p));
  }
  return { success: true, message: "Community application received!", userEmailSentTo: userEmail, emailStatus: emailStatus };
}

// 5. CONTACT ENQUIRY
function handleContactEnquiry(ss, p, ts, ref) {
  var userEmail = (p.email || "").trim();
  var headers = ["Timestamp","Source Page","Journey / Type","Name","Email","Phone","Organisation","Message"];
  var sheet = getOrCreateSheet(ss, "Contact Enquiries", headers);
  sheet.appendRow([ts, ref, p.journey||"", p.name||"", userEmail, p.phone||"", p.organisation||"", p.looking||p.message||""]);

  sendAdminEmail("New Contact Enquiry – " + (p.name||"Unknown") + " [" + (p.journey||"General") + "]", buildAdminTable("Contact Enquiry", {
    "Journey Type": p.journey, "Name": p.name, "Email": userEmail, "Phone": p.phone,
    "Organisation": p.organisation, "Message": p.looking||p.message, "Source Page": ref, "Timestamp": ts
  }));

  var emailStatus = { sent: false, note: "No email provided" };
  if (userEmail) {
    emailStatus = sendUserEmail(userEmail, "We received your message – Building Dreams", buildContactConfirmation(p));
  }
  return { success: true, message: "Enquiry received!", userEmailSentTo: userEmail, emailStatus: emailStatus };
}

// 6. NEWSLETTER
function handleNewsletter(ss, p, ts, ref) {
  var userEmail = (p.email || "").trim();
  var headers = ["Timestamp","Source Page","Email"];
  var sheet = getOrCreateSheet(ss, "Newsletter Subscribers", headers);
  sheet.appendRow([ts, ref, userEmail]);

  sendAdminEmail("New Newsletter Subscriber – " + userEmail, buildAdminTable("Newsletter Subscription", {
    "Email": userEmail, "Source Page": ref, "Timestamp": ts
  }));

  var emailStatus = { sent: false, note: "No email provided" };
  if (userEmail) {
    emailStatus = sendUserEmail(userEmail, "You're now part of the Building Dreams Insider List!", buildNewsletterConfirmation(p));
  }
  return { success: true, message: "Subscribed successfully!", userEmailSentTo: userEmail, emailStatus: emailStatus };
}

// 7. UNIVERSITY PARTNERSHIP
function handleUniversityPartnership(ss, p, ts, ref) {
  var userEmail = (p.email || "").trim();
  var headers = ["Timestamp","Source Page","Name","Designation","Institution","Email","Phone","Partnership Type","Existing Initiatives","What to Build","Timeline"];
  var sheet = getOrCreateSheet(ss, "University Partnerships", headers);
  sheet.appendRow([ts, ref, p.name||"", p.designation||"", p.organisation||"", userEmail, p.phone||"", p.partnership||"", p.initiatives||"", p.build||"", p.timeline||""]);

  sendAdminEmail("New University Partnership – " + (p.organisation||"Unknown"), buildAdminTable("University Partnership", {
    "Name": p.name, "Designation": p.designation, "Institution": p.organisation,
    "Email": userEmail, "Phone": p.phone, "Partnership Type": p.partnership,
    "Existing Initiatives": p.initiatives, "What to Build": p.build,
    "Timeline": p.timeline, "Source Page": ref, "Timestamp": ts
  }));

  var emailStatus = { sent: false, note: "No email provided" };
  if (userEmail) {
    emailStatus = sendUserEmail(userEmail, "Your Partnership Enquiry – Building Dreams for Universities", buildUniversityConfirmation(p));
  }
  return { success: true, message: "Partnership enquiry received!", userEmailSentTo: userEmail, emailStatus: emailStatus };
}

// EMAIL HELPERS
function sendAdminEmail(subject, htmlBody) {
  var sheetLink = 'https://docs.google.com/spreadsheets/d/' + SPREADSHEET_ID + '/edit';
  var cleanSubject = "Building Dreams: " + subject.replace(/^\[.*?\]\s*/, "");
  var plainText = cleanSubject + "\n\nDirect Link to Google Sheet:\n" + sheetLink + "\n\nPlease view details in your spreadsheet or HTML view.";
  try {
    MailApp.sendEmail({
      to: ADMIN_EMAIL,
      subject: cleanSubject,
      body: plainText,
      htmlBody: wrapAdminEmail(htmlBody),
      name: "Building Dreams"
    });
    Logger.log("Admin email successfully sent via MailApp to: " + ADMIN_EMAIL);
  } catch (err1) {
    Logger.log("Admin email MailApp failed (" + err1 + "). Trying GmailApp...");
    try {
      GmailApp.sendEmail(ADMIN_EMAIL, cleanSubject, plainText, {
        htmlBody: wrapAdminEmail(htmlBody),
        name: "Building Dreams"
      });
      Logger.log("Admin email successfully sent via GmailApp to: " + ADMIN_EMAIL);
    } catch (err2) {
      Logger.log("Admin email failed both MailApp and GmailApp: " + err2);
    }
  }
}

function sendUserEmail(to, subject, htmlBody) {
  if (!to || typeof to !== "string" || to.indexOf("@") === -1) {
    Logger.log("Invalid user email: " + to);
    return { sent: false, error: "Invalid user email: " + to };
  }
  to = to.trim();
  var plainText = "Thank you for reaching out to Building Dreams! We have received your application/enquiry.";
  
  // Try GmailApp first — sends directly from your Google Workspace account with full DKIM/SPF
  try {
    GmailApp.sendEmail(to, subject, plainText, {
      htmlBody: wrapUserEmail(htmlBody),
      name: "Building Dreams",
      replyTo: ADMIN_EMAIL
    });
    Logger.log("User email successfully sent via GmailApp to: " + to);
    return { sent: true, recipient: to, method: "GmailApp" };
  } catch (err1) {
    Logger.log("GmailApp failed (" + err1 + "). Trying MailApp fallback...");
    try {
      MailApp.sendEmail({
        to: to,
        subject: subject,
        body: plainText,
        htmlBody: wrapUserEmail(htmlBody),
        name: "Building Dreams",
        replyTo: ADMIN_EMAIL
      });
      Logger.log("User email successfully sent via MailApp fallback to: " + to);
      return { sent: true, recipient: to, method: "MailApp" };
    } catch (err2) {
      Logger.log("Both GmailApp and MailApp failed: " + err2);
      return { sent: false, error: "GmailApp: " + err1.toString() + " | MailApp: " + err2.toString() };
    }
  }
}

function buildAdminTable(formLabel, dataObj) {
  var sheetLink = 'https://docs.google.com/spreadsheets/d/' + SPREADSHEET_ID + '/edit';
  var rows = '<tr><td style="padding:10px 12px;font-weight:700;background:#fff2ec;color:#c04010;border:1px solid #fed7aa;">📊 Google Sheet Link</td><td style="padding:10px 12px;border:1px solid #fed7aa;background:#fff8f4;"><a href="' + sheetLink + '" target="_blank" style="color:#FF5A24;font-weight:800;text-decoration:underline;font-size:14px;">Open Google Sheet Responses &rarr;</a></td></tr>';
  for (var key in dataObj) {
    var val = dataObj[key] || "—";
    rows += '<tr><td style="padding:8px 12px;font-weight:600;background:#f5f5f5;border:1px solid #e0e0e0;white-space:nowrap;">' + key + '</td><td style="padding:8px 12px;border:1px solid #e0e0e0;">' + val + '</td></tr>';
  }
  return '<h2 style="color:#1a1a2e;margin:0 0 16px;">' + formLabel + ' Submission</h2><table style="border-collapse:collapse;width:100%;font-size:14px;">' + rows + '</table>';
}

// USER EMAIL BODIES
function buildStudentConfirmation(p) {
  return '<div style="background:#10483D;color:#ffffff;padding:20px 24px;border-radius:10px;margin-bottom:24px;text-align:center;">'
    + '<div style="display:inline-block;background:#FF5A24;color:#ffffff;font-size:11px;font-weight:700;letter-spacing:1px;padding:3px 12px;border-radius:12px;margin-bottom:10px;text-transform:uppercase;">Dreamers Lab 2026</div>'
    + '<h2 style="margin:0;color:#F6C845;font-size:22px;font-weight:700;">Congratulations on Taking the First Step!</h2>'
    + '<p style="margin:8px 0 0;color:#e8f4f1;font-size:14px;">Your application for Dreamers Lab 2026 has been received.</p>'
    + '</div>'
    + '<p>Hi <strong>' + (p.parent_name||"there") + '</strong> & <strong>' + (p.student_name||"Student") + '</strong>,</p>'
    + '<p>Thank you for applying to <strong>Dreamers Lab 2026</strong>. We are thrilled to see young minds enthusiastic about building real solutions!</p>'
    + '<p>Our admissions committee will carefully review the application and reach out to <strong>' + (p.parent_email || p.email || "") + '</strong> within 2–3 business days with the next steps.</p>'
    + '<div style="background:#F7F5ED;border-left:4px solid #10483D;padding:14px 16px;margin:18px 0;border-radius:4px;">'
    + '<strong style="color:#10483D;">Idea / Problem Submitted:</strong><br>'
    + '<em style="color:#333;">' + (p.idea || "To be explored during the cohort") + '</em>'
    + '</div>'
    + '<p>Looking forward to building dreams together,<br><br>Warm regards,<br><strong>The Building Dreams Team</strong></p>';
}

function buildFounderConfirmation(p) {
  return '<div style="background:#10483D;color:#ffffff;padding:20px 24px;border-radius:10px;margin-bottom:24px;text-align:center;">'
    + '<div style="display:inline-block;background:#FF5A24;color:#ffffff;font-size:11px;font-weight:700;letter-spacing:1px;padding:3px 12px;border-radius:12px;margin-bottom:10px;text-transform:uppercase;">Founder Application</div>'
    + '<h2 style="margin:0;color:#F6C845;font-size:22px;font-weight:700;">Congratulations, Founder!</h2>'
    + '<p style="margin:8px 0 0;color:#e8f4f1;font-size:14px;">Your Founder Application has been received.</p>'
    + '</div>'
    + '<p>Hi <strong>' + (p.founder_name||"there") + '</strong>,</p>'
    + '<p>Your application for <strong>' + (p.startup_name||"your venture") + '</strong> is officially in! We are excited to review what you\'re building at <strong>' + (p.university||"your university") + '</strong>.</p>'
    + '<p>Our venture team will review your application and get back to you at <strong>' + (p.founder_email || p.email || "") + '</strong> shortly with scheduling details for an introductory call.</p>'
    + '<div style="background:#F7F5ED;border-left:4px solid #FF5A24;padding:14px 16px;margin:18px 0;border-radius:4px;">'
    + '<strong style="color:#10483D;">Problem You\'re Solving:</strong><br>'
    + '<em style="color:#333;">' + (p.problem_statement || "—") + '</em>'
    + '</div>'
    + '<p>Keep building and stay bold,<br><br>Warm regards,<br><strong>The Building Dreams Team</strong></p>';
}

function buildPricingEnrolConfirmation(p) {
  return '<div style="background:#10483D;color:#ffffff;padding:20px 24px;border-radius:10px;margin-bottom:24px;text-align:center;">'
    + '<div style="display:inline-block;background:#FF5A24;color:#ffffff;font-size:11px;font-weight:700;letter-spacing:1px;padding:3px 12px;border-radius:12px;margin-bottom:10px;text-transform:uppercase;">Welcome to Cohort</div>'
    + '<h2 style="margin:0;color:#F6C845;font-size:22px;font-weight:700;">Congratulations & Welcome!</h2>'
    + '<p style="margin:8px 0 0;color:#e8f4f1;font-size:14px;">Your enrolment enquiry has been recorded.</p>'
    + '</div>'
    + '<p>Hi <strong>' + (p.name||"Founder") + '</strong>,</p>'
    + '<p>We have successfully received your enrolment application for <strong>' + (p.program||"Building Dreams") + '</strong>.</p>'
    + '<p>Our cohort team will review your submission and contact you at <strong>' + (p.email||"") + '</strong> within 24 hours to guide you through onboarding and next steps.</p>'
    + '<p>Keep dreaming, keep building,<br><br>Warm regards,<br><strong>The Building Dreams Team</strong></p>';
}

function buildSchoolConfirmation(p) {
  return '<h2>Hi ' + (p.name||"there") + ',</h2><p>Thank you for your interest in bringing Building Dreams to <strong>' + (p.school||p.organisation||"your school") + '</strong>!</p><p>We\'ll reach out to <strong>' + p.email + '</strong> within 2-3 business days.</p><p>Warm regards,<br><strong>The Building Dreams Team</strong></p>';
}
function buildCommunityConfirmation(p) {
  return '<div style="background:#10483D;color:#ffffff;padding:20px 24px;border-radius:10px;margin-bottom:24px;text-align:center;"><div style="display:inline-block;background:#FF5A24;color:#ffffff;font-size:11px;font-weight:700;letter-spacing:1px;padding:3px 12px;border-radius:12px;margin-bottom:10px;text-transform:uppercase;">Community</div><h2 style="margin:0;color:#F6C845;font-size:22px;font-weight:700;">Welcome to the Community!</h2></div><p>Hi <strong>' + (p.name||"there") + '</strong>,</p><p>You\'ve successfully joined the <strong>Building Dreams Community</strong>. We\'re thrilled to have you.</p><p>Watch your inbox — cohort updates, events, and opportunities are coming soon.</p><p>See you on the inside,<br><strong>The Building Dreams Team</strong></p>';
}
function buildContactConfirmation(p) {
  return '<h2>Hi ' + (p.name||"there") + ',</h2><p>We\'ve received your message and our team will get back to you at <strong>' + p.email + '</strong> within 1-2 business days.</p><p>Speak soon,<br><strong>The Building Dreams Team</strong></p>';
}
function buildNewsletterConfirmation(p) {
  return '<div style="background:#10483D;color:#ffffff;padding:20px 24px;border-radius:10px;margin-bottom:24px;text-align:center;"><div style="display:inline-block;background:#FF5A24;color:#ffffff;font-size:11px;font-weight:700;letter-spacing:1px;padding:3px 12px;border-radius:12px;margin-bottom:10px;text-transform:uppercase;">Insider List</div><h2 style="margin:0;color:#F6C845;font-size:22px;font-weight:700;">You\'re In!</h2></div><p>Welcome to the <strong>Building Dreams Insider List</strong>. You\'ll be among the first to hear about new cohorts, events, and builder stories.</p><p>Stay curious,<br><strong>The Building Dreams Team</strong></p>';
}
function buildUniversityConfirmation(p) {
  return '<h2>Hi ' + (p.name||"there") + ',</h2><p>Thank you for your interest in partnering with Building Dreams at <strong>' + (p.organisation||"your institution") + '</strong>!</p><p>We\'ll review your enquiry and reach out at <strong>' + p.email + '</strong> to schedule a call.</p><p>Looking forward to collaborating,<br><strong>The Building Dreams Team</strong></p>';
}

// EMAIL WRAPPERS
function wrapAdminEmail(body) {
  var sheetLink = 'https://docs.google.com/spreadsheets/d/' + SPREADSHEET_ID + '/edit';
  return '<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f0f0f0;font-family:Arial,sans-serif;">'
    + '<div style="max-width:600px;margin:24px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.12);">'
    + '<div style="background:#1a1a2e;padding:20px 24px;"><h1 style="margin:0;color:#fff;font-size:18px;">Building Dreams — New Submission</h1></div>'
    + '<div style="padding:24px;">'
    + body
    + '<div style="margin-top:24px;padding:16px;background:#f9fafb;border:1px dashed #d1d5db;border-radius:6px;text-align:center;">'
    + '<p style="margin:0 0 10px;font-size:13px;color:#6b7280;font-weight:600;">Direct Link to Excel / Google Sheet:</p>'
    + '<a href="' + sheetLink + '" target="_blank" style="background:#FF5A24;color:#ffffff;text-decoration:none;padding:10px 20px;border-radius:6px;font-weight:bold;font-size:14px;display:inline-block;">📊 Open Google Sheet</a>'
    + '<p style="margin:8px 0 0;font-size:11px;color:#9ca3af;word-break:break-all;">' + sheetLink + '</p>'
    + '</div>'
    + '</div>'
    + '<div style="background:#f5f5f5;padding:12px 24px;font-size:12px;color:#888;">This is an automated notification from the Building Dreams website.</div>'
    + '</div></body></html>';
}
function wrapUserEmail(body) {
  var logoUrl = "https://raw.githubusercontent.com/sarwang-23/Dreamer-s-Lab/main/frontend/public/assets/building-dreams-logo.jpg";
  return '<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;">'
    + '<div style="max-width:600px;margin:24px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,0.06);border:1px solid #e5e7eb;">'
    + '<div style="background:#ffffff;padding:26px 24px 20px 24px;text-align:center;border-bottom:1px solid #f0f0f0;">'
    + '<a href="https://thebuildingdreams.com" target="_blank" style="text-decoration:none;display:inline-block;">'
    + '<img src="' + logoUrl + '" alt="Building Dreams — Converting Ideas into Successful Ventures" width="260" style="display:block;margin:0 auto;max-width:260px;width:100%;height:auto;border:0;outline:none;" />'
    + '</a>'
    + '</div>'
    + '<div style="padding:32px 28px;color:#222222;line-height:1.75;font-size:15px;background:#ffffff;">'
    + body
    + '</div>'
    + '<div style="background:#10483D;padding:22px 24px;text-align:center;color:#ffffff;">'
    + '<p style="margin:0 0 6px 0;font-size:14px;font-weight:700;letter-spacing:0.5px;color:#F6C845;">Building Dreams</p>'
    + '<p style="margin:0 0 10px 0;color:#A9DFD1;font-size:12px;">Where Dreamers Become Builders &middot; Converting Ideas into Successful Ventures</p>'
    + '<p style="margin:0;color:#7aa89e;font-size:11px;">&copy; ' + new Date().getFullYear() + ' Building Dreams. All rights reserved.</p>'
    + '</div>'
    + '</div></body></html>';
}

function doGet(e) {
  var quota = -1;
  try { quota = MailApp.getRemainingDailyQuota(); } catch (err) { quota = "error: " + err; }
  return ContentService.createTextOutput(JSON.stringify({
    status: "ok",
    app: "Building Dreams Web App Backend",
    version: "2026-10-22-v3",
    spreadsheetId: SPREADSHEET_ID,
    adminEmail: ADMIN_EMAIL,
    remainingDailyEmailQuota: quota
  })).setMimeType(ContentService.MimeType.JSON);
}

// TEST FUNCTION — Run this inside Apps Script editor to authorize email & spreadsheet access!
function testAdminAndUserEmail() {
  var testEmail = ADMIN_EMAIL;
  var timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // Test Sheet row append
  var testSheet = getOrCreateSheet(ss, "Test Submissions", ["Timestamp", "Status", "Note"]);
  testSheet.appendRow([timestamp, "Success", "Test run from Apps Script editor"]);

  // Test Admin email
  sendAdminEmail("Test Notification & Sheet Link", "<p>This is a test submission. If you see this, email sending and Google Sheets connectivity are fully functional!</p>");

  // Test User confirmation email
  sendUserEmail(testEmail, "Welcome to Building Dreams (Test Confirmation)!", "<p>Congratulations! Your email system is working properly.</p>");

  Logger.log("Test completed! Check your inbox for: " + testEmail);
}

// DEBUG: Test user congratulation email to ANY email address
// 1. Change testTargetEmail to the user's email
// 2. Run this function in Apps Script editor
// 3. Check inbox + SPAM of that email
function testUserCongratulationEmail() {
  var testTargetEmail = "rachit@thebuildingdreams.com"; // YAHAN user ka email daalo

  Logger.log("Sending test congratulation email to: " + testTargetEmail);

  var result = sendUserEmail(
    testTargetEmail,
    "Congratulations! Application to Building Dreams Received",
    buildStudentConfirmation({
      parent_name: "Test Parent",
      student_name: "Test Student",
      parent_email: testTargetEmail,
      idea: "Test idea",
      grade: "Grade 9",
      school: "Test School"
    })
  );

  Logger.log("Result: " + JSON.stringify(result));
  if (result.sent) {
    Logger.log("SUCCESS — sent to: " + testTargetEmail + " via " + result.method);
  } else {
    Logger.log("FAILED — Error: " + result.error);
  }
}


