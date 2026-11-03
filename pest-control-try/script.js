const SITE_CONFIG = {
  companyName: "Demo name",
  city: "US",
  state: "US",
  phoneDisplay: "(555) 010-2020",
  phoneLink: "+15550102020",
  email: "hello@example.com",
  formEndpoint: "",
  googleReviewsUrl: "#",
  facebookUrl: "#",
  instagramUrl: "#",
  seasonalBanner: "Seasonal protection starts here — ask about our current offers."
};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();

  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");

  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  const reviewLink = document.getElementById("review-link");
  reviewLink.href = SITE_CONFIG.googleReviewsUrl;

  if (SITE_CONFIG.googleReviewsUrl === "#") {
    reviewLink.addEventListener("click", event => {
      event.preventDefault();
      alert("Add the company's real Google review URL in script.js before launch.");
    });
  }

  document.getElementById("facebook-link").href = SITE_CONFIG.facebookUrl;
  document.getElementById("instagram-link").href = SITE_CONFIG.instagramUrl;
  document.getElementById("announcement-text").textContent = SITE_CONFIG.seasonalBanner;

  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.href = `tel:${SITE_CONFIG.phoneLink}`;
  });

  document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.href = `mailto:${SITE_CONFIG.email}`;
    if (link.textContent.includes("@")) {
      link.textContent = SITE_CONFIG.email;
    }
  });

  const form = document.getElementById("quote-form");
  const status = document.getElementById("form-status");

  form.addEventListener("submit", async event => {
    event.preventDefault();
    status.textContent = "";
    status.classList.remove("error");

    if (!form.reportValidity()) return;

    if (!SITE_CONFIG.formEndpoint) {
      status.textContent =
        "Demo form only: add your real form endpoint in script.js to receive quote requests.";
      status.classList.add("error");
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;

    submitButton.disabled = true;
    submitButton.textContent = "Sending…";

    try {
      const formData = new FormData(form);

      formData.append("_subject", `New pest control quote request — ${SITE_CONFIG.companyName}`);
      formData.append("_template", "table");
      formData.append("_captcha", "true");

      const response = await fetch(SITE_CONFIG.formEndpoint, {
        method: "POST",
        body: formData,
        headers: { "Accept": "application/json" }
      });

      if (!response.ok) throw new Error("Form submission failed");

      form.reset();
      status.textContent =
        "Thanks! Your request has been sent. The team will contact you shortly.";

    } catch (error) {
      status.textContent =
        "Sorry, we couldn't send your request. Please call us directly.";
      status.classList.add("error");

    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalText;
    }
  });
});