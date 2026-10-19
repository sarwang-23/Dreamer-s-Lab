/**
 * bd-form-handler.js
 * Building Dreams – Universal Form Handler
 *
 * IMPORTANT: After deploying Code.gs as a Web App in Google Apps Script,
 * replace the placeholder below with your actual deployment URL.
 */

const BD_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyZILY56QhC-uQ-YffB7pv8edZu_5MPEWpWt-yClf542Pg8vgxsQ3lksKk8N2B38aG2QA/exec";

// Track which page referred the user to this form
function getBDRefPage() {
  const ref = document.referrer;
  if (!ref) return document.title || window.location.pathname;
  try {
    const url = new URL(ref);
    const path = url.pathname.replace(/\/$/, "").split("/").filter(Boolean).pop();
    return path ? path.charAt(0).toUpperCase() + path.slice(1) : "Home";
  } catch (_) {
    return ref;
  }
}

// Show a success/error banner inside or near the form
function showBDFormMessage(form, success, message) {
  let banner = form.querySelector(".bd-submit-banner");
  if (!banner) {
    banner = document.createElement("div");
    banner.className = "bd-submit-banner";
    form.appendChild(banner);
  }
  banner.style.cssText = [
    "margin-top:16px",
    "padding:14px 18px",
    "border-radius:8px",
    "font-size:15px",
    "font-weight:600",
    "text-align:center",
    success
      ? "background:#d4f4e8;color:#1a6b47;border:1px solid #a3e0c3"
      : "background:#fde8e8;color:#9b1c1c;border:1px solid #f5c5c5"
  ].join(";");
  banner.textContent = message;
  banner.scrollIntoView({ behavior: "smooth", block: "nearest" });

  if (success) {
    setTimeout(() => { banner.style.opacity = "0"; banner.style.transition = "opacity .5s"; }, 5000);
  }
}

// Lock / unlock form submit button during submission
function setBDSubmitLoading(btn, loading) {
  if (!btn) return;
  if (loading) {
    btn.dataset.bdOrigText = btn.textContent;
    btn.textContent = "Sending…";
    btn.disabled = true;
    btn.style.opacity = "0.7";
  } else {
    btn.textContent = btn.dataset.bdOrigText || "Submit";
    btn.disabled = false;
    btn.style.opacity = "";
  }
}

// Core submit handler – sends data to Google Apps Script
async function bdSubmitForm(formData) {
  const response = await fetch(BD_SCRIPT_URL, {
    method: "POST",
    body: formData,
    // Note: no Content-Type header so the browser sets multipart/form-data automatically
    // Google Apps Script reads e.parameter from this
  });
  if (!response.ok) throw new Error("Server error: " + response.status);
  return response.json();
}

// ── FORM INTERCEPTORS ─────────────────────────────────────────────────────────

function attachBDFormHandler(formEl, formType, extraFields) {
  if (!formEl) return;

  formEl.addEventListener("submit", async function (e) {
    e.preventDefault();
    const submitBtn = formEl.querySelector('[type="submit"], button[type="submit"], .bd-form-submit, .apply-btn, .form-submit');
    setBDSubmitLoading(submitBtn, true);

    try {
      const fd = new FormData(formEl);
      fd.set("form_type", formType);
      fd.set("ref_page", getBDRefPage());

      // Attach any extra static fields
      if (extraFields) {
        Object.entries(extraFields).forEach(([k, v]) => fd.set(k, v));
      }

      // Convert radio buttons (FormData only gets first; handle checked explicitly)
      formEl.querySelectorAll('input[type="radio"]:checked').forEach(radio => {
        fd.set(radio.name, radio.value);
      });

      // Convert select values
      formEl.querySelectorAll("select").forEach(sel => {
        fd.set(sel.name, sel.value);
      });

      const result = await bdSubmitForm(fd);

      if (result && result.success) {
        showBDFormMessage(formEl, true, "✅ " + (result.message || "Submitted successfully! We'll be in touch soon."));
        formEl.reset();
        // Optionally close any modal that wraps the form
        const modal = formEl.closest("[data-modal], .modal, .overlay, [id$='modal'], [id$='overlay']");
        if (modal && modal.classList.contains("is-open")) {
          setTimeout(() => modal.classList.remove("is-open"), 2500);
        }
      } else {
        throw new Error((result && result.message) || "Submission failed.");
      }
    } catch (err) {
      console.error("[BD Form]", err);
      showBDFormMessage(formEl, false, "⚠️ Something went wrong. Please try again or email us directly.");
    } finally {
      setBDSubmitLoading(submitBtn, false);
    }
  });
}

// ── ATTACH TO ALL FORMS ON DOM READY ─────────────────────────────────────────
document.addEventListener("DOMContentLoaded", function () {
  const path = window.location.pathname.toLowerCase();

  // ── apply/index.html & get-started/index.html ─────────────────────────────
  // Student form
  const studentForm = document.getElementById("dl-name") ||
    document.querySelector("form[data-form='student']");
  if (studentForm) attachBDFormHandler(studentForm, "student_apply");

  // University founder form
  const founderForm = document.getElementById("uf-name") ||
    document.querySelector("form[data-form='founder']");
  if (founderForm) attachBDFormHandler(founderForm, "founder_apply");

  // ── community/index.html ──────────────────────────────────────────────────
  const communityForm = document.getElementById("community-name") ||
    document.querySelector("form[data-form='community']");
  if (communityForm) attachBDFormHandler(communityForm, "community_join");

  // ── contact/index.html ────────────────────────────────────────────────────
  const contactForm = document.getElementById("contact-enquiry-form") ||
    document.querySelector("form[data-form='contact']");
  if (contactForm) attachBDFormHandler(contactForm, "contact_enquiry");

  // ── insights/index.html (newsletter) ─────────────────────────────────────
  const newsletterForm = document.getElementById("insights-sub-email") ||
    document.querySelector("form[data-form='newsletter']");
  if (newsletterForm) attachBDFormHandler(newsletterForm, "newsletter");

  // ── universities/index.html ───────────────────────────────────────────────
  const univForm = document.getElementById("institutional-enquiry-form") ||
    document.querySelector("form[data-form='university']");
  if (univForm) attachBDFormHandler(univForm, "university_partnership");

  // ── get-started school enquiry (if separate form) ─────────────────────────
  const schoolForm = document.querySelector("form[data-form='school']") ||
    document.getElementById("school-enquiry-form");
  if (schoolForm) attachBDFormHandler(schoolForm, "school_enquiry");
});
