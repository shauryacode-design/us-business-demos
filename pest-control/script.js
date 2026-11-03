
/* =========================================
   PEST CONTROL WEBSITE
   JavaScript interactions
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  // ---------------------------------------
  // 1. Mobile Navigation
  // ---------------------------------------

  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
      });
    });

    document.addEventListener("click", (event) => {
      const clickedInsideMenu = navLinks.contains(event.target);
      const clickedToggle = menuToggle.contains(event.target);

      if (!clickedInsideMenu && !clickedToggle) {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }


  // ---------------------------------------
  // 2. FAQ Accordion
  // ---------------------------------------

  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const icon = item.querySelector(".faq-icon");

    if (!question) return;

    question.addEventListener("click", () => {
      const isCurrentlyOpen = item.classList.contains("active");

      // Close all FAQ items first
      faqItems.forEach((faq) => {
        faq.classList.remove("active");

        const faqButton = faq.querySelector(".faq-question");
        const faqIcon = faq.querySelector(".faq-icon");

        if (faqButton) {
          faqButton.setAttribute("aria-expanded", "false");
        }

        if (faqIcon) {
          faqIcon.textContent = "+";
        }
      });

      // Open selected FAQ if it was previously closed
      if (!isCurrentlyOpen) {
        item.classList.add("active");
        question.setAttribute("aria-expanded", "true");

        if (icon) {
          icon.textContent = "−";
        }
      }
    });
  });


  // ---------------------------------------
  // 3. Scroll Reveal Animation
  // ---------------------------------------

  const revealSelectors = [
    ".service-card",
    ".process-step",
    ".plan-card",
    ".photo-item",
    ".review-card",
    ".area-card",
    ".faq-item",
    ".contact-form"
  ];

  const revealElements = document.querySelectorAll(
    revealSelectors.join(",")
  );

  revealElements.forEach((element) => {
    element.classList.add("reveal");
  });

  if ("IntersectionObserver" in window) {
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
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px"
      }
    );

    revealElements.forEach((element) => {
      observer.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }


  // ---------------------------------------
  // 4. Automatic Copyright Year
  // ---------------------------------------

  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }


  // ---------------------------------------
  // 5. Contact Form
  // ---------------------------------------

  const contactForm = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const formData = new FormData(contactForm);

      // Basic honeypot spam check
      if (formData.get("_honeypot")) {
        return;
      }

      /*
        IMPORTANT:

        This is a frontend-only form.

        Before launch, connect it to a real form backend
        such as Formspree, Netlify Forms, or a custom API.

        Do not display a success message until the server
        confirms that the enquiry was successfully received.
      */

      if (formMessage) {
        formMessage.textContent =
          "The form is not connected yet. Please call the business directly until the enquiry service is configured.";
        formMessage.style.color = "#a15b36";
      }
    });
  }


  // ---------------------------------------
  // 6. Smooth Anchor Navigation
  // ---------------------------------------

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        event.preventDefault();

        targetElement.scrollIntoView({
          behavior: window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches ? "auto" : "smooth",
          block: "start"
        });
      }
    });
  });

});
