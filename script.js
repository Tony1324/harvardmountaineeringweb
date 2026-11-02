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

const updateScrollProgress = () => {
  const sectionTop = heroScroll.offsetTop;
  const scrollDistance = window.innerHeight;
  const progress = Math.min(
    Math.max((window.scrollY - sectionTop) / scrollDistance, 0),
    1
  );
  heroScroll.style.setProperty("--scroll-progress", progress);
  imageWindow.style.setProperty(
    "--window-height",
    `${Math.max(0, 5 * (1 - progress))}vh`
  );
  pageContent.classList.toggle("is-scrolling", progress > 0);
};

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();
