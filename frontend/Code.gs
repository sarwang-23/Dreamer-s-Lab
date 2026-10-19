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
 *   2. Emails admin (Rachit@hinovi.me)
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
var SPREADSHEET_ID = "1g0iW9lHwv_Yx-3wtyopaU5D8OWm8s8JRSoHPPY_of9g"; // ← replace this
var ADMIN_EMAIL    = "Rachit@hinovi.me";
var SITE_NAME      = "Building Dreams";

// MAIN ENTRY POINT
function doPost(e) {
  try {
    var params   = e.parameter || {};
    var formType = params.form_type || "unknown";
    var refPage  = params.ref_page  || "Direct";
    var timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var result;

    switch (formType) {
      case "student_apply":        result = handleStudentApply(ss, params, timestamp, refPage);        break;
      case "founder_apply":        result = handleFounderApply(ss, params, timestamp, refPage);        break;
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
  var headers = ["Timestamp","Source Page","Student Name","Grade","School","Parent Name","Parent Email","Parent Phone","Interests","Idea / Problem","Why Building Dreams","Accessibility Notes"];
  var sheet = getOrCreateSheet(ss, "Student Applications", headers);
  sheet.appendRow([ts, ref, p.student_name||"", p.grade||"", p.school||"", p.parent_name||"", p.parent_email||"", p.parent_phone||"", p.interests||"", p.idea||"", p.why||"", p.accessibility||""]);

  sendAdminEmail("New Student Application – " + (p.student_name||"Unknown"), buildAdminTable("Student Application", {
    "Student Name": p.student_name, "Grade": p.grade, "School": p.school,
    "Parent Name": p.parent_name, "Parent Email": p.parent_email, "Parent Phone": p.parent_phone,
    "Interests": p.interests, "Idea / Problem": p.idea, "Why Building Dreams": p.why,
    "Notes": p.accessibility, "Source Page": ref, "Timestamp": ts
  }));

  if (p.parent_email) sendUserEmail(p.parent_email, "Your child's Application to Building Dreams – Received!", buildStudentConfirmation(p));
  return { success: true, message: "Application received successfully!" };
}

// 2. FOUNDER APPLICATION
function handleFounderApply(ss, p, ts, ref) {
  var headers = ["Timestamp","Source Page","Founder Name","Email","University","Course & Year","Startup Name","Current Stage","Problem Statement","Help Needed","Team Members","Time Commitment","Links"];
  var sheet = getOrCreateSheet(ss, "Founder Applications", headers);
  sheet.appendRow([ts, ref, p.founder_name||"", p.founder_email||"", p.university||"", p.course_year||"", p.startup_name||"", p.current_stage||"", p.problem_statement||"", p.help_needed||"", p.team_members||"", p.time_commitment||"", p.links||""]);

  sendAdminEmail("New Founder Application – " + (p.startup_name||p.founder_name||"Unknown"), buildAdminTable("Founder Application", {
    "Founder Name": p.founder_name, "Email": p.founder_email, "University": p.university,
    "Course & Year": p.course_year, "Startup Name": p.startup_name, "Current Stage": p.current_stage,
    "Problem Statement": p.problem_statement, "Help Needed": p.help_needed,
    "Team Members": p.team_members, "Time Commitment": p.time_commitment, "Links": p.links,
    "Source Page": ref, "Timestamp": ts
  }));

  if (p.founder_email) sendUserEmail(p.founder_email, "Your Founder Application to Building Dreams – Received!", buildFounderConfirmation(p));
  return { success: true, message: "Founder application received!" };
}

// 3. SCHOOL ENQUIRY
function handleSchoolEnquiry(ss, p, ts, ref) {
  var headers = ["Timestamp","Source Page","Contact Name","Email","Phone","School Name","Grade Levels","Program Type","Message"];
  var sheet = getOrCreateSheet(ss, "School Enquiries", headers);
  sheet.appendRow([ts, ref, p.name||"", p.email||"", p.phone||"", p.school||p.organisation||"", p.grades||"", p.program_type||"", p.message||""]);

  sendAdminEmail("New School Enquiry – " + (p.school||p.organisation||"Unknown"), buildAdminTable("School Enquiry", {
    "Contact Name": p.name, "Email": p.email, "Phone": p.phone,
    "School": p.school||p.organisation, "Grade Levels": p.grades, "Program Type": p.program_type,
    "Message": p.message, "Source Page": ref, "Timestamp": ts
  }));

  if (p.email) sendUserEmail(p.email, "Thank you for reaching out – Building Dreams for Schools", buildSchoolConfirmation(p));
  return { success: true, message: "School enquiry received!" };
}

// 4. COMMUNITY JOIN
function handleCommunityJoin(ss, p, ts, ref) {
  var headers = ["Timestamp","Source Page","Full Name","Email","Role","Interest / Domain","LinkedIn","Message"];
  var sheet = getOrCreateSheet(ss, "Community Members", headers);
  sheet.appendRow([ts, ref, p.name||"", p.email||"", p.role||"", p.interest||"", p.linkedin||"", p.message||""]);

  sendAdminEmail("New Community Member – " + (p.name||"Unknown"), buildAdminTable("Community Join", {
    "Name": p.name, "Email": p.email, "Role": p.role, "Interest": p.interest,
    "LinkedIn": p.linkedin, "Message": p.message, "Source Page": ref, "Timestamp": ts
  }));

  if (p.email) sendUserEmail(p.email, "Welcome to the Building Dreams Community, " + (p.name||"there") + "!", buildCommunityConfirmation(p));
  return { success: true, message: "Community application received!" };
}

// 5. CONTACT ENQUIRY
function handleContactEnquiry(ss, p, ts, ref) {
  var headers = ["Timestamp","Source Page","Journey / Type","Name","Email","Phone","Organisation","Message"];
  var sheet = getOrCreateSheet(ss, "Contact Enquiries", headers);
  sheet.appendRow([ts, ref, p.journey||"", p.name||"", p.email||"", p.phone||"", p.organisation||"", p.looking||""]);

  sendAdminEmail("New Contact Enquiry – " + (p.name||"Unknown") + " [" + (p.journey||"General") + "]", buildAdminTable("Contact Enquiry", {
    "Journey Type": p.journey, "Name": p.name, "Email": p.email, "Phone": p.phone,
    "Organisation": p.organisation, "Message": p.looking, "Source Page": ref, "Timestamp": ts
  }));

  if (p.email) sendUserEmail(p.email, "We received your message – Building Dreams", buildContactConfirmation(p));
  return { success: true, message: "Enquiry received!" };
}

// 6. NEWSLETTER
function handleNewsletter(ss, p, ts, ref) {
  var headers = ["Timestamp","Source Page","Email"];
  var sheet = getOrCreateSheet(ss, "Newsletter Subscribers", headers);
  sheet.appendRow([ts, ref, p.email||""]);

  sendAdminEmail("New Newsletter Subscriber – " + (p.email||"?"), buildAdminTable("Newsletter Subscription", {
    "Email": p.email, "Source Page": ref, "Timestamp": ts
  }));

  if (p.email) sendUserEmail(p.email, "You're now part of the Building Dreams Insider List!", buildNewsletterConfirmation(p));
  return { success: true, message: "Subscribed successfully!" };
}

// 7. UNIVERSITY PARTNERSHIP
function handleUniversityPartnership(ss, p, ts, ref) {
  var headers = ["Timestamp","Source Page","Name","Designation","Institution","Email","Phone","Partnership Type","Existing Initiatives","What to Build","Timeline"];
  var sheet = getOrCreateSheet(ss, "University Partnerships", headers);
  sheet.appendRow([ts, ref, p.name||"", p.designation||"", p.organisation||"", p.email||"", p.phone||"", p.partnership||"", p.initiatives||"", p.build||"", p.timeline||""]);

  sendAdminEmail("New University Partnership – " + (p.organisation||"Unknown"), buildAdminTable("University Partnership", {
    "Name": p.name, "Designation": p.designation, "Institution": p.organisation,
    "Email": p.email, "Phone": p.phone, "Partnership Type": p.partnership,
    "Existing Initiatives": p.initiatives, "What to Build": p.build,
    "Timeline": p.timeline, "Source Page": ref, "Timestamp": ts
  }));

  if (p.email) sendUserEmail(p.email, "Your Partnership Enquiry – Building Dreams for Universities", buildUniversityConfirmation(p));
  return { success: true, message: "Partnership enquiry received!" };
}

// EMAIL HELPERS
function sendAdminEmail(subject, htmlBody) {
  MailApp.sendEmail({ to: ADMIN_EMAIL, subject: "[BD Admin] " + subject, htmlBody: wrapAdminEmail(htmlBody) });
}
function sendUserEmail(to, subject, htmlBody) {
  MailApp.sendEmail({ to: to, subject: subject, htmlBody: wrapUserEmail(htmlBody), name: SITE_NAME });
}
function buildAdminTable(formLabel, dataObj) {
  var rows = "";
  for (var key in dataObj) {
    var val = dataObj[key] || "—";
    rows += '<tr><td style="padding:8px 12px;font-weight:600;background:#f5f5f5;border:1px solid #e0e0e0;white-space:nowrap;">' + key + '</td><td style="padding:8px 12px;border:1px solid #e0e0e0;">' + val + '</td></tr>';
  }
  return '<h2 style="color:#1a1a2e;margin:0 0 16px;">' + formLabel + ' Submission</h2><table style="border-collapse:collapse;width:100%;font-size:14px;">' + rows + '</table>';
}

// USER EMAIL BODIES
function buildStudentConfirmation(p) {
  return '<h2>Hi ' + (p.parent_name||"there") + ',</h2><p>We\'ve received <strong>' + (p.student_name||"your child") + '</strong>\'s application for <strong>Dreamers Lab 2026</strong>.</p><p>Our team will review it and reach out to <strong>' + p.parent_email + '</strong> within a few business days.</p><p><strong>Idea they want to build:</strong><br><em>' + (p.idea||"—") + '</em></p><p>Looking forward to building together,<br><strong>The Building Dreams Team</strong></p>';
}
function buildFounderConfirmation(p) {
  return '<h2>Hi ' + (p.founder_name||"there") + ',</h2><p>Your application for <strong>' + (p.startup_name||"your venture") + '</strong> is in! We\'ll review it and get back to you at <strong>' + p.founder_email + '</strong> shortly.</p><p><strong>Problem you\'re solving:</strong><br><em>' + (p.problem_statement||"—") + '</em></p><p>Keep building,<br><strong>The Building Dreams Team</strong></p>';
}
function buildSchoolConfirmation(p) {
  return '<h2>Hi ' + (p.name||"there") + ',</h2><p>Thank you for your interest in bringing Building Dreams to <strong>' + (p.school||p.organisation||"your school") + '</strong>!</p><p>We\'ll reach out to <strong>' + p.email + '</strong> within 2-3 business days.</p><p>Warm regards,<br><strong>The Building Dreams Team</strong></p>';
}
function buildCommunityConfirmation(p) {
  return '<h2>Welcome, ' + (p.name||"there") + '!</h2><p>You\'ve successfully joined the <strong>Building Dreams Community</strong>. We\'re thrilled to have you.</p><p>Watch your inbox — updates, events, and opportunities are coming soon.</p><p>See you on the inside,<br><strong>The Building Dreams Team</strong></p>';
}
function buildContactConfirmation(p) {
  return '<h2>Hi ' + (p.name||"there") + ',</h2><p>We\'ve received your message and our team will get back to you at <strong>' + p.email + '</strong> within 1-2 business days.</p><p>Speak soon,<br><strong>The Building Dreams Team</strong></p>';
}
function buildNewsletterConfirmation(p) {
  return '<h2>You\'re in!</h2><p>Welcome to the <strong>Building Dreams Insider List</strong>. You\'ll be among the first to hear about new cohorts, events, and stories from our builder community.</p><p>Stay curious,<br><strong>The Building Dreams Team</strong></p>';
}
function buildUniversityConfirmation(p) {
  return '<h2>Hi ' + (p.name||"there") + ',</h2><p>Thank you for your interest in partnering with Building Dreams at <strong>' + (p.organisation||"your institution") + '</strong>!</p><p>We\'ll review your enquiry and reach out at <strong>' + p.email + '</strong> to schedule a call.</p><p>Looking forward to collaborating,<br><strong>The Building Dreams Team</strong></p>';
}

// EMAIL WRAPPERS
function wrapAdminEmail(body) {
  return '<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f0f0f0;font-family:Arial,sans-serif;"><div style="max-width:600px;margin:24px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.12);"><div style="background:#1a1a2e;padding:20px 24px;"><h1 style="margin:0;color:#fff;font-size:18px;">Building Dreams — Admin Notification</h1></div><div style="padding:24px;">' + body + '</div><div style="background:#f5f5f5;padding:12px 24px;font-size:12px;color:#888;">This is an automated notification from the Building Dreams website.</div></div></body></html>';
}
function wrapUserEmail(body) {
  return '<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f0f0f0;font-family:Arial,sans-serif;"><div style="max-width:600px;margin:24px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.12);"><div style="background:#1a1a2e;padding:20px 24px;text-align:center;"><h1 style="margin:0;color:#fff;font-size:22px;letter-spacing:1px;">Building Dreams</h1><p style="margin:4px 0 0;color:#aaa;font-size:13px;">Where Dreamers Become Builders</p></div><div style="padding:32px 24px;color:#333;line-height:1.7;font-size:15px;">' + body + '</div><div style="background:#1a1a2e;padding:16px 24px;text-align:center;"><p style="margin:0;color:#aaa;font-size:12px;">© ' + new Date().getFullYear() + ' Building Dreams</p></div></div></body></html>';
}
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ status: "ok" })).setMimeType(ContentService.MimeType.JSON);
}
