
/* =========================================
   TIRE SHOP WEBSITE
   Interactive functionality
========================================= */

/*
  BUSINESS CONFIGURATION
  Update these values when customizing the website.

  Hours use 24-hour format.
  Example: "09:00" means 9 AM.
  Set closed: true for days the shop is closed.
*/

const SHOP_CONFIG = {
  name: "[Shop Name]",

  // Set the shop's IANA timezone, e.g. "America/Chicago".
  // This is important for accurate Open Now status.
  timeZone: "America/Chicago",

  phone: "[Phone Number]",

  // Replace with the actual email form endpoint.
  // Example: https://formspree.io/f/xxxxxxxx
  formEndpoint: "",

  hours: [
    { day: "Sunday",    open: "00:00", close: "00:00", closed: true },
    { day: "Monday",    open: "09:00", close: "18:00", closed: false },
    { day: "Tuesday",   open: "09:00", close: "18:00", closed: false },
    { day: "Wednesday", open: "09:00", close: "18:00", closed: false },
    { day: "Thursday",  open: "09:00", close: "18:00", closed: false },
    { day: "Friday",    open: "09:00", close: "18:00", closed: false },
    { day: "Saturday",  open: "09:00", close: "15:00", closed: false }
  ],

  holidayHours: "Holiday hours: Call the shop to confirm."
};


/* =========================================
   INITIALIZATION
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  setupMobileNavigation();
  setupFAQ();
  setupCopyrightYear();
  setupScrollAnimations();
  setupQuoteForm();
  renderBusinessHours();
  setupSmoothNavigation();

});


/* =========================================
   1. MOBILE NAVIGATION
========================================= */

function setupMobileNavigation() {
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (!menuToggle || !navLinks) return;

  function closeMenu() {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (
      !navLinks.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}


/* =========================================
   2. FAQ ACCORDION
========================================= */

function setupFAQ() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const button = item.querySelector(".faq-question");
    const icon = button?.querySelector("span");

    if (!button) return;

    button.addEventListener("click", () => {
      const wasOpen = item.classList.contains("active");

      faqItems.forEach((faq) => {
        faq.classList.remove("active");

        const faqButton = faq.querySelector(".faq-question");
        const faqIcon = faqButton?.querySelector("span");

        faqButton?.setAttribute("aria-expanded", "false");

        if (faqIcon) {
          faqIcon.textContent = "+";
        }
      });

      if (!wasOpen) {
        item.classList.add("active");
        button.setAttribute("aria-expanded", "true");

        if (icon) {
          icon.textContent = "−";
        }
      }
    });
  });
}


/* =========================================
   3. COPYRIGHT YEAR
========================================= */

function setupCopyrightYear() {
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }
}


/* =========================================
   4. SCROLL REVEAL ANIMATIONS
========================================= */

function setupScrollAnimations() {
  const selectors = [
    ".service-card",
    ".trust-item",
    ".special-card",
    ".review-card",
    ".gallery-item",
    ".process-step",
    ".quote-form",
    ".faq-item"
  ];

  const elements = document.querySelectorAll(selectors.join(","));

  elements.forEach((element) => {
    element.classList.add("reveal");
  });

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => {
      element.classList.add("visible");
    });

    return;
  }

  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observerInstance.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -25px 0px"
    }
  );

  elements.forEach((element) => {
    observer.observe(element);
  });
}


/* =========================================
   5. BUSINESS HOURS
========================================= */

function getShopLocalTime() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: SHOP_CONFIG.timeZone,
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(new Date());

  const values = {};

  parts.forEach((part) => {
    if (part.type !== "literal") {
      values[part.type] = part.value;
    }
  });

  return {
    day: values.weekday,
    time: `${values.hour}:${values.minute}`
  };
}


function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}


function renderBusinessHours() {
  const hoursList = document.getElementById("hoursList");
  const openStatus = document.getElementById("openStatus");
  const holidayHours = document.getElementById("holidayHours");

  if (holidayHours) {
    holidayHours.textContent = SHOP_CONFIG.holidayHours;
  }

  if (!hoursList || !openStatus) return;

  const localTime = getShopLocalTime();
  const currentDay = SHOP_CONFIG.hours.find(
    (item) => item.day === localTime.day
  );

  const nowMinutes = timeToMinutes(localTime.time);

  const isOpen = currentDay &&
    !currentDay.closed &&
    nowMinutes >= timeToMinutes(currentDay.open) &&
    nowMinutes < timeToMinutes(currentDay.close);

  openStatus.textContent = isOpen ? "Open Now" : "Closed Now";
  openStatus.classList.toggle("shop-open", Boolean(isOpen));
  openStatus.classList.toggle("shop-closed", !isOpen);

  hoursList.innerHTML = "";

  SHOP_CONFIG.hours.forEach((item) => {
    const row = document.createElement("div");
    row.className = "hours-row";

    if (item.day === localTime.day) {
      row.classList.add("today");
    }

    const day = document.createElement("span");
    day.textContent = item.day;

    const time = document.createElement("span");

    if (item.closed) {
      time.textContent = "Closed";
    } else {
      time.textContent = `${formatTime(item.open)} – ${formatTime(item.close)}`;
    }

    row.append(day, time);
    hoursList.appendChild(row);
  });
}


function formatTime(time) {
  const [hours, minutes] = time.split(":").map(Number);

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit"
  });
}


/* =========================================
   6. TIRE QUOTE FORM
========================================= */

function setupQuoteForm() {
  const form = document.getElementById("quoteForm");
  const status = document.getElementById("formStatus");

  if (!form || !status) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const formData = new FormData(form);

    // Basic honeypot spam protection
    if (formData.get("_honeypot")) {
      return;
    }

    // Basic phone validation
    const phone = String(formData.get("phone") || "").trim();

    if (phone.replace(/\D/g, "").length < 7) {
      status.textContent = "Please enter a valid phone number.";
      status.style.color = "#c92924";
      return;
    }

    // Basic vehicle year validation
    const vehicleYear = String(
      formData.get("vehicle_year") || ""
    ).trim();

    if (!/^\d{4}$/.test(vehicleYear)) {
      status.textContent = "Please enter a valid four-digit vehicle year.";
      status.style.color = "#c92924";
      return;
    }

    // Do not pretend the form works without an email endpoint.
    if (!SHOP_CONFIG.formEndpoint) {
      status.textContent =
        "The quote form is not connected yet. Please call the shop directly.";
      status.style.color = "#c92924";
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');

    const originalText = submitButton.textContent;

    submitButton.disabled = true;
    submitButton.textContent = "Sending Request...";

    status.textContent = "Sending your request...";
    status.style.color = "#777d84";

    try {
      const response = await fetch(SHOP_CONFIG.formEndpoint, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Form submission failed.");
      }

      form.reset();

      status.textContent =
        "Thanks! Your tire quote request has been sent. Our team will contact you shortly.";

      status.style.color = "#26834b";

    } catch (error) {
      console.error("Quote form error:", error);

      status.textContent =
        "We couldn't send your request. Please call the shop directly.";

      status.style.color = "#c92924";

    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });
}


/* =========================================
   7. SMOOTH NAVIGATION
========================================= */

function setupSmoothNavigation() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });
    });
  });
}
