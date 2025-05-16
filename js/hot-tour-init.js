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

// Асинхронная функция загрузки данных
async function loadActivityData() {
  try {
    const response = await fetch(
      "https://gist.githubusercontent.com/Shaiekhova/58f6e6b0b44f8b730f7a354d696d9538/raw/46bc8ac0657af5315d886567ce6f3d56034be6ef/db.json"
    );
    if (!response.ok) {
      throw new Error("Ошибка сети: " + response.status);
    }
    const data = await response.json();
    console.log("Полученные данные:", data);
    return data;
  } catch (e) {
    console.error("Ошибка при загрузке данных:", e);
    return [];
  }
}

// Создание карточки тура
function createActivityCard(tour, template, positionClass) {
  const clone = template.content.cloneNode(true);
  const card = clone.querySelector(".hot-tours-item");
  const param = JSON.parse(tour.param);
  card.classList.add(positionClass);
  card.id = tour.id_tour;
  card.dataset.tip = tour.tip;
  card.dataset.season = param.season;
  card.dataset.duration = param.duration;
  card.dataset.activity = param.activity;

  // Обработчик перехода
  card.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = `tour-page.html?id=${tour.id_tour}#tour-page`;
  });

  // Заполнение изображения
  const img = card.querySelector("img");
  img.src = param.image;
  img.alt = param.title || "на ремонте";

  // Продолжительность
  const durationElem = card.querySelector("p");
  durationElem.textContent = param.duration || "5 ДНЕЙ 4 НОЧИ";

  // Название тура
  const title = card.querySelector("h2");
  title.innerHTML = (param.title || "Название тура").replace(/\n/g, "<br />");

  // Цена
  const price = card.querySelector("h3");
  if (param.price !== undefined && price) {
    price.textContent = param.price;
  }

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
