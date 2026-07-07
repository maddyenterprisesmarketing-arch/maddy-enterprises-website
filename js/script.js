const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navWrap = document.querySelector(".nav-wrap");
const revealEls = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll(".counter");
const carouselTrack = document.querySelector(".carousel__track");
const carouselCards = document.querySelectorAll(".testimonial-card");
const buttons = document.querySelectorAll(".btn-ripple");
const accordionItems = document.querySelectorAll(".accordion details");
const navLinks = document.querySelectorAll(".nav-links a");
const currentPage = window.location.pathname.split("/").pop() || "index.html";

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 10);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

navToggle?.addEventListener("click", () => {
  const isOpen = navWrap.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navWrap?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navWrap.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

navLinks.forEach((link) => {
  const linkPage = new URL(link.getAttribute("href"), window.location.href).pathname.split("/").pop() || "index.html";
  const isActive = linkPage === currentPage;

  link.classList.toggle("is-active", isActive);

  if (isActive) {
    link.setAttribute("aria-current", "page");
  } else {
    link.removeAttribute("aria-current");
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");

      if (entry.target.classList.contains("counter")) {
        animateCounter(entry.target);
      }
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.18 }
);

revealEls.forEach((el) => observer.observe(el));
counters.forEach((counter) => observer.observe(counter));

function animateCounter(el) {
  const target = Number(el.dataset.count || 0);
  const duration = 1400;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased).toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
}

if (carouselTrack && carouselCards.length > 1) {
  let index = 0;

  const slideTo = () => {
    const cardWidth = carouselCards[0].getBoundingClientRect().width;
    const gap = 16;
    carouselTrack.style.transform = `translateX(calc(-1 * ${index * (cardWidth + gap)}px))`;
  };

  slideTo();
  setInterval(() => {
    index = (index + 1) % carouselCards.length;
    slideTo();
  }, 4200);

  window.addEventListener("resize", slideTo, { passive: true });
}

buttons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const ripple = document.createElement("span");
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.className = "ripple";
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });
});

accordionItems.forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    accordionItems.forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});

document.querySelector(".contact-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector("button[type='submit']");
  const originalText = button.textContent;
  button.textContent = "Thank you! We’ll contact you soon.";
  button.disabled = true;

  setTimeout(() => {
    button.textContent = originalText;
    button.disabled = false;
    event.currentTarget.reset();
  }, 3000);
});
