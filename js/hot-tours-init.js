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

// Изначальные выбранные фильтры для мультивыборов
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
    toggleHotToursTwoClass(hotTours.length);
    renderTours(); // Отрисовка сразу после загрузки
    updateAllCardImages(hotTours); // Обновляем изображения после рендера
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
  } else {
    img.style.border = "solid grey";
    img.src = "https://i.postimg.cc/QML4mft7/placeholder.jpg";
  }
  if (tour.hot_title) {
    img.alt = tour.hot_title;
    card.querySelector("h2").textContent = tour.hot_title;
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

      // разделитель
      if (tourIndex % 2 === 0 && tourIndex !== toursInContainer.length - 1) {
        const separator = createSeparator();
        if (separator) container.appendChild(separator);
      }
    });
  }
}

// Обновление изображений у всех карточек
function updateAllCardImages(toursArray) {
  console.log(
    "updateAllCardImages вызвано. Количество туров:",
    toursArray.length
  );
  const cards = document.querySelectorAll(".hot-tours-item");
  cards.forEach((card) => {
    const tourId = card.id;
    const tour = toursArray.find((t) => t.id === tourId);
    if (!tour) return;
    const img = card.querySelector("img");
    if (!img) return;

    let imageSrc;
    if (window.innerWidth <= 900 && tour.hot_picture_900) {
      imageSrc = tour.hot_picture_900;
    } else if (
      window.innerWidth <= 1024 &&
      window.innerHeight >= 768 &&
      tour.hot_picture_1024
    ) {
      imageSrc = tour.hot_picture_1024;
    } else if (tour.hot_picture) {
      imageSrc = tour.hot_picture;
    } else {
      imageSrc = "https://i.postimg.cc/QML4mft7/placeholder.jpg";
    }
    console.log(`Обновление изображения для тура ${tour.id}: ${imageSrc}`);
    img.src = imageSrc;
  });
}

// Обработчик resize
window.addEventListener("resize", () => {
  console.log("Resize event detected");
  updateAllCardImages(hotTours);
});

// Обработка вкладок фильтра
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

// Фильтрация
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

    toggleHotToursTwoClass(filtered.length);
    renderTours(filtered);
    updateAllCardImages(filtered); // Обновляем изображения для отфильтрованных туров
    hideLoader();
  }, 400);
}

// Инициализация
async function init() {
  await loadHotTours();
  setupGrandFilterHandlers();
  // Обновляем изображения при первой загрузке
  updateAllCardImages(hotTours);
}

// Запуск
document.addEventListener("DOMContentLoaded", init);
