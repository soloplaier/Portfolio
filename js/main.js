// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const navLinks = document.querySelector(".nav-links");
if (navToggle) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

// Reveal-on-scroll for section heads, cards, timeline items
const revealTargets = document.querySelectorAll(
  ".section-head, .stat-card, .video-card, .timeline-item, .skill-group, .contact-inner, .testimonial-video, .testimonial-content, .apply-intro, .apply-form"
);
revealTargets.forEach((el) => el.classList.add("reveal"));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealTargets.forEach((el) => revealObserver.observe(el));

// Count-up animation for stat numbers
function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  const duration = 1400;
  const start = performance.now();
  const isFloat = String(target).includes(".");

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const value = target * eased;
    el.textContent = (isFloat ? value.toFixed(1) : Math.round(value)) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target + suffix;
  }
  requestAnimationFrame(tick);
}

const statNums = document.querySelectorAll(".stat-num");
const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);
statNums.forEach((el) => statObserver.observe(el));

// Shrink nav on scroll
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  if (window.scrollY > 20) nav.classList.add("scrolled");
  else nav.classList.remove("scrolled");
});

// Apply form: multi-step application
// Submissions go to FormSubmit (free, no account). The first submission
// triggers a one-time activation email to this address; click it once.
const APPLY_ENDPOINT = "https://formsubmit.co/ajax/solo.studios.co@gmail.com";

const applyForm = document.getElementById("applyForm");
if (applyForm) {
  const steps = [...applyForm.querySelectorAll(".apply-step")];
  const bar = document.getElementById("applyBar");
  const stepNum = document.getElementById("applyStepNum");
  const backBtn = document.getElementById("applyBack");
  const nextBtn = document.getElementById("applyNext");
  const submitBtn = document.getElementById("applySubmit");
  const errorEl = document.getElementById("applyError");
  let current = 0;

  function showStep(i) {
    steps.forEach((s, idx) => s.classList.toggle("active", idx === i));
    current = i;
    bar.style.width = ((i + 1) / steps.length) * 100 + "%";
    stepNum.textContent = String(i + 1).padStart(2, "0");
    backBtn.hidden = i === 0;
    nextBtn.hidden = i === steps.length - 1;
    submitBtn.hidden = i !== steps.length - 1;
    errorEl.textContent = "";
  }

  function validateStep(i) {
    const step = steps[i];
    let ok = true;
    step.querySelectorAll("input[type=text], input[type=email], select, textarea").forEach((el) => {
      const valid = el.checkValidity() && el.value.trim() !== "";
      el.classList.toggle("invalid", !valid);
      if (!valid) ok = false;
    });
    const radios = step.querySelectorAll("input[type=radio]");
    if (radios.length && ![...radios].some((r) => r.checked)) ok = false;
    const boxes = step.querySelectorAll("input[type=checkbox]");
    if (boxes.length && ![...boxes].some((b) => b.checked)) ok = false;
    errorEl.textContent = ok ? "" : "Please answer this one before moving on.";
    return ok;
  }

  nextBtn.addEventListener("click", () => {
    if (validateStep(current)) showStep(current + 1);
  });
  backBtn.addEventListener("click", () => showStep(current - 1));

  // Picking a single-choice answer moves straight on, Typeform-style
  applyForm.querySelectorAll("input[type=radio]").forEach((r) =>
    r.addEventListener("change", () => setTimeout(() => showStep(current + 1), 220))
  );
  applyForm.querySelectorAll("input, select, textarea").forEach((el) =>
    el.addEventListener("input", () => el.classList.remove("invalid"))
  );

  // Enter advances (except in the textarea)
  applyForm.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
      e.preventDefault();
      (current === steps.length - 1 ? submitBtn : nextBtn).click();
    }
  });

  function collect() {
    const fd = new FormData(applyForm);
    return {
      Name: fd.get("name"),
      Email: fd.get("email"),
      Handle: fd.get("handle"),
      Type: fd.get("type"),
      Services: fd.getAll("services").join(", "),
      Audience: fd.get("audience"),
      Budget: fd.get("budget"),
      Goal: fd.get("goal"),
      Start: fd.get("start"),
    };
  }

  applyForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validateStep(current)) return;
    const data = collect();
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    try {
      const res = await fetch(APPLY_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...data,
          _subject: `New application: ${data.Name} (${data.Type})`,
          _replyto: data.Email,
          _template: "table",
          _captcha: "false",
        }),
      });
      if (!res.ok) throw new Error("Bad response");
      steps.forEach((s) => s.classList.remove("active"));
      document.getElementById("applyNav").hidden = true;
      document.getElementById("applyDone").hidden = false;
      bar.style.width = "100%";
    } catch (err) {
      // Fallback: open the visitor's email app with the answers filled in
      const body = Object.entries(data).map(([k, v]) => `${k}: ${v}`).join("\n");
      window.location.href =
        "mailto:solo.studios.co@gmail.com?subject=" +
        encodeURIComponent("Application: " + data.Name) +
        "&body=" + encodeURIComponent(body);
      errorEl.textContent = "Couldn't send automatically, so your email app has opened with your answers.";
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit application →";
    }
  });

  showStep(0);
}
