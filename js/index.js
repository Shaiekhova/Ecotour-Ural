class HorizontalScroll {
  constructor() {
    this.container = document.querySelector(".scroll-container");
    this.isMobile = false;
    this.animationFrame = null;
    this.touchStartX = 0;
    this.scrollStartX = 0;

    // Настройки скорости и плавности
    this.scrollSpeed = 1.5;
    this.animationDuration = 400;
    this.keyboardStep = 150;

    this.targetScrollLeft = 0;
    this.currentScrollLeft = 0;
    this.isScrolling = false;

    this.init();
  }

  init() {
    this.checkViewport();
    this.addEventListeners();
    window.addEventListener("resize", () => this.onResize());
    document.addEventListener("keydown", (e) => this.handleKeyDown(e));
    this.update();
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

      this.setTargetScroll(
        this.container.scrollLeft + delta * (e.deltaMode === 1 ? 12 : 1)
      );
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
    this.setTargetScroll(this.scrollStartX - delta);
  }

  handleKeyDown(e) {
    if (this.isMobile || !this.container.contains(document.activeElement))
      return;

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      this.setTargetScroll(this.container.scrollLeft - this.keyboardStep);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      this.setTargetScroll(this.container.scrollLeft + this.keyboardStep);
    }
  }

  setTargetScroll(value) {
    // Ограничение границ прокрутки
    const maxScroll = this.container.scrollWidth - this.container.clientWidth;
    this.targetScrollLeft = Math.max(0, Math.min(value, maxScroll));
    if (!this.isScrolling) {
      this.isScrolling = true;
      this.animate(); // запускаем анимацию
    }
  }

  animate() {
    // Плавное приближение к целевому значению
    const diff = this.targetScrollLeft - this.currentScrollLeft;
    if (Math.abs(diff) < 0.5) {
      this.currentScrollLeft = this.targetScrollLeft;
      this.isScrolling = false;
    } else {
      // Используем easing для плавности
      this.currentScrollLeft += diff * 0.1; // коэффициент влияет на плавность
    }

    this.container.scrollLeft = this.currentScrollLeft;

    if (this.isScrolling) {
      this.animationFrame = requestAnimationFrame(() => this.animate());
    }
  }

  update() {
    // Постоянный обновляющий цикл для инерции
    if (!this.isScrolling) {
      // Можно добавить логику инерционного скролла при отпускании мыши/пальца
    }
    this.animationFrame = requestAnimationFrame(() => this.update());
  }
}

const scroll = new HorizontalScroll();

//навигация фильтра
document.querySelectorAll(".all-tours-filter__tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    tab.classList.toggle("active");
  });
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
      const allToursTitle = document.querySelector(".all-tours-link");
      if (allToursTitle) {
        allToursTitle.classList.toggle("active");
      }
      document.querySelectorAll(".grand-filter").forEach((el) => {
        if (el !== filterBlock) el.classList.remove("active");
      });
    }
  });
});
