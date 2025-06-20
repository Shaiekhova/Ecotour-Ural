let disableHorizontalScrollFn = null; // Функция отключения горизонтального скролла
let isHorizontalScrollActive = false; // Статус активности горизонтального скролла

function initHorizontalScroll() {
  function enableHorizontalScrollOnWheel(selector) {
    const element = document.querySelector(selector);
    if (!element) return null;

    let lastDirection = null; // 'right' или 'left'
    let startTouchX = null;

    function onWheel(e) {
      e.preventDefault();

      const deltaY = e.deltaY;
      const currentScrollLeft = element.scrollLeft;
      const maxScrollLeft = element.scrollWidth - element.clientWidth;

      const direction = deltaY > 0 ? "right" : "left";

      if (lastDirection && lastDirection !== direction) {
        console.log("привет");
        if (direction === "left" && currentScrollLeft === 0) {
          console.log("стоп");
        }
      }

      lastDirection = direction;

      let newScrollLeft = currentScrollLeft + deltaY;
      newScrollLeft = Math.max(0, Math.min(newScrollLeft, maxScrollLeft));

      element.scrollTo({
        left: newScrollLeft,
        behavior: "auto",
      });
    }

    function onKeyDown(e) {
      const step = 50;
      const currentScrollLeft = element.scrollLeft;
      const maxScrollLeft = element.scrollWidth - element.clientWidth;
      let newScrollLeft = currentScrollLeft;

      if (e.key === "ArrowRight") {
        newScrollLeft = Math.min(currentScrollLeft + step, maxScrollLeft);
      } else if (e.key === "ArrowLeft") {
        newScrollLeft = Math.max(currentScrollLeft - step, 0);
      } else {
        return; // Игнорировать другие клавиши
      }

      e.preventDefault();
      element.scrollTo({ left: newScrollLeft, behavior: "auto" });
    }

    function onTouchStart(e) {
      if (e.touches.length === 1) {
        startTouchX = e.touches[0].clientX;
      }
    }

    function onTouchMove(e) {
      if (startTouchX !== null && e.touches.length === 1) {
        const currentX = e.touches[0].clientX;
        const deltaX = startTouchX - currentX;
        const currentScrollLeft = element.scrollLeft;
        const maxScrollLeft = element.scrollWidth - element.clientWidth;
        let newScrollLeft = currentScrollLeft + deltaX;

        newScrollLeft = Math.max(0, Math.min(newScrollLeft, maxScrollLeft));

        element.scrollTo({ left: newScrollLeft, behavior: "auto" });
        startTouchX = currentX; // Обновляем стартовую точку
      }
    }

    function onTouchEnd() {
      startTouchX = null;
    }

    // Обработчики
    element.addEventListener("wheel", onWheel, { passive: false });
    document.addEventListener("keydown", onKeyDown);
    element.addEventListener("touchstart", onTouchStart, { passive: true });
    element.addEventListener("touchmove", onTouchMove, { passive: false });
    element.addEventListener("touchend", onTouchEnd);

    // Функция для отключения всех обработчиков
    return () => {
      element.removeEventListener("wheel", onWheel);
      document.removeEventListener("keydown", onKeyDown);
      element.removeEventListener("touchstart", onTouchStart);
      element.removeEventListener("touchmove", onTouchMove);
      element.removeEventListener("touchend", onTouchEnd);
    };
  }

  let disableHorizontalScroll = null;

  const wrapperElement = document.querySelector(".all-tours__wrapper");
  if (wrapperElement) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio === 1) {
            if (typeof disableScroll === "function") disableScroll();

            if (disableHorizontalScroll) {
              disableHorizontalScroll();
              disableHorizontalScroll = null;
            }

            disableHorizontalScroll = enableHorizontalScrollOnWheel(
              ".all-tours__container-inner"
            );
          }
        });
      },
      { threshold: 1.0 }
    );
    observer.observe(wrapperElement);
  }

  const scrollContainer = document.querySelector(".all-tours__container-inner");
  if (scrollContainer) {
    let reachedEnd = false;

    function onScroll() {
      const currentScrollLeft = scrollContainer.scrollLeft;
      reachedEnd = true;

      if (reachedEnd && currentScrollLeft === 0) {
        reachedEnd = false;

        if (disableHorizontalScroll) {
          disableHorizontalScroll();
          disableHorizontalScroll = null;
        }

        if (typeof enableScroll === "function") {
          enableScroll();
        }
      }
    }
    scrollContainer.addEventListener("scroll", onScroll);
  }
}

// В функции проверки условий добавлена проверка ориентации
function checkAndToggleHorizontalScroll() {
  const tours = document.querySelectorAll(".all-tours-section__item");
  const toursCount = tours.length;
  const screenWidth = window.innerWidth;
  const mqOrientation = window.matchMedia("(orientation: portrait)");

  // Активировать, если туров больше 6, ширина > 900 и ориентация НЕ portrait
  const shouldActivate =
    toursCount > 6 && screenWidth > 900 && !mqOrientation.matches;

  if (shouldActivate) {
    // Включаем горизонтальный скролл, если еще не активен
    if (!isHorizontalScrollActive) {
      initHorizontalScroll();
      disableHorizontalScrollFn = () => {
        if (typeof disableHorizontalScroll === "function") {
          disableHorizontalScroll();
          disableHorizontalScroll = null;
        }
      };
      isHorizontalScrollActive = true;
    }
  } else {
    // Выключаем, если активен
    if (isHorizontalScrollActive) {
      if (typeof disableHorizontalScrollFn === "function") {
        disableHorizontalScrollFn();
        disableHorizontalScrollFn = null;
        isHorizontalScrollActive = false;
      }
    }
  }
}

// Изначально
checkAndToggleHorizontalScroll();

// Обновляем при изменении размеров экрана или ориентации
window.addEventListener("resize", checkAndToggleHorizontalScroll);
window.addEventListener("orientationchange", checkAndToggleHorizontalScroll);

//Ширина карточки в зависимости от ширины блока
function updateCardWidth() {
  const container = document.querySelector(".all-tours__container-inner");

  if (container) {
    const containerWidth = container.offsetWidth;
    let cardWidth;

    if (window.innerWidth <= 1179) {
      // Для экранов 1179px и меньше делим на 2
      cardWidth = containerWidth / 2;
    } else {
      // Для экранов больше 1179px делим на 3
      cardWidth = containerWidth / 3;
    }

    container.style.setProperty("--card-width", `${cardWidth}px`);
  }
}

window.addEventListener("load", updateCardWidth);
window.addEventListener("resize", updateCardWidth);
