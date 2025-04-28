class HorizontalScroll {
  constructor() {
    this.container = document.querySelector(".scroll-container");
    this.wrapper = document.querySelector(".content-wrapper");
    this.isMobile = false;
    this.startX = 0;
    this.scrollLeft = 0;
    this.animationFrame = null;
    this.touchStartX = 0;
    this.scrollStartX = 0;

    this.init();
  }

  init() {
    this.checkViewport();
    this.addEventListeners();
    window.addEventListener("resize", () => this.onResize());
  }

  addEventListeners() {
    this.container.addEventListener("wheel", (e) => this.handleWheel(e), {
      passive: false,
    });
    this.container.addEventListener(
      "touchstart",
      (e) => this.handleTouchStart(e),
      { passive: false }
    );
    this.container.addEventListener(
      "touchmove",
      (e) => this.handleTouchMove(e),
      { passive: false }
    );
  }

  checkViewport() {
    this.isMobile = window.matchMedia(
      "(max-width: 900px), (orientation: portrait)"
    ).matches;
    this.container.style.overscrollBehavior = this.isMobile ? "auto" : "none";
  }

  onResize() {
    this.checkViewport();
    if (!this.isMobile) {
      this.container.scrollLeft = 0;
    }
  }

  handleWheel(e) {
    if (!this.isMobile) {
      e.preventDefault();
      const delta = e.deltaY || e.detail || e.wheelDelta;
      this.smoothScroll(delta * 2);
    }
  }

  handleTouchStart(e) {
    if (this.isMobile) return;
    this.touchStartX = e.touches[0].clientX;
    this.scrollStartX = this.container.scrollLeft;
  }

  handleTouchMove(e) {
    if (this.isMobile) return;
    e.preventDefault();
    const x = e.touches[0].clientX;
    const delta = (x - this.touchStartX) * 2;
    this.container.scrollLeft = this.scrollStartX - delta;
  }

  smoothScroll(delta) {
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);

    const start = this.container.scrollLeft;
    const target = start + delta;
    const duration = 500;
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = this.easeInOutQuart(progress);

      this.container.scrollLeft = start + (target - start) * ease;

      if (progress < 1) {
        this.animationFrame = requestAnimationFrame(animate);
      }
    };

    this.animationFrame = requestAnimationFrame(animate);
  }

  easeInOutQuart(t) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
  }
}

// Инициализация после загрузки
document.addEventListener("DOMContentLoaded", () => {
  new HorizontalScroll();
});
