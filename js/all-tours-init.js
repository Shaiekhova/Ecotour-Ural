import { getTours } from "./Api.js";
import { showLoader, hideLoader, delay } from "./loader.js";

let allTours = [];

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

async function init() {
  showLoader();
  try {
    const data = await getTours();
    allTours = data;
    console.log("Загружено туров:", allTours);
    setupEventListeners();
    displayTours(allTours);
  } catch (err) {
    console.error("Ошибка при загрузке данных", err);
  } finally {
    await delay(400);
    hideLoader();
  }
}

// Установка всех обработчиков
function setupEventListeners() {
  // Обработчики вкладок для мультивыбора
  [...seasonTabs, ...durationTabs, ...activityTabs].forEach((tab) => {
    tab.addEventListener("click", () => {
      handleTabClick(tab);
    });
  });

  // Обработчики глобальных фильтров
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
    hideLoader();
  }, 400);
}

// Отображение туров
function displayTours(tours) {
  const container = document.querySelector(".all-tours__container-inner");
  const template = document.getElementById("tour-card-template");

  // Очистка
  container.innerHTML = "";

  const isMobile = window.innerWidth <= 900;

  // Создаем/используем ряды
  let topRow = document.querySelector(".top-row");
  let bottomRow = document.querySelector(".bottom-row");

  if (!topRow) {
    topRow = document.createElement("div");
    topRow.className = "row top-row";
  }

  if (!bottomRow && !isMobile) {
    bottomRow = document.createElement("div");
    bottomRow.className = "row bottom-row";
  }

  if (isMobile) {
    // Удаляем нижний ряд, если есть
    if (bottomRow && bottomRow.parentNode) {
      bottomRow.parentNode.removeChild(bottomRow);
    }
    // Очищаем верхний и рендерим все в один ряд
    topRow.innerHTML = "";
    renderCards(tours, topRow);
    container.appendChild(topRow);
  } else {
    // Для больших экранов
    topRow.innerHTML = "";
    if (bottomRow) bottomRow.innerHTML = "";
    const half = Math.ceil(tours.length / 2);
    const firstHalf = tours.slice(0, half);
    const secondHalf = tours.slice(half);

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
    if (tour.all_picture) img.src = tour.all_picture;
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

// Запуск при загрузке
window.addEventListener("DOMContentLoaded", init);
//
