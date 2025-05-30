import { apiGet } from "./Api.js";
import { updateCardWidth } from "./scroll-hot-tours-container.js";

const containerId = "hot-tours-elements";
const templates = ["template-left", "template-right"];

// Глобальный массив для хранения только туров с tip: "hot"
let hotTours = [];

// Загрузка данных и фильтрация только hot-туры
async function loadHotTours() {
  try {
    const data = await apiGet();
    console.log("Полученные данные:", data);

    const tours = data.tours;

    if (!Array.isArray(tours)) {
      throw new Error("Данные не содержат массив tours");
    }

    // сохраняем только туры с tip: "hot"
    hotTours = tours.filter((tour) => tour.tip === "hot");
    return hotTours;
  } catch (e) {
    console.error("Ошибка при загрузке данных:", e);
    return [];
  }
}

// Создание карточки тура
function createActivityCard(tour, template, positionClass) {
  const clone = template.content.cloneNode(true);
  const card = clone.querySelector(".hot-tours-item");
  card.classList.add(positionClass);
  card.id = tour.id;
  card.dataset.tip = tour.tip;
  card.dataset.season = tour.season.join(",");
  card.dataset.duration = tour.duration;
  card.dataset.activity = tour.activity.join(",");

  // Обработчик перехода
  card.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = `tour-page.html?id=${tour.id}#tour-page`;
  });

  // Заполнение изображения
  const img = card.querySelector("img");
  img.src = tour.hot_picture;
  img.alt = tour.hot_title || "на ремонте";

  // Продолжительность
  const durationElem = card.querySelector("p");
  durationElem.textContent = tour.hot_duration;

  // Название тура
  const title = card.querySelector("h2");
  title.innerHTML = tour.hot_title;

  // Цена
  const price = card.querySelector("h3");
  price.textContent = tour.hot_price;

  return clone;
}

// Создание разделителя
function createSeparator() {
  const separatorTemplate = document.getElementById("separator-template");
  if (!separatorTemplate) {
    console.error("Шаблон разделителя не найден");
    return null;
  }
  const separatorClone = separatorTemplate.content.cloneNode(true);
  return separatorClone;
}

// Рендеринг туров с разделителями между 1-ой и 2-й, 3-ей и 4-й и т.д.
function renderActivities(tours, containerId, templates) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Контейнер ${containerId} не найден`);
    return;
  }
  container.innerHTML = ""; // очищаем контейнер

  tours.forEach((tour, index) => {
    const templateId = templates[index % templates.length]; // чередуем шаблоны
    const template = document.getElementById(templateId);
    if (!template) {
      console.error(`Шаблон ${templateId} не найден`);
      return;
    }
    const positionClass = index % 2 === 0 ? "item-left" : "item-right";
    const cardElement = createActivityCard(tour, template, positionClass);
    container.appendChild(cardElement);

    // После каждой нечетной карточки (индексы 0, 2, 4, ...) вставляем разделитель, кроме последней
    if (index % 2 === 0 && index !== tours.length - 1) {
      const separator = createSeparator();
      if (separator) {
        container.appendChild(separator);
        updateCardWidth();
      }
    }
  });
  updateCardWidth();
}

// Инициализация
async function initActivities() {
  const tours = await loadHotTours();

  if (!Array.isArray(tours)) {
    console.error("Данные туров не получены или не являются массивом");
    return;
  }

  renderActivities(tours, containerId, templates);
}

document.addEventListener("DOMContentLoaded", initActivities);
