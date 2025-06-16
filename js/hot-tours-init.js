import { getTours } from "./Api.js";
import { showLoader, hideLoader } from "./loader.js";

// Константы
const containerIds = [
  "hot-tours-elements-1",
  "hot-tours-elements-2",
  "hot-tours-elements-3",
];
const templatesIds = ["template-left", "template-right"];

let hotTours = [];

// Переменные для выбранных фильтров
const selectedGrandFilters = {
  season: [],
  duration: [],
  activity: [],
};

// Изначальные выбранные фильтры для мультивыборов (если есть)
const selectedSeasons = [];
const selectedDurations = [];
const selectedActivities = [];

function toggleHotToursTwoClass(toursCount) {
  const element = document.getElementById("hot-tours-two");
  if (!element) return;
  if (toursCount > 2) {
    element.classList.add("hot-tours-two-visible");
  } else {
    element.classList.remove("hot-tours-two-visible");
  }
}

// Загрузка данных и первичный рендер
async function loadHotTours() {
  try {
    const data = await getTours();
    const tours = data;
    hotTours = tours.filter((tour) => tour.tip === "hot");
    // Перед рендерингом проверяем количество карточек
    toggleHotToursTwoClass(hotTours.length);
    renderTours(); // Отрисовка сразу после загрузки
  } catch (error) {
    console.error("Ошибка при загрузке данных:", error);
  }
}

// Создание карточки
function createActivityCard(tour, template, positionClass) {
  const clone = template.content.cloneNode(true);
  const card = clone.querySelector(".hot-tours-item");
  card.classList.add(positionClass);
  card.id = tour.id;
  card.dataset.tip = tour.tip;
  card.dataset.season = tour.season.join(",");
  card.dataset.duration = tour.duration;
  card.dataset.activity = tour.activity.join(",");

  document.querySelectorAll(".all-tours-link").forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.stopPropagation();
    });
  });
  card.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = `tour-page.html?id=${tour.id}#tour-page`;
  });

  // Заполнение содержимого
  const img = card.querySelector("img");
  if (tour.hot_picture) {
    img.src = tour.hot_picture;
  }
  if (tour.hot_title) {
    img.alt = tour.hot_title;
    card.querySelector("h2").innerHTML = tour.hot_title;
  } else {
    img.alt = "на ремонте";
  }

  if (tour.hot_duration) {
    card.querySelector("p").textContent = tour.hot_duration;
  }

  if (tour.hot_price) {
    card.querySelector("h3").textContent = tour.hot_price;
  }

  return clone;
}

function createSeparator() {
  const separatorTemplate = document.getElementById("separator-template");
  if (!separatorTemplate) return null;
  return separatorTemplate.content.cloneNode(true);
}

// Основная функция рендера
function renderTours(toursArray = hotTours) {
  for (const containerId of containerIds) {
    const container = document.getElementById(containerId);
    if (!container) continue;
    container.innerHTML = "";

    // Разделение на чанки по 2
    const toursChunks = [];
    const chunkSize = 2;
    for (let i = 0; i < toursArray.length; i += chunkSize) {
      toursChunks.push(toursArray.slice(i, i + chunkSize));
    }

    const index = containerIds.indexOf(containerId);
    const toursInContainer = toursChunks[index] || [];

    toursInContainer.forEach((tour, tourIndex) => {
      const templateId = templatesIds[tourIndex % templatesIds.length];
      const template = document.getElementById(templateId);
      if (!template) return;

      const positionClass = tourIndex % 2 === 0 ? "item-left" : "item-right";

      const cardElement = createActivityCard(tour, template, positionClass);
      container.appendChild(cardElement);

      // Добавляем разделитель, если нужно
      if (tourIndex % 2 === 0 && tourIndex !== toursInContainer.length - 1) {
        const separator = createSeparator();
        if (separator) container.appendChild(separator);
      }
    });
  }
}

// Обработка кликов по вкладкам "Гранд-фильтра"
function setupGrandFilterHandlers() {
  const tabs = document.querySelectorAll(
    "#hot-grand-filter .grand-filter__tab"
  );

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const categoryElem = tab
        .closest(".grand-filter__item")
        .querySelector("h2");
      const category = categoryElem.textContent.trim();
      const text = tab.querySelector("p").textContent.trim();

      // Обновляем активность вкладки
      if (tab.classList.contains("active")) {
        tab.classList.remove("active");
        removeFilter(category, text);
      } else {
        tab.classList.add("active");
        addFilter(category, text);
      }
      applyFilters();
    });
  });
}

function addFilter(category, text) {
  switch (category) {
    case "Сезон":
      if (!selectedGrandFilters.season.includes(text))
        selectedGrandFilters.season.push(text);
      break;
    case "Продолжительность":
      if (!selectedGrandFilters.duration.includes(text))
        selectedGrandFilters.duration.push(text);
      break;
    case "Тип тура":
      if (!selectedGrandFilters.activity.includes(text))
        selectedGrandFilters.activity.push(text);
      break;
  }
}

function removeFilter(category, text) {
  switch (category) {
    case "Сезон":
      selectedGrandFilters.season = selectedGrandFilters.season.filter(
        (item) => item !== text
      );
      break;
    case "Продолжительность":
      selectedGrandFilters.duration = selectedGrandFilters.duration.filter(
        (item) => item !== text
      );
      break;
    case "Тип тура":
      selectedGrandFilters.activity = selectedGrandFilters.activity.filter(
        (item) => item !== text
      );
      break;
  }
}

// Основная функция фильтрации
function applyFilters() {
  showLoader();
  setTimeout(() => {
    const filtered = hotTours.filter((tour) => {
      const tourSeasons = Array.isArray(tour.season)
        ? tour.season.map((s) => s.toLowerCase())
        : [];
      const tourActivities = Array.isArray(tour.activity)
        ? tour.activity.map((a) => a.toLowerCase())
        : [];
      const tourDuration = tour.duration.toLowerCase();

      // Проверка по "гранд" фильтрам
      const grandSeasonMatch =
        selectedGrandFilters.season.length === 0 ||
        selectedGrandFilters.season.some((s) =>
          tourSeasons.includes(s.toLowerCase())
        );
      const grandDurationMatch =
        selectedGrandFilters.duration.length === 0 ||
        selectedGrandFilters.duration.some(
          (d) => d.toLowerCase() === tourDuration
        );
      const grandActivityMatch =
        selectedGrandFilters.activity.length === 0 ||
        selectedGrandFilters.activity.some((a) => tourActivities.includes(a));

      // Мультивыбор
      const seasonMatch =
        selectedSeasons.length === 0 ||
        selectedSeasons.some((s) => tourSeasons.includes(s.toLowerCase()));
      const durationMatch =
        selectedDurations.length === 0 ||
        selectedDurations.some((d) => d.toLowerCase() === tourDuration);
      const activityMatch =
        selectedActivities.length === 0 ||
        selectedActivities.some((a) => tourActivities.includes(a));

      return (
        seasonMatch &&
        durationMatch &&
        activityMatch &&
        grandSeasonMatch &&
        grandDurationMatch &&
        grandActivityMatch
      );
    });

    // Перед рендерингом проверяем количество карточек
    toggleHotToursTwoClass(filtered.length);
    renderTours(filtered);
    hideLoader();
  }, 400);
}

// Инициализация
async function init() {
  await loadHotTours();
  setupGrandFilterHandlers();
  renderTours();
}

document.addEventListener("DOMContentLoaded", init);
