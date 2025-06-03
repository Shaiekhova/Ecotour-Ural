const container = document.querySelector(".scroll-container");

let isEnabled = false; // статус активации скролла

// Функция для включения/отключения обработчика
function updateScrollFunction() {
  const width = window.innerWidth;
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
  container.addEventListener("keydown", onKeyDown);
  // Включаем плавный скролл через CSS
  container.style.scrollBehavior = "smooth";
  // Сделать контейнер фокусируемым для обработки клавиш
  container.setAttribute("tabindex", "0");
  container.focus();
}

function disableScroll() {
  isEnabled = false;
  container.removeEventListener("wheel", onWheel);
  container.removeEventListener("keydown", onKeyDown);
  container.style.scrollBehavior = "auto";
}

// Обработчик колесика
function onWheel(e) {
  e.preventDefault();

  const delta = Math.sign(e.deltaY);
  const scrollStep = 100; // шаг прокрутки

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

// Обработчик клавиш
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

  // Плавный скролл
  container.scrollTo({
    left: newScrollLeft,
    behavior: "smooth",
  });
  e.preventDefault(); // чтобы не было конфликтов с дефолтным поведением
}

// Изначально вызываем для установки правильных условий
updateScrollFunction();

// Обновляем при изменении размеров окна или ориентации
window.addEventListener("resize", updateScrollFunction);
window.addEventListener("orientationchange", updateScrollFunction);

//Фильтры
document.querySelectorAll(".filter-group").forEach((group) => {
  group.querySelectorAll(".all-tours-filter__tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      tab.classList.toggle("clicked-tab");
    });
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
/////////////////////////////////
