import { getTours } from "./Api.js";
import { showLoader, hideLoader, delay } from "./loader.js";

let allTours = [];
let currentTours = []; // Для хранения текущего отображаемого списка туров

// Массивы для мультивыбора
const selectedSeasons = [];
const selectedDurations = [];
const selectedActivities = [];

// Объекты фильтра из блока #all-toursFilter
const selectedGrandFilters = {
  season: [],
  duration: [],
  activity: [],
};

// Получение вкладок
const seasonTabs = document.querySelectorAll(
  ".all-tours-filter__item:nth-child(1) .all-tours-filter__tab"
);
const durationTabs = document.querySelectorAll(
  ".all-tours-filter__item:nth-child(2) .all-tours-filter__tab"
);
const activityTabs = document.querySelectorAll(
  ".all-tours-filter__item:nth-child(3) .all-tours-filter__tab"
);
const grandFilterTabs = document.querySelectorAll(
  ".grand-filter .grand-filter__tab"
);

// Объявляем переменную для определения портретной ориентации
let isPortrait = window.matchMedia("(orientation: portrait)").matches;

// Обновляем переменную при изменении размера окна
window.addEventListener("resize", () => {
  isPortrait = window.matchMedia("(orientation: portrait)").matches;
  renderTours();
  if (isPortrait) {
    resetFilters();
  } else {
    selectedGrandFilters.season.length = 0;
    selectedGrandFilters.duration.length = 0;
    selectedGrandFilters.activity.length = 0;
    grandFilterTabs.forEach((tab) => tab.classList.remove("active"));
    applyFilters();
  }
});

// Инициализация при загрузке
window.addEventListener("DOMContentLoaded", () => {
  // Изначально
  if (isPortrait) {
    resetFilters();
  }
  init(); // запуск загрузки туров
});

// Функции сброса фильтров
function resetFilters() {
  // Сброс мультивыбора
  selectedSeasons.length = 0;
  selectedDurations.length = 0;
  selectedActivities.length = 0;

  // Убираем активность с вкладок
  seasonTabs.forEach((tab) => tab.classList.remove("active"));
  durationTabs.forEach((tab) => tab.classList.remove("active"));
  activityTabs.forEach((tab) => tab.classList.remove("active"));

  // Сброс глобальных фильтров
  selectedGrandFilters.season.length = 0;
  selectedGrandFilters.duration.length = 0;
  selectedGrandFilters.activity.length = 0;

  // Убираем активность с глобальных вкладок
  grandFilterTabs.forEach((tab) => tab.classList.remove("active"));

  // Обновляем отображение
  applyFilters();
}

// Основная функция инициализации
async function init() {
  showLoader();
  try {
    const data = await getTours();
    allTours = data;
    displayTours(allTours);
    setupEventListeners();
  } catch (err) {
    console.error("Ошибка при загрузке данных", err);
  } finally {
    await delay(400);
    hideLoader();
  }
}

// Установка всех обработчиков
function setupEventListeners() {
  [...seasonTabs, ...durationTabs, ...activityTabs].forEach((tab) => {
    tab.addEventListener("click", () => {
      handleTabClick(tab);
    });
  });

  grandFilterTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      handleGrandFilterClick(tab);
    });
  });
}

// Обработчик вкладки
function handleTabClick(tab) {
  const { season, duration, activity } = tab.dataset;

  if (season) {
    toggleFilterItem(selectedSeasons, season, tab);
  } else if (duration) {
    toggleFilterItem(selectedDurations, duration, tab);
  } else if (activity) {
    toggleFilterItem(selectedActivities, activity, tab);
  }
  applyFilters();
}

// Обработчик глобальных фильтров
function handleGrandFilterClick(tab) {
  const { season, duration, activity } = tab.dataset;

  if (season) {
    toggleFilterItem(selectedGrandFilters.season, season, tab);
  } else if (duration) {
    toggleFilterItem(selectedGrandFilters.duration, duration, tab);
  } else if (activity) {
    toggleFilterItem(selectedGrandFilters.activity, activity, tab);
  }
  applyFilters();
}

// Универсальная функция для переключения элемента фильтра
function toggleFilterItem(array, item, tab) {
  const index = array.indexOf(item);
  if (index !== -1) {
    array.splice(index, 1);
    tab.classList.remove("active");
  } else {
    array.push(item);
    tab.classList.add("active");
  }
}

// Основная функция фильтрации
function applyFilters() {
  showLoader();
  setTimeout(() => {
    const filtered = allTours.filter((tour) => {
      const tourSeasons = Array.isArray(tour.season)
        ? tour.season.map((s) => s.toLowerCase())
        : [];
      const tourActivities = Array.isArray(tour.activity)
        ? tour.activity.map((a) => a.toLowerCase())
        : [];
      const tourDuration = tour.duration.toLowerCase();

      const seasonMatch =
        selectedSeasons.length === 0 ||
        selectedSeasons.some((s) => tourSeasons.includes(s.toLowerCase()));
      const durationMatch =
        selectedDurations.length === 0 ||
        selectedDurations.some((d) => d.toLowerCase() === tourDuration);
      const activityMatch =
        selectedActivities.length === 0 ||
        selectedActivities.some((a) =>
          tourActivities.includes(a.toLowerCase())
        );

      const grandSeasonMatch =
        selectedGrandFilters.season.length === 0 ||
        selectedGrandFilters.season.some((s) => tourSeasons.includes(s));
      const grandDurationMatch =
        selectedGrandFilters.duration.length === 0 ||
        selectedGrandFilters.duration.some(
          (d) => d.toLowerCase() === tourDuration
        );
      const grandActivityMatch =
        selectedGrandFilters.activity.length === 0 ||
        selectedGrandFilters.activity.some((a) => tourActivities.includes(a));

      return (
        seasonMatch &&
        durationMatch &&
        activityMatch &&
        grandSeasonMatch &&
        grandDurationMatch &&
        grandActivityMatch
      );
    });
    displayTours(filtered);

    // Проверка, есть ли карточки после фильтрации
    const container = document.querySelector(".all-tours__container-inner");
    const cards = container.querySelectorAll(".all-tours-section__item");
    const plug = document.querySelector(".plug");

    if (cards.length === 0) {
      if (plug) {
        plug.classList.add("plug-visible");
      }
    } else {
      if (plug) {
        plug.classList.remove("plug-visible");
      }
    }
    hideLoader();
  }, 400);
}

// Отображение туров
function displayTours(tours) {
  currentTours = tours; // сохраняем текущие туры
  renderTours();
}

// Основная функция рендера карточек с учетом ориентации
function renderTours() {
  const container = document.querySelector(".all-tours__container-inner");
  container.innerHTML = "";

  if (isPortrait) {
    // Портретная ориентация — все карточки в один ряд
    let topRow = document.querySelector(".row.top-row");
    if (topRow && topRow.parentNode) {
      topRow.parentNode.removeChild(topRow);
    }
    topRow = document.createElement("div");
    topRow.className = "row top-row";

    renderCards(currentTours, topRow);
    container.appendChild(topRow);
  } else {
    // Ландшафт или другие ориентации — делим на две части
    let topRow = document.querySelector(".row.top-row");
    let bottomRow = document.querySelector(".row.bottom-row");
    if (!topRow) {
      topRow = document.createElement("div");
      topRow.className = "row top-row";
    }
    if (!bottomRow) {
      bottomRow = document.createElement("div");
      bottomRow.className = "row bottom-row";
    }

    topRow.innerHTML = "";
    bottomRow.innerHTML = "";

    const half = Math.ceil(currentTours.length / 2);
    const firstHalf = currentTours.slice(0, half);
    const secondHalf = currentTours.slice(half);

    renderCards(firstHalf, topRow);
    renderCards(secondHalf, bottomRow);

    container.appendChild(topRow);
    if (bottomRow && !bottomRow.parentNode) {
      container.appendChild(bottomRow);
    }
  }
}

// Вспомогательная функция для рендера карточек
function renderCards(toursArray, container) {
  toursArray.forEach((tour) => {
    const clone = document
      .getElementById("tour-card-template")
      .content.cloneNode(true);
    const item = clone.querySelector(".all-tours-section__item");
    item.querySelector("h2").textContent = tour.all_title || "";
    item.querySelector(".all-tours-card__desc").innerHTML = Array.isArray(
      tour.all_description
    )
      ? tour.all_description.join("<br>")
      : "";

    const img = item.querySelector(".all-tours-card__pic img");
    const placeholder = "https://i.postimg.cc/t4qmGcjH/zaglushka.webp";
    const src = tour.all_picture || placeholder;

    img.src = src;
    img.style.border = "1px solid grey";

    img.onerror = () => {
      img.src = placeholder;
    };

    const price = item.querySelector(".all-tours-card__price");
    if (tour.all_price) price.textContent = tour.all_price;

    // Дата-атрибуты
    item.dataset.tip = tour.tip;
    item.dataset.season = (tour.season || []).join(",");
    item.dataset.duration = tour.duration;
    item.dataset.activity = (tour.activity || []).join(",");

    // Обработка клика
    item.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = `tour-page.html?id=${tour.id}#tour-page`;
    });

    container.appendChild(clone);
  });
}
