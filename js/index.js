const container = document.querySelector(".scroll-container");

let isEnabled = false;

function onWheel(e) {
  e.preventDefault();

  const delta = Math.sign(e.deltaY);
  const scrollStep = 500; // шаг прокрутки

  const currentScrollLeft = container.scrollLeft;
  let newScrollLeft = currentScrollLeft + delta * scrollStep;

  // Ограничения по границам
  newScrollLeft = Math.max(
    0,
    Math.min(newScrollLeft, container.scrollWidth - container.clientWidth)
  );

  container.scrollTo({
    left: newScrollLeft,
    behavior: "smooth",
  });
}

function onKeyDown(e) {
  const key = e.key;
  const scrollStep = 500; // шаг прокрутки для клавиш

  let newScrollLeft = container.scrollLeft;

  if (key === "ArrowRight") {
    newScrollLeft += scrollStep;
  } else if (key === "ArrowLeft") {
    newScrollLeft -= scrollStep;
  } else if (key === "PageDown") {
    newScrollLeft += container.clientWidth;
  } else if (key === "PageUp") {
    newScrollLeft -= container.clientWidth;
  } else {
    return;
  }

  // Ограничения по границам
  newScrollLeft = Math.max(
    0,
    Math.min(newScrollLeft, container.scrollWidth - container.clientWidth)
  );

  container.scrollTo({
    left: newScrollLeft,
    behavior: "smooth",
  });
  e.preventDefault();
}

// Функция для включения скролла
function enableScroll() {
  if (isEnabled) return;
  isEnabled = true;
  // Добавляем слушатели
  container.addEventListener("wheel", onWheel, { passive: false });
  container.addEventListener("keydown", onKeyDown);
  // Включаем плавный скролл через CSS
  container.style.scrollBehavior = "smooth";
  // Сделать контейнер фокусируемым для обработки клавиш
  container.setAttribute("tabindex", "0");
  container.focus();
}

// Функция для отключения скролла
function disableScroll() {
  if (!isEnabled) return; // предотвращаем повторное выключение

  isEnabled = false;
  // Удаляем слушатели
  container.removeEventListener("wheel", onWheel);
  container.removeEventListener("keydown", onKeyDown);
  // Возвращаем плавность
  container.style.scrollBehavior = "auto";
}

// Обновление условий активации/отключения
function updateScrollFunction() {
  const width = window.innerWidth;
  const isPortrait = window.matchMedia("(orientation: portrait)").matches;

  if (width > 900 && !isPortrait) {
    enableScroll();
  } else {
    disableScroll();
  }
}

// Изначально вызываем для установки правильных условий
updateScrollFunction();

// Обновляем при изменении размеров окна или ориентации
window.addEventListener("resize", updateScrollFunction);
window.addEventListener("orientationchange", updateScrollFunction);

// Функция для сброса всех активных вкладок при условии ширины <= 900 и ориентации portrait
function resetTabsOnResize() {
  const isPortrait = window.matchMedia("(orientation: portrait)").matches;
  if (window.innerWidth <= 900 && isPortrait) {
    document.querySelectorAll(".all-tours-filter__tab").forEach((tab) => {
      tab.classList.remove("clicked-tab");
    });
  }
}

// Обработка клика по вкладкам
document.querySelectorAll(".filter-group").forEach((group) => {
  group.querySelectorAll(".all-tours-filter__tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const isPortrait = window.matchMedia("(orientation: portrait)").matches;
      if (window.innerWidth <= 900 && isPortrait) {
        // Если ширина <= 900 и ориентация портрет, сбрасываем класс
        tab.classList.remove("clicked-tab");
      } else {
        // Иначе переключаем класс
        tab.classList.toggle("clicked-tab");
      }
    });
  });
});

// Сброс вкладок при загрузке страницы
window.addEventListener("load", resetTabsOnResize);

// Сброс вкладок при изменении размера окна или ориентации
window.addEventListener("resize", resetTabsOnResize);
window.addEventListener("orientationchange", resetTabsOnResize);

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

//Высота текстового блока  about и рассчет количества строк
function setLineClamp() {
  const width = window.innerWidth;
  const textBlock = document.querySelector(".about__text");

  if (!textBlock) return; // если элемента нет, ничего не делаем

  if (width <= 900) {
    // Отключаем ограничение при ширине 900px и меньше
    textBlock.style.setProperty("-webkit-line-clamp", "none");
    textBlock.style.removeProperty("display");
    textBlock.style.removeProperty("-webkit-box-orient");
    textBlock.style.removeProperty("overflow");
    textBlock.style.removeProperty("word-break");
    return;
  }

  // Для разрешений больше 900px
  const style = getComputedStyle(textBlock);
  const fontSizeStr = style.fontSize;
  const fontSize = parseFloat(fontSizeStr);
  const lineHeight = 1.2 * fontSize;

  // Высота блока
  const height = textBlock.clientHeight;

  // Количество строк
  const linesCount = Math.max(0, Math.floor(height / lineHeight));

  // Устанавливаем переменную для line-clamp
  textBlock.style.setProperty("--line-clamp", linesCount);

  // Убедимся, что стили для multiline включены
  textBlock.style.display = "-webkit-box";
  textBlock.style.setProperty("-webkit-box-orient", "vertical");
  textBlock.style.overflow = "hidden";
  textBlock.style.setProperty("-webkit-line-clamp", "var(--line-clamp)");
  textBlock.style.wordBreak = "break-word";
}

// Обновляем при загрузке и при resize
window.addEventListener("load", () => {
  setLineClamp();
});
window.addEventListener("resize", () => {
  setLineClamp();
});
