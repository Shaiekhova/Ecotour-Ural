class HorizontalScrollWithInertia {
  constructor() {
    this.container = document.querySelector(".scroll-container");
    if (!this.container) {
      console.error("Контейнер не найден!");
      return;
    }

    this.targetScroll = this.container.scrollLeft;
    this.currentScroll = this.container.scrollLeft;
    this.easing = 0.1;
    this.velocity = 0;
    this.deceleration = 0.995;
    this.keyboardStep = 150;

    this.isMouseDown = false;
    this.prevMouseX = undefined;

    this.isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    this.init();
  }

  init() {
    this.wheelHandler = (e) => this.onWheel(e);
    this.touchStartHandler = (e) => this.onTouchStart(e);
    this.touchMoveHandler = (e) => this.onTouchMove(e);
    this.keyDownHandler = (e) => this.onKeyDown(e);
    this.mouseDownHandler = (e) => this.onMouseDown(e);
    this.mouseUpHandler = (e) => this.onMouseUp(e);
    this.mouseMoveHandler = (e) => this.onMouseMove(e);
    this.interactionHandler = () => this.onInteraction();

    this.container.addEventListener("wheel", this.wheelHandler, {
      passive: false,
    });
    // Добавляем обработчики только если не тач устройство
    if (!this.isTouchDevice) {
      this.container.addEventListener("touchstart", this.touchStartHandler, {
        passive: false,
      });
      this.container.addEventListener("touchmove", this.touchMoveHandler, {
        passive: false,
      });
    }
    document.addEventListener("keydown", this.keyDownHandler);
    this.container.addEventListener("mousedown", this.mouseDownHandler);
    document.addEventListener("mouseup", this.mouseUpHandler);
    document.addEventListener("mousemove", this.mouseMoveHandler);
    this.container.addEventListener("wheel", this.interactionHandler);
    if (!this.isTouchDevice) {
      this.container.addEventListener("touchstart", this.interactionHandler);
    }
    document.addEventListener("keydown", this.interactionHandler);

    this.animate();
  }

  onInteraction() {
    // Можно оставить пустым
  }

  onWheel(e) {
    e.preventDefault();
    const delta = e.deltaY || e.deltaX;
    this.setTargetScroll(this.targetScroll + delta);
    this.velocity += delta * 0.1;
  }

  onTouchStart(e) {
    if (this.isTouchDevice) {
      this.startX = e.touches[0].clientX;
      this.startScroll = this.targetScroll;
    }
  }

  onTouchMove(e) {
    if (this.isTouchDevice) {
      e.preventDefault(); // Можно убрать, чтобы не мешать стандартной прокрутке
      const deltaX = e.touches[0].clientX - this.startX;
      this.setTargetScroll(this.startScroll - deltaX * 2);
      this.velocity += deltaX * 0.05;
    }
  }

  onKeyDown(e) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      this.setTargetScroll(this.targetScroll - this.keyboardStep);
      this.velocity -= this.keyboardStep * 0.1;
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      this.setTargetScroll(this.targetScroll + this.keyboardStep);
      this.velocity += this.keyboardStep * 0.1;
    }
  }

  onMouseDown(e) {
    if (e.button === 0) {
      this.isMouseDown = true;
      this.prevMouseX = e.clientX;
    }
  }

  onMouseUp(e) {
    if (e.button === 0) {
      this.isMouseDown = false;
      this.prevMouseX = undefined;
    }
  }

  onMouseMove(e) {
    if (this.isMouseDown) {
      if (this.prevMouseX !== undefined) {
        const deltaX = e.clientX - this.prevMouseX;
        this.setTargetScroll(this.targetScroll - deltaX);
        this.velocity += deltaX * 0.05;
        this.prevMouseX = e.clientX;
      }
    }
  }

  setTargetScroll(value) {
    const maxScroll = this.container.scrollWidth - this.container.clientWidth;
    this.targetScroll = Math.max(0, Math.min(value, maxScroll));
  }

  animate() {
    if (!this.isMouseDown && Math.abs(this.velocity) > 0.01) {
      this.setTargetScroll(this.targetScroll + this.velocity);
      this.velocity *= this.deceleration;
    } else {
      this.velocity = 0;
    }

    const diff = this.targetScroll - this.currentScroll;
    this.currentScroll += diff * this.easing;
    this.container.scrollLeft = this.currentScroll;

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    this.container.removeEventListener("wheel", this.wheelHandler);
    if (!this.isTouchDevice) {
      this.container.removeEventListener("touchstart", this.touchStartHandler);
      this.container.removeEventListener("touchmove", this.touchMoveHandler);
    }
    document.removeEventListener("keydown", this.keyDownHandler);
    this.container.removeEventListener("mousedown", this.mouseDownHandler);
    document.removeEventListener("mouseup", this.mouseUpHandler);
    document.removeEventListener("mousemove", this.mouseMoveHandler);
    this.container.removeEventListener("wheel", this.interactionHandler);
    if (!this.isTouchDevice) {
      this.container.removeEventListener("touchstart", this.interactionHandler);
    }
    document.removeEventListener("keydown", this.interactionHandler);
    cancelAnimationFrame(this.animationFrameId);
  }
}

// Инициализация
let scrollInstance = null;

function manageScroll() {
  const mediaQuery = window.matchMedia(
    "(max-width: 900px), (orientation: portrait)"
  );
  const shouldDisable = mediaQuery.matches;

  if (!shouldDisable) {
    if (!scrollInstance) {
      scrollInstance = new HorizontalScrollWithInertia();
    }
  } else {
    if (scrollInstance) {
      scrollInstance.destroy();
      scrollInstance = null;
    }
  }
}

manageScroll();
window.addEventListener("resize", manageScroll);

// Обработчик при изменении размера окна
window.addEventListener("resize", manageScroll);

// Обработчик при изменении размера окна
window.addEventListener("resize", manageScroll);

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
