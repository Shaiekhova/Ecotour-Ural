const container = document.querySelector(".scroll-container");

let isEnabled = false; // статус активации скролла
let targetScrollLeft = 0;
let isScrolling = false;

// Функция для включения/отключения обработчика
function updateScrollFunction() {
  const width = window.innerWidth;
  const orientation = window.orientation; // 0 или 180 — портрет, 90 или -90 — ландшафт
  const isPortrait = window.matchMedia("(orientation: portrait)").matches;

  // Включаем только если ширина > 900 и не в портретной ориентации
  if (width > 900 && !isPortrait) {
    if (!isEnabled) {
      enableScroll();
    }
  } else {
    if (isEnabled) {
      disableScroll();
    }
  }
}

function enableScroll() {
  isEnabled = true;
  container.addEventListener("wheel", onWheel, { passive: false });
}

function disableScroll() {
  isEnabled = false;
  container.removeEventListener("wheel", onWheel);
}

// Обработчик колесика
function onWheel(e) {
  e.preventDefault();

  const delta = Math.sign(e.deltaY);
  const scrollStep = 150; // скорость прокрутки

  // Обновляем целевое значение
  targetScrollLeft += delta * scrollStep;

  // Ограничения по границам
  targetScrollLeft = Math.max(
    0,
    Math.min(targetScrollLeft, container.scrollWidth - container.clientWidth)
  );

  // Запускаем анимацию, если еще не запущена
  if (!isScrolling) {
    isScrolling = true;
    animateScroll();
  }
}

// Анимация плавного скролла
function animateScroll() {
  const current = container.scrollLeft;
  const diff = targetScrollLeft - current;

  const smoothFactor = 0.1;

  if (Math.abs(diff) < 0.5) {
    container.scrollLeft = targetScrollLeft;
    isScrolling = false;
    return;
  }

  container.scrollLeft = current + diff * smoothFactor;

  requestAnimationFrame(animateScroll);
}

// Отслеживание изменения размера окна
window.addEventListener("resize", updateScrollFunction);

// Инициализация при загрузке
updateScrollFunction();

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
