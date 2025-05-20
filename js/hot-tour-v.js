import { apiGet } from "./Api.js";

const containersAndTemplates = [
  {
    containerId: "hot-tours-left1",
    templates: ["template-left-1", "template-right-1"],
  },
  {
    containerId: "hot-tours-left2",
    templates: ["template-left-2", "template-right-2"],
  },
];

async function loadActivityData() {
  try {
    const data = await apiGet(); // вызываем apiGet
    console.log("Полученные данные:", data);

    const tours = data.tours; // предполагаю, что в данных есть свойство tours

    if (!Array.isArray(tours)) {
      throw new Error("Данные не содержат массив tours");
    }

    // Возвращаем массив туров
    return tours;
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
  card.dataset.season = tour.season;
  card.dataset.duration = tour.duration;
  card.dataset.activity = tour.activity;

  //   Обработчик перехода
  card.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = `tour-page.html?id=${tour.id}#tour-page`;
  });

  //   // Заполнение изображения
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

// Рендеринг туров в указанный контейнер
function renderActivities(tours, containerId, templates) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Контейнер ${containerId} не найден`);
    return;
  }
  container.innerHTML = ""; // очищаем контейнер

  tours.forEach((tour, index) => {
    const templateId = templates[index];
    const template = document.getElementById(templateId);
    if (!template) {
      console.error(`Шаблон ${templateId} не найден`);
      return;
    }
    const positionClass = index % 2 === 0 ? "item-left" : "item-right";
    const cardElement = createActivityCard(tour, template, positionClass);
    container.appendChild(cardElement);
  });
}

// Инициализация
async function initActivities() {
  const tours = await loadActivityData();

  if (!Array.isArray(tours)) {
    console.error("Данные туров не получены или не являются массивом");
    return;
  }

  const hotTours = tours.filter((tour) => tour.tip === "hot");

  // Распределяем по контейнерам
  for (const { containerId, templates } of containersAndTemplates) {
    const toursSubset = hotTours.splice(0, 2);
    renderActivities(toursSubset, containerId, templates);
  }
}

document.addEventListener("DOMContentLoaded", initActivities);
