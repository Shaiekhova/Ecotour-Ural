import { apiGet } from "./Api.js";

// Глобальный массив для хранения всех туров
let allTours = [];

// Объекты для хранения выбранных фильтров
const filters = {
  season: null,
  duration: null,
  activity: null,
};

// Массивы для мультивыбора
const selectedSeasons = [];
const selectedDurations = [];
const selectedActivities = [];

// Объекты фильтра из блока #all-toursFilter
const selectedGrandFilters = {
  season: [], // массив выбранных сезонов
  duration: [], // массив выбранных продолжительностей
  activity: [], // массив выбранных типов туров
};

// Получаем вкладки фильтра
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

// Обработчики для вкладок фильтра
grandFilterTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const span = tab.querySelector("span");
    if (span) {
      span.classList.toggle("active");
    }
  });
});

// Загрузка туров
async function loadTours() {
  try {
    const data = await apiGet();
    const tours = data.tours;
    if (!Array.isArray(tours)) {
      throw new Error("Данные не являются массивом туров");
    }
    allTours = tours;
    displayTours(allTours);
  } catch (error) {
    console.error("Ошибка при загрузке туров:", error);
  }
}

// Основная функция фильтрации
function applyFilters() {
  const filteredTours = allTours.filter((tour) => {
    const tourSeasons = Array.isArray(tour.season)
      ? tour.season.map((s) => s.toLowerCase())
      : [];
    const tourActivities = Array.isArray(tour.activity)
      ? tour.activity.map((a) => a.toLowerCase())
      : [];
    const tourDuration = tour.duration.toLowerCase();

    // Проверка по мультивыбору
    const seasonMatch =
      selectedSeasons.length === 0 ||
      selectedSeasons.some((season) =>
        tourSeasons.includes(season.toLowerCase())
      );

    const durationMatch =
      selectedDurations.length === 0 ||
      selectedDurations.some(
        (duration) => duration.toLowerCase() === tourDuration
      );

    const activityMatch =
      selectedActivities.length === 0 ||
      selectedActivities.some((activity) =>
        tourActivities.includes(activity.toLowerCase())
      );

    // Проверки по фильтру из #all-toursFilter
    const grandSeasonMatch =
      selectedGrandFilters.season.length === 0 ||
      selectedGrandFilters.season.some((val) => tourSeasons.includes(val));
    const grandDurationMatch =
      selectedGrandFilters.duration.length === 0 ||
      selectedGrandFilters.duration.some(
        (val) => val.toLowerCase() === tourDuration
      );
    const grandActivityMatch =
      selectedGrandFilters.activity.length === 0 ||
      selectedGrandFilters.activity.some((val) => tourActivities.includes(val));

    return (
      seasonMatch &&
      durationMatch &&
      activityMatch &&
      grandSeasonMatch &&
      grandDurationMatch &&
      grandActivityMatch
    );
  });

  displayTours(filteredTours);
}

// Обработчики вкладок для мультивыбора
seasonTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const selectedSeason = tab.dataset.season;
    const index = selectedSeasons.indexOf(selectedSeason);
    const isActive = index !== -1;
    if (isActive) {
      selectedSeasons.splice(index, 1);
      tab.classList.remove("active");
    } else {
      selectedSeasons.push(selectedSeason);
      tab.classList.add("active");
    }
    applyFilters();
  });
});

durationTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const selectedDuration = tab.dataset.duration;
    const index = selectedDurations.indexOf(selectedDuration);
    const isActive = index !== -1;
    if (isActive) {
      selectedDurations.splice(index, 1);
      tab.classList.remove("active");
    } else {
      selectedDurations.push(selectedDuration);
      tab.classList.add("active");
    }
    applyFilters();
  });
});

activityTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const selectedActivity = tab.dataset.activity;
    const index = selectedActivities.indexOf(selectedActivity);
    const isActive = index !== -1;
    if (isActive) {
      selectedActivities.splice(index, 1);
      tab.classList.remove("active");
    } else {
      selectedActivities.push(selectedActivity);
      tab.classList.add("active");
    }
    applyFilters();
  });
});

// Обработчики фильтра из #all-toursFilter
grandFilterTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const seasonVal = tab.dataset.season;
    const durationVal = tab.dataset.duration;
    const activityVal = tab.dataset.activity;

    if (seasonVal) {
      const index = selectedGrandFilters.season.indexOf(seasonVal);
      if (index !== -1) {
        selectedGrandFilters.season.splice(index, 1);
        tab.classList.remove("active");
      } else {
        selectedGrandFilters.season.push(seasonVal);
        tab.classList.add("active");
      }
    } else if (durationVal) {
      const index = selectedGrandFilters.duration.indexOf(durationVal);
      if (index !== -1) {
        selectedGrandFilters.duration.splice(index, 1);
        tab.classList.remove("active");
      } else {
        selectedGrandFilters.duration.push(durationVal);
        tab.classList.add("active");
      }
    } else if (activityVal) {
      const index = selectedGrandFilters.activity.indexOf(activityVal);
      if (index !== -1) {
        selectedGrandFilters.activity.splice(index, 1);
        tab.classList.remove("active");
      } else {
        selectedGrandFilters.activity.push(activityVal);
        tab.classList.add("active");
      }
    }

    applyFilters();
  });
});

// Функция отображения туров
function displayTours(tours) {
  const containerInner = document.querySelector(".all-tours__container-inner");
  const template = document.getElementById("tour-card-template");

  // Очистка
  containerInner.innerHTML = "";

  const isMobileView = window.innerWidth <= 900;

  // Создаем или берем существующие ряды
  let topRow = document.querySelector(".top-row");
  let bottomRow = document.querySelector(".bottom-row");

  if (!topRow) {
    topRow = document.createElement("div");
    topRow.className = "row top-row";
  }

  if (!bottomRow && !isMobileView) {
    bottomRow = document.createElement("div");
    bottomRow.className = "row bottom-row";
  }

  if (isMobileView) {
    // Удаляем bottomRow, если есть
    if (bottomRow && bottomRow.parentNode) {
      bottomRow.parentNode.removeChild(bottomRow);
    }
    // Очищаем topRow
    topRow.innerHTML = "";
    // Рендерим все туры в один ряд
    renderCards(tours, topRow);
    containerInner.appendChild(topRow);
  } else {
    // При ширине > 900
    // Очищаем оба ряда
    topRow.innerHTML = "";
    if (bottomRow) bottomRow.innerHTML = "";

    // Разделяем пополам
    const half = Math.ceil(tours.length / 2);
    const firstHalf = tours.slice(0, half);
    const secondHalf = tours.slice(half);

    // Рендерим
    renderCards(firstHalf, topRow);
    renderCards(secondHalf, bottomRow);

    // Вставляем оба ряда
    containerInner.appendChild(topRow);
    if (bottomRow && !bottomRow.parentNode) {
      containerInner.appendChild(bottomRow);
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
    const title = item.querySelector("h2");
    const desc = item.querySelector(".all-tours-card__desc");
    const img = item.querySelector(".all-tours-card__pic img");
    const price = item.querySelector(".all-tours-card__price");

    // Обработка клика
    item.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = `tour-page.html?id=${tour.id}#tour-page`;
    });

    // Очистить описания
    desc.innerHTML = "";
    if (Array.isArray(tour.all_description)) {
      desc.innerHTML = tour.all_description.join("<br>");
    }

    // Заполнение данных
    if (tour.all_title) title.textContent = tour.all_title;
    if (tour.all_picture) img.src = tour.all_picture;
    if (tour.all_price) price.textContent = tour.all_price;

    // Установка дата-атрибутов
    item.dataset.tip = tour.tip;
    item.dataset.season = tour.season.join(",");
    item.dataset.duration = tour.duration;
    item.dataset.activity = tour.activity.join(",");

    container.appendChild(clone);
  });
}

// Обновление отображения при изменении окна
window.addEventListener("resize", () => {
  // Перезапускаем отображение с текущими фильтрами
  // Можно сделать так, чтобы фильтры не сбрасывались
  displayTours(applyCurrentFilters());
});

// Для этого создадим функцию, которая возвращает текущие отфильтрованные туры, применяя фильтры
function applyCurrentFilters() {
  const filtered = allTours.filter((tour) => {
    // Внутри - те же проверки, что в applyFilters, но без вызова displayTours
    const tourSeasons = Array.isArray(tour.season)
      ? tour.season.map((s) => s.toLowerCase())
      : [];
    const tourActivities = Array.isArray(tour.activity)
      ? tour.activity.map((a) => a.toLowerCase())
      : [];
    const tourDuration = tour.duration.toLowerCase();

    const seasonMatch =
      selectedSeasons.length === 0 ||
      selectedSeasons.some((season) =>
        tourSeasons.includes(season.toLowerCase())
      );

    const durationMatch =
      selectedDurations.length === 0 ||
      selectedDurations.some(
        (duration) => duration.toLowerCase() === tourDuration
      );

    const activityMatch =
      selectedActivities.length === 0 ||
      selectedActivities.some((activity) =>
        tourActivities.includes(activity.toLowerCase())
      );

    const grandSeasonMatch =
      selectedGrandFilters.season.length === 0 ||
      selectedGrandFilters.season.some((val) => tourSeasons.includes(val));
    const grandDurationMatch =
      selectedGrandFilters.duration.length === 0 ||
      selectedGrandFilters.duration.some(
        (val) => val.toLowerCase() === tourDuration
      );
    const grandActivityMatch =
      selectedGrandFilters.activity.length === 0 ||
      selectedGrandFilters.activity.some((val) => tourActivities.includes(val));

    return (
      seasonMatch &&
      durationMatch &&
      activityMatch &&
      grandSeasonMatch &&
      grandDurationMatch &&
      grandActivityMatch
    );
  });
  return filtered;
}

// Изначально вызываем загрузку
document.addEventListener("DOMContentLoaded", () => {
  loadTours();
});
