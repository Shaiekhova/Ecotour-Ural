async function loadToursData() {
  const response = await fetch(
    "https://gist.githubusercontent.com/Shaiekhova/58f6e6b0b44f8b730f7a354d696d9538/raw/190c25f1a3003e035ff0df79ec40bbb7400c3095/db.json"
  );
  if (!response.ok) {
    throw new Error("Ошибка сети");
  }
  const data = await response.json();
  return data;
}

// Обработка ошибок загрузки
function handleError(error) {
  console.error("Ошибка:", error);
  document.getElementById("all-tours-grid-1").innerHTML =
    "<p>Ошибка загрузки данных</p>";
  document.getElementById("all-tours-grid-2").innerHTML =
    "<p>Ошибка загрузки данных</p>";
}

// Создание карточки тура из шаблона
function createTourCardElement(tour, template) {
  const clone = template.content.cloneNode(true);
  const card = clone.querySelector(".all-tours-section__item");
  card.id = tour.id_tour;
  card.dataset.tip = tour.tip;
  card.dataset.season = tour.param.season;
  card.dataset.duration = tour.param.duration;
  card.dataset.activity = tour.param.activity;

  // Заголовок
  clone.querySelector("h2").textContent = tour.param.title;

  // Описание
  const descContainer = clone.querySelector(".all-tours-card__desc");
  descContainer.innerHTML = "";
  if (Array.isArray(tour.param.description)) {
    tour.param.description.forEach((text) => {
      const p = document.createElement("p");
      p.textContent = text;
      descContainer.appendChild(p);
    });
  } else if (typeof tour.param.description === "string") {
    const p = document.createElement("p");
    p.textContent = tour.param.description;
    descContainer.appendChild(p);
  }

  // Изображение
  const img = clone.querySelector("img");
  if (!tour.param.image) {
    img.src = "https://placeholder.apptor.studio/200/200/product3.png";
    img.alt = "на ремонте";
  } else {
    img.src = tour.param.image;
    img.alt = tour.param.title;
  }

  // Цена
  clone.querySelector(".all-tours-card__price").textContent = tour.param.price;

  // Обработка клика по карточке
  card.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = `tour-page.html?id=${tour.id_tour}`;
  });

  return clone;
}

// Функция рендера туров
function renderTours(tours) {
  const container1 = document.getElementById("all-tours-grid-1");
  const container2 = document.getElementById("all-tours-grid-2");
  const template = document.getElementById("tour-card-template");

  // Очистка контейнеров
  container1.innerHTML = "";
  container2.innerHTML = "";

  tours.forEach((tour, index) => {
    const cardElement = createTourCardElement(tour, template);
    if (index < 6) {
      container1.appendChild(cardElement);
    } else {
      container2.appendChild(cardElement);
    }
  });
}

// Инициализация приложения
async function initApp() {
  try {
    const data = await loadToursData();
    const toursData = data.map((item) => ({
      ...item,
      param: JSON.parse(item.param),
    }));
    renderTours(toursData);
    if (typeof adjustAllCards === "function") {
      adjustAllCards();
    }
  } catch (error) {
    handleError(error);
  }
}

document.addEventListener("DOMContentLoaded", initApp);
