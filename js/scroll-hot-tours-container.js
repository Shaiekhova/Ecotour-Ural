// //Ширина карточки в зависимости от ширины блока
export function updateCardWidth() {
  // Проверка медиа-запросов
  const mediaQueryMax900 = window.matchMedia("(max-width: 900px)");
  const mediaQueryPortrait = window.matchMedia("(orientation: portrait)");

  // Если один из условий выполняется, не обновляем ширину
  if (mediaQueryMax900.matches || mediaQueryPortrait.matches) {
    return; // ничего не делаем
  }

  const container = document.querySelector(".hot-tours-wrapper");
  const separator = document.querySelector(".hot-tours-separator");
  if (container) {
    const containerWidth = container.offsetWidth;
    const separatorWidth = separator ? separator.offsetWidth : 0;
    const availableWidth = containerWidth - separatorWidth;

    let cardWidth;

    if (window.innerWidth <= 900) {
      // Для экранов 900px и меньше делим на 1
      cardWidth = availableWidth / 2;
    } else {
      // Для экранов больше 900px делим на 2
      cardWidth = availableWidth / 2;
    }

    container.style.setProperty("--card-width", `${cardWidth}px`);
  }
}

window.addEventListener("load", updateCardWidth);
window.addEventListener("resize", updateCardWidth);

let disableHorizontalScrollFn = null; // Функция отключения горизонтального скролла
let isHorizontalScrollActive = false; // Статус активности горизонтального скролла

function initHorizontalScroll() {
  function enableHorizontalScrollOnWheel(selector) {
    const element = document.querySelector(selector);
    if (!element) return null;

    let lastDirection = null; // отслеживание направления
    let startTouchX = null;

    function onWheel(e) {
      e.preventDefault();

      const deltaY = e.deltaY;
      const currentScrollLeft = element.scrollLeft;
      const maxScrollLeft = element.scrollWidth - element.clientWidth;

      const direction = deltaY > 0 ? "right" : "left";

      // Проверка достижения правого края при прокрутке вправо
      if (direction === "right" && currentScrollLeft >= maxScrollLeft) {
        // отключить горизонтальный скролл и включить основной
        if (typeof disableHorizontalScroll === "function") {
          disableHorizontalScroll();
          disableHorizontalScroll = null;
        }
        if (typeof enableScroll === "function") {
          enableScroll();
        }
        // Удаляем обработчик колесика, чтобы не мешать
        element.removeEventListener("wheel", onWheel);
        return;
      }

      // Проверка достижения левого края при прокрутке влево
      if (direction === "left" && currentScrollLeft <= 0) {
        // отключить горизонтальный скролл и включить основной
        if (typeof disableHorizontalScroll === "function") {
          disableHorizontalScroll();
          disableHorizontalScroll = null;
        }
        if (typeof enableScroll === "function") {
          enableScroll();
        }
        element.removeEventListener("wheel", onWheel);
        return;
      }

      // Отслеживание направления
      if (lastDirection && lastDirection !== direction) {
        console.log("смена направления");
      }
      lastDirection = direction;

      let newScrollLeft = currentScrollLeft + deltaY;
      newScrollLeft = Math.max(0, Math.min(newScrollLeft, maxScrollLeft));

      element.scrollTo({ left: newScrollLeft, behavior: "auto" });
    }

    function onKeyDown(e) {
      const step = 50;
      const currentScrollLeft = element.scrollLeft;
      const maxScrollLeft = element.scrollWidth - element.clientWidth;
      let newScrollLeft = currentScrollLeft;

      if (e.key === "ArrowRight") {
        newScrollLeft = Math.min(currentScrollLeft + step, maxScrollLeft);
        // при достижении правого края
        if (newScrollLeft >= maxScrollLeft) {
          if (typeof disableHorizontalScroll === "function") {
            disableHorizontalScroll();
            disableHorizontalScroll = null;
          }
          if (typeof enableScroll === "function") {
            enableScroll();
          }
        }
      } else if (e.key === "ArrowLeft") {
        newScrollLeft = Math.max(currentScrollLeft - step, 0);
        // при достижении левого края
        if (newScrollLeft <= 0) {
          if (typeof disableHorizontalScroll === "function") {
            disableHorizontalScroll();
            disableHorizontalScroll = null;
          }
          if (typeof enableScroll === "function") {
            enableScroll();
          }
        }
      } else {
        return;
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

        // Проверка достижения правого края
        if (newScrollLeft >= maxScrollLeft) {
          if (typeof disableHorizontalScroll === "function") {
            disableHorizontalScroll();
            disableHorizontalScroll = null;
          }
          if (typeof enableScroll === "function") {
            enableScroll();
          }
        }

        // Проверка достижения левого края
        if (newScrollLeft <= 0) {
          if (typeof disableHorizontalScroll === "function") {
            disableHorizontalScroll();
            disableHorizontalScroll = null;
          }
          if (typeof enableScroll === "function") {
            enableScroll();
          }
        }

        element.scrollTo({ left: newScrollLeft, behavior: "auto" });
        startTouchX = currentX;
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

    // Возвращаем функцию для отключения всех обработчиков
    return () => {
      element.removeEventListener("wheel", onWheel);
      document.removeEventListener("keydown", onKeyDown);
      element.removeEventListener("touchstart", onTouchStart);
      element.removeEventListener("touchmove", onTouchMove);
      element.removeEventListener("touchend", onTouchEnd);
    };
  }

  let disableHorizontalScroll = null;

  // Наблюдение за видимостью элемента
  const wrapperElement = document.querySelector(".hot-tours-wrapper");
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
            disableHorizontalScroll =
              enableHorizontalScrollOnWheel(".hot-tours-wrapper");
          }
        });
      },
      { threshold: 1.0 }
    );
    observer.observe(wrapperElement);
  }

  // Обработчик для определения достижения края по скроллу
  const scrollContainer = document.querySelector(".hot-tours-wrapper");
  if (scrollContainer) {
    function onScroll() {
      const currentScrollLeft = scrollContainer.scrollLeft;
      const maxScrollLeft =
        scrollContainer.scrollWidth - scrollContainer.clientWidth;

      // при достижении правого края
      if (currentScrollLeft >= maxScrollLeft) {
        if (typeof disableHorizontalScroll === "function") {
          disableHorizontalScroll();
          disableHorizontalScroll = null;
        }
        if (typeof enableScroll === "function") {
          enableScroll();
        }
      }
      // при достижении левого края
      if (currentScrollLeft <= 0) {
        if (typeof disableHorizontalScroll === "function") {
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

// Функция, которая управляет активностью в зависимости от условий
function checkAndToggleHorizontalScroll() {
  const mqWidth = window.matchMedia("(max-width: 900px)");
  const mqOrientation = window.matchMedia("(orientation: portrait)");

  if (mqWidth.matches || mqOrientation.matches) {
    // Отключить горизонтальный, включить основной
    if (isHorizontalScrollActive) {
      if (typeof disableHorizontalScrollFn === "function") {
        disableHorizontalScrollFn();
        disableHorizontalScrollFn = null;
        isHorizontalScrollActive = false;
      }
    }
  } else {
    // Включить горизонтальный
    if (!isHorizontalScrollActive) {
      disableHorizontalScrollFn = () => {
        if (typeof disableHorizontalScroll === "function") {
          disableHorizontalScroll();
          disableHorizontalScroll = null;
        }
      };
      initHorizontalScroll();
      isHorizontalScrollActive = true;
    }
  }
}

// Изначально вызываем
checkAndToggleHorizontalScroll();
window.addEventListener("resize", checkAndToggleHorizontalScroll);
window.addEventListener("orientationchange", checkAndToggleHorizontalScroll);
