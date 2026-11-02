const heroImages = [
  {
    source: "hero_img/photo1.jpeg",
    theme: "dark"
  },
  {
    source: "hero_img/photo2.jpeg",
    theme: "dark"
  },
  {
    source: "hero_img/photo3.jpeg",
    theme: "dark"
  },
  {
    source: "hero_img/photo4.jpeg",
    theme: "light"
  },
  {
    source: "hero_img/photo5.jpeg",
    theme: "dark"
  },
  {
    source: "hero_img/photo6.jpeg",
    theme: "dark"
  },
  {
    source: "hero_img/photo7.jpeg",
    theme: "dark"
  },
  {
    source: "hero_img/photo8.jpeg",
    theme: "dark"
  },
  {
    source: "hero_img/photo9.jpeg",
    theme: "dark"
  }
];

const heroImage = document.querySelector("#hero-image");
const imageWindow = document.querySelector(".image-window");
const randomImage = heroImages[Math.floor(Math.random() * heroImages.length)];

heroImage.src = randomImage.source;
imageWindow.src = randomImage.source;
document.documentElement.classList.add(`image-theme-${randomImage.theme}`);

const heroScroll = document.querySelector(".hero-scroll");
const pageContent = document.querySelector(".page-content");
const heroNav = document.querySelector(".hero-nav");

const getViewportHeight = () => window.visualViewport?.height || window.innerHeight;

const updateViewportHeight = () => {
  const viewportHeight = getViewportHeight();
  document.documentElement.style.setProperty(
    "--viewport-height",
    `${viewportHeight}px`
  );
  return viewportHeight;
};

const mobileQuery = window.matchMedia("(max-width: 700px)");

const updateScrollProgress = () => {
  // Mobile only fades in the content background once the page is scrolled.
  if (mobileQuery.matches) {
    pageContent.classList.toggle("is-scrolling", window.scrollY > 0);
    return;
  }

  const viewportHeight = updateViewportHeight();
  const sectionTop = heroScroll.offsetTop;
  const scrollDistance = viewportHeight;
  const progress = Math.min(
    Math.max((window.scrollY - sectionTop) / scrollDistance, 0),
    1
  );
  heroScroll.style.setProperty("--scroll-progress", progress);
  imageWindow.style.setProperty(
    "--window-height",
    `${viewportHeight * 0.05 * (1 - progress)}px`
  );
  pageContent.classList.toggle("is-scrolling", progress > 0);
};

const updateLayout = () => {
  if (mobileQuery.matches) {
    heroScroll.style.removeProperty("--scroll-progress");
    // Sit the nav right on the bottom edge of the hero photo.
    pageContent.style.marginTop = `${-heroNav.offsetHeight}px`;
  } else {
    pageContent.style.marginTop = "";
  }
  updateScrollProgress();
};

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateLayout);
window.visualViewport?.addEventListener("resize", updateLayout);
updateLayout();

// Fade content in as it scrolls into view; elements arriving together are
// staggered slightly.
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach((entry, index) => {
          entry.target.style.transitionDelay = `${Math.min(index, 5) * 80}ms`;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
    },
    { threshold: 0.25 }
  );

  document
    .querySelectorAll(
      ".section-label, .section-body > :not(.people-grid), .person, .footer-grid > *"
    )
    .forEach((element) => {
      element.classList.add("reveal");
      revealObserver.observe(element);
    });
}

// Nav links scroll smoothly in script rather than with CSS: on desktop the
// content changes width while scrolling, which moves the sections mid-scroll,
// so the target is re-measured on every frame.
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let navScrollFrame;

const getSectionTarget = (section) =>
  section.getBoundingClientRect().top +
  window.scrollY -
  parseFloat(getComputedStyle(section).scrollMarginTop);

const scrollToSection = (section) => {
  cancelAnimationFrame(navScrollFrame);
  if (reduceMotion.matches) {
    window.scrollTo(0, getSectionTarget(section));
    return;
  }
  const startY = window.scrollY;
  const startTime = performance.now();
  const step = (now) => {
    const t = Math.min((now - startTime) / 800, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    window.scrollTo(0, startY + (getSectionTarget(section) - startY) * eased);
    if (t < 1) navScrollFrame = requestAnimationFrame(step);
  };
  navScrollFrame = requestAnimationFrame(step);
};

// Let the reader take over mid-scroll.
["wheel", "touchstart"].forEach((type) =>
  window.addEventListener(type, () => cancelAnimationFrame(navScrollFrame), {
    passive: true
  })
);

document.querySelectorAll('.hero-links a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const section = document.querySelector(link.hash);
    if (!section) return;
    event.preventDefault();
    history.pushState(null, "", link.hash);
    scrollToSection(section);
  });
});
