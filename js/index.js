class HorizontalScroll {
  constructor() {
    this.container = document.querySelector(".scroll-container");
    this.wrapper = document.querySelector(".content-wrapper");
    this.isMobile = false;
    this.animationFrame = null;
    this.touchStartX = 0;
    this.scrollStartX = 0;

    // Настройки скорости
    this.scrollSpeed = 1.5;
    this.animationDuration = 250;
    this.keyboardStep = 150;

    this.init();
  }

  init() {
    this.checkViewport();
    this.addEventListeners();
    window.addEventListener("resize", () => this.onResize());
    document.addEventListener("keydown", (e) => this.handleKeyDown(e));
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
    if (!this.isMobile) this.container.scrollLeft = 0;
  }

  handleWheel(e) {
    if (!this.isMobile) {
      e.preventDefault();
      const deltaX = e.deltaX || 0;
      const deltaY = (e.deltaY || 0) * this.scrollSpeed;
      const delta = deltaX !== 0 ? deltaX : deltaY;

      this.smoothScroll(delta * (e.deltaMode === 1 ? 12 : 1));
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
    const delta = (e.touches[0].clientX - this.touchStartX) * 2.5;
    this.container.scrollLeft = this.scrollStartX - delta;
  }

  handleKeyDown(e) {
    if (this.isMobile || !this.container.contains(document.activeElement))
      return;

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        this.smoothScroll(-this.keyboardStep);
        break;
      case "ArrowRight":
        e.preventDefault();
        this.smoothScroll(this.keyboardStep);
        break;
    }
  }

  smoothScroll(delta) {
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);

    const start = this.container.scrollLeft;
    const target = start + delta;
    const startTime = Date.now();

    const animate = () => {
      const progress = Math.min(
        (Date.now() - startTime) / this.animationDuration,
        1
      );
      const ease = this.easeOutExpo(progress);

      this.container.scrollLeft = start + (target - start) * ease;

      if (progress < 1) {
        this.animationFrame = requestAnimationFrame(animate);
      }
    };

    this.animationFrame = requestAnimationFrame(animate);
  }

  easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }
}
// Инициализация после загрузки
document.addEventListener("DOMContentLoaded", () => {
  new HorizontalScroll();
});

//навигация фильтра
document.querySelectorAll(".all-tours-filter__tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    tab.classList.toggle("active");
  });
});
//кнопка ON/OF фильтра
const openFilter = document.querySelector(".grand-filter-button");
const bodyFilter = document.querySelector(".grand-filter");
openFilter.addEventListener("click", () => {
  bodyFilter.classList.toggle("active");
});

// Функция для форматирования номера телефона
function formatPhoneNumber(input) {
  let numbers = input.value.replace(/\D/g, "");

  numbers = numbers.slice(0, 11);

  let formattedNumber = "";

  if (numbers.length > 0) {
    formattedNumber = "+7";
  }

  if (numbers.length > 1) {
    formattedNumber += "(" + numbers.substring(1, 4);
  }

  if (numbers.length > 4) {
    formattedNumber += ") " + numbers.substring(4, 7);
  }

  if (numbers.length > 7) {
    formattedNumber += " " + numbers.substring(7, 9);
  }

  if (numbers.length > 9) {
    formattedNumber += " " + numbers.substring(9, 11);
  }

  input.value = formattedNumber;
}

const phoneInputs = document.querySelectorAll('input[type="tel"]');

phoneInputs.forEach((input) => {
  input.addEventListener("input", function () {
    formatPhoneNumber(this);
  });

  input.addEventListener("focusout", function () {
    formatPhoneNumber(this);
  });
});

//открыть / закрыть фильтр
document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    const button = e.target.closest(".grand-filter-button");
    if (!button) return;

    const parentContainer =
      button.closest(".filter-group") || button.parentElement;

    const filterBlock = parentContainer.querySelector(":scope > .grand-filter");

    if (filterBlock) {
      filterBlock.classList.toggle("active");

      document.querySelectorAll(".grand-filter").forEach((el) => {
        if (el !== filterBlock) el.classList.remove("active");
      });
    }
  });
});
