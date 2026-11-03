/* =========================================================
   EDIT HERE: everything the owner may want to change lives
   in this one SITE object. Items marked TODO are placeholders.
   ========================================================= */
const SITE = {
  name: "Greg's Custom Detailing",
  phoneDisplay: "936-244-0535",
  phoneLink: "+19362440535", // used by tap-to-call links
  address: "645 Pine Terrace, Center, TX 75935",

  // Google lists this business as "Temporarily closed".
  // When Greg reopens, change closed to false and the banner disappears.
  closed: false,
  closedMessage: "We are temporarily closed. Call or send a message and we will get back to you.",

  // TODO: ask Greg for real hours (none on Google). Use "Closed" for days off.
  hours: [
    ["Monday", "9:00 AM – 5:00 PM"],
    ["Tuesday", "9:00 AM – 5:00 PM"],
    ["Wednesday", "9:00 AM – 5:00 PM"],
    ["Thursday", "9:00 AM – 5:00 PM"],
    ["Friday", "9:00 AM – 5:00 PM"],
    ["Saturday", "By appointment"],
    ["Sunday", "Closed"],
  ],

  // TODO: confirm package names, contents and prices with Greg.
  // (His old site name says "mobile detail". Ask if he comes to the customer, and add it to the FAQ.)
  packages: [
    { name: "Express", items: ["Hand wash and dry", "Wheels and tires cleaned", "Windows inside and out", "Interior vacuum"], single: "$XX" },
    { name: "Full Detail", items: ["Everything in Express", "Deep interior clean", "Clay bar and wax", "Dash, door and trim care"], single: "$XX", popular: true },
    { name: "Premium", items: ["Everything in Full Detail", "Paint polish", "Odor removal", "Leather conditioning"], single: "$XX" },
  ],

  // TODO: the PDF's "Unlimited Wash Club" becomes a maintenance club. Keep, rewrite, or delete it (and #plan in index.html).
  plan: {
    title: "Maintenance Club",
    intro: "Keep your car looking its best all year with a regular detail.",
    benefits: ["Regular maintenance details at a lower price", "Priority booking", "Special member offers"],
    steps: ["Pick your plan", "Sign up online", "We keep your car looking new"],
    price: "$XX per month",
    joinLink: "#contact", // TODO: replace with Greg's real signup/payment page
  },

  // No Google reviews exist yet. Never invent them. Add real ones here as {stars, text, author}.
  reviews: [],
  // TODO: paste Greg's real Google review link once the profile is claimed
  reviewLink: "https://www.google.com/maps/search/?api=1&query=Greg%27s+Custom+Detailing+Center+TX",

  faq: [
    ["How long does a detail take?", "It depends on your vehicle and the package. Call us for an honest estimate."],
    ["Do you come to me?", "TODO: ask Greg. His website name says mobile detailing."],
    ["How does the monthly plan work?", "You pay a monthly price and we keep your car on a regular detailing schedule."], // TODO confirm
    ["Can I cancel the plan anytime?", "TODO: ask Greg for his cancellation terms."],
    ["What payment methods do you accept?", "TODO: ask Greg (cash, cards, etc.)."],
  ],

  // TODO: add Greg's real social links, or leave empty
  social: [
    // { label: "Facebook", url: "https://facebook.com/..." },
  ],

  // Contact form: create a free form at formspree.io (or web3forms.com) and paste its URL here.
  formEndpoint: "https://formspree.io/f/YOUR_FORM_ID",
};

/* =========================================================
   Code below builds the page from SITE. You rarely need to edit it.
   ========================================================= */
const $ = (id) => document.getElementById(id);
const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text; // textContent is safe from HTML injection
  return node;
};

// Closed banner
if (SITE.closed) {
  $("closed-banner").textContent = SITE.closedMessage;
  $("closed-banner").hidden = false;
}

// Directions and call links
const mapQuery = encodeURIComponent(SITE.name + ", " + SITE.address);
document.querySelectorAll("[data-directions]").forEach((a) => {
  a.href = "https://www.google.com/maps/dir/?api=1&destination=" + mapQuery;
});
document.querySelectorAll("[data-call]").forEach((a) => { a.href = "tel:" + SITE.phoneLink; });

// Hours (today is bolded)
const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
SITE.hours.forEach(([day, time]) => {
  const li = el("li", day === todayName ? "today" : "");
  li.append(el("span", "", day), el("span", "", time));
  $("hours-list").append(li);
});

// Text that appears in several places
$("strip-address").textContent = SITE.address;
$("map-address").textContent = SITE.address;
$("footer-address").textContent = SITE.address;
$("strip-phone").textContent = SITE.phoneDisplay;
$("footer-phone").textContent = SITE.phoneDisplay;

// Package cards
SITE.packages.forEach((p) => {
  const card = el("article", "card" + (p.popular ? " featured" : ""));
  if (p.popular) card.append(el("span", "badge", "Most popular"));
  card.append(el("h3", "", p.name));
  const ul = el("ul");
  p.items.forEach((i) => ul.append(el("li", "", i)));
  card.append(ul, el("p", "price", "Starting at " + p.single));
  $("package-cards").append(card);
});

// Maintenance club
$("plan-title").textContent = SITE.plan.title;
$("plan-intro").textContent = SITE.plan.intro + " " + SITE.plan.price + ".";
SITE.plan.benefits.forEach((b) => $("plan-benefits").append(el("li", "", b)));
SITE.plan.steps.forEach((s) => $("plan-steps").append(el("li", "", s)));
$("plan-join").href = SITE.plan.joinLink;

// Photos: a missing image file becomes a labeled placeholder
["Front exterior", "Interior detail", "Paint finish", "Wheels", "Dashboard", "Finished car"].forEach((label, i) => {
  const fig = el("figure");
  const img = new Image();
  img.src = "images/photo" + (i + 1) + ".jpg";
  img.alt = label + " detailing by Greg's Custom Detailing in Center, TX";
  img.loading = "lazy";
  img.onerror = () => { fig.replaceChildren(el("div", "placeholder", "Add images/photo" + (i + 1) + ".jpg")); };
  fig.append(img);
  $("photo-strip").append(fig);
});

// Reviews (shows an invitation when there are none yet)
if (SITE.reviews.length === 0) {
  $("review-list").append(el("p", "empty", "We are new on Google. Had your car detailed by Greg? Tell others about it."));
  $("review-list").style.display = "block";
} else {
  SITE.reviews.forEach((r) => {
    const q = el("blockquote");
    q.append(el("div", "stars", "★".repeat(r.stars)), el("p", "", r.text), el("cite", "", r.author));
    $("review-list").append(q);
  });
}
$("review-link").href = SITE.reviewLink;

// FAQ
SITE.faq.forEach(([q, a]) => {
  const d = el("details");
  d.append(el("summary", "", q), el("p", "", a));
  $("faq-list").append(d);
});

// Map
$("map-frame").src = "https://www.google.com/maps?q=" + mapQuery + "&output=embed";

// Social links
SITE.social.forEach((s) => {
  const a = el("a", "", s.label);
  a.href = s.url; a.target = "_blank"; a.rel = "noopener";
  $("social-links").append(a, " ");
});

$("year").textContent = new Date().getFullYear();

// Before/after slider: moving the range input changes a CSS variable that the CSS reads
const range = $("compare-range");
const compare = $("compare");
range.addEventListener("input", () => compare.style.setProperty("--pos", range.value + "%"));

// Contact form
const form = $("contact-form");
const status = $("form-status");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.className = "";
  const data = new FormData(form);

  if (data.get("website")) return; // honeypot filled in: a bot, stop silently

  if (!data.get("name").trim() || !data.get("message").trim() || !/^\S+@\S+\.\S+$/.test(data.get("email"))) {
    status.textContent = "Please fill in your name, a valid email, and a message.";
    status.className = "error";
    return;
  }
  if (SITE.formEndpoint.includes("YOUR_FORM_ID")) {
    status.textContent = "Form is not connected yet. Add the form service URL in script.js.";
    status.className = "error";
    return;
  }

  status.textContent = "Sending...";
  try {
    const res = await fetch(SITE.formEndpoint, { method: "POST", body: data, headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error("bad response");
    form.reset();
    status.textContent = "Thanks! We got your message and will reply soon.";
    status.className = "ok";
  } catch (err) {
    status.textContent = "Message not sent. Please call us at " + SITE.phoneDisplay + ".";
    status.className = "error";
  }
});