import { apiGet } from "./Api.js";

// Массив id контейнеров
const containerIds = [
  "hot-tours-elements-1",
  "hot-tours-elements-2",
  "hot-tours-elements-3",
];
// Массив шаблонов
const templates = ["template-left", "template-right"];

let hotTours = [];

// Загрузка данных и фильтрация
async function loadHotTours() {
  try {
    const data = await apiGet();
    // console.info("Полученные данные:", data);

    const tours = data.tours;
    if (!Array.isArray(tours)) {
      throw new Error("Данные не содержат массив tours");
    }
    hotTours = tours.filter((tour) => tour.tip === "hot");
    return hotTours;
  } catch (e) {
    // Только важное сообщение об ошибке
    console.error("Ошибка при загрузке данных:", e);
    return [];
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

  card.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = `tour-page.html?id=${tour.id}#tour-page`;
  });

  const img = card.querySelector("img");
  img.src = tour.hot_picture;
  img.alt = tour.hot_title || "на ремонте";

  const durationElem = card.querySelector("p");
  durationElem.textContent = tour.hot_duration;

  const title = card.querySelector("h2");
  title.innerHTML = tour.hot_title;

  const price = card.querySelector("h3");
  price.textContent = tour.hot_price;

  return clone;
}

function createSeparator() {
  const separatorTemplate = document.getElementById("separator-template");
  if (!separatorTemplate) {
    // Можно оставить пустой или логировать, если нужно
    return null;
  }
  return separatorTemplate.content.cloneNode(true);
}

async function renderToursInContainers() {
  const tours = await loadHotTours();

  const toursPerContainer = [];
  const chunkSize = 2;
  for (let i = 0; i < hotTours.length; i += chunkSize) {
    toursPerContainer.push(hotTours.slice(i, i + chunkSize));
  }

  for (let index = 0; index < containerIds.length; index++) {
    const containerId = containerIds[index];
    const container = document.getElementById(containerId);
    if (!container) {
      // В случае отсутствия контейнера — просто пропускаем без логов
      continue;
    }

    container.innerHTML = "";

    const toursChunk = toursPerContainer[index] || [];

    toursChunk.forEach((tour, tourIndex) => {
      const templateId = templates[tourIndex % templates.length];
      const template = document.getElementById(templateId);
      if (!template) {
        // Можно пропускать без логов, если шаблон не найден
        return;
      }

      const positionClass = tourIndex % 2 === 0 ? "item-left" : "item-right";
      const cardElement = createActivityCard(tour, template, positionClass);
      container.appendChild(cardElement);

      if (tourIndex % 2 === 0 && tourIndex !== toursChunk.length - 1) {
        const separator = createSeparator();
        if (separator) {
          container.appendChild(separator);
        }
      }
    });
  }
}

async function initActivities() {
  await loadHotTours();
  await renderToursInContainers();
}

document.addEventListener("DOMContentLoaded", initActivities);
