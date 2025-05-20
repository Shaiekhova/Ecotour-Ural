import { apiGet } from "./Api.js";

// Получаем контейнер и шаблон
const container = document.getElementById("all-tours-grid-1");
const template = document.getElementById("tour-card-template");

// Эта функция делает запрос и возвращает массив данных
async function loadTours() {
  try {
    const data = await apiGet();
    console.log("Полученные данные:", data);

    const tours = data.tours;
    if (!Array.isArray(tours)) {
      throw new Error("Данные не являются массивом туров");
    }

    container.innerHTML = "";

    // Перебираем туры и создаем карточки
    tours.forEach((tour) => {
      // Клонируем шаблон
      const clone = template.content.cloneNode(true);
      // Находим нужные элементы внутри клона
      const item = clone.querySelector(".all-tours-section__item");
      const title = item.querySelector("h2");
      const desc = item.querySelector(".all-tours-card__desc");
      const img = item.querySelector(".all-tours-card__pic img");
      const price = item.querySelector(".all-tours-card__price");
      // Обработка клика по карточке
      item.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = `tour-page.html?id=${tour.id}#tour-page`;
      });
      tour.all_description.forEach((text) => {
        const p = document.createElement("p");
        p.textContent = text;
        desc.appendChild(p);
      });
      item.dataset.tip = tour.tip;
      item.dataset.season = tour.season;
      item.dataset.duration = tour.duration;
      item.dataset.activity = tour.activity;
      if (tour.all_title) {
        title.textContent = tour.all_title;
      }
      if (tour.all_picture) {
        img.src = tour.all_picture;
      }
      if (tour.all_picture) {
        price.textContent = tour.all_price;
      }
      container.appendChild(clone);
    });
  } catch (error) {
    console.error("Ошибка при загрузке туров:", error);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  loadTours();
});
