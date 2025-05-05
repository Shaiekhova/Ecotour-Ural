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
      this.smoothScroll(delta * 5);
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

//навигация фильтра
document.querySelectorAll(".all-tours-filter__tab").forEach((tab) => {
  tab.addEventListener("click", function () {
    this.closest(".all-tours-filter__tab-container")
      ?.querySelectorAll(".active")
      .forEach((el) => el.classList.remove("active"));
    this.classList.add("active");
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

    // Находим ближайший родительский контейнер
    const parentContainer =
      button.closest(".filter-group") || button.parentElement;

    // Ищем следующий элемент с классом .grand-filter
    const filterBlock = parentContainer.querySelector(":scope > .grand-filter");

    if (filterBlock) {
      filterBlock.classList.toggle("active");

      // Закрытие других блоков (опционально)
      document.querySelectorAll(".grand-filter").forEach((el) => {
        if (el !== filterBlock) el.classList.remove("active");
      });
    }
  });
});
