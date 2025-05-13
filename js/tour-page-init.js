document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const tourId = urlParams.get("id")?.trim();

  console.log("Полученный ID тура:", tourId);

  function showError(message) {
    alert("Тур временно не доступен");
  }

  if (!tourId) {
    showError("ID тура не указан");
    return;
  }

  try {
    const response = await fetch(
      "https://gist.githubusercontent.com/Shaiekhova/58f6e6b0b44f8b730f7a354d696d9538/raw/15f4c86815932fc5d28cd01fbdf875231dd93d5c/db.json"
    );
    if (!response.ok) throw new Error("Ошибка сети: " + response.status);

    const tours = await response.json();

    const tour = tours.find((t) => t.id_tour.toString() === tourId);

    if (!tour) {
      throw new Error(`Тур не найден`);
    }
    renderTour(tour);
  } catch (error) {
    showError(error.message);
    console.error("Подробности ошибки:", error);
  }
});

function renderTour(tour) {
  const container = document.getElementById("tour-content");
  const reviewsContainer = document.getElementById("reviews-content");
  const bookingForm = document.getElementById("booking-form");

  // Обновляем содержимое контейнера тура
  container.querySelector(".tour-page__text").textContent =
    tour.param.page_title;

  // Очищаем предыдущие данные
  container.querySelector(".tour-program").innerHTML = "";
  container.querySelector(".tour-description").innerHTML = "";
  container.querySelector(".tour-cost").innerHTML = "";
  container.querySelector(".swiper-wrapper").innerHTML = "";

  // Отрисовка программы
  tour.param.page_program.forEach((elem) => {
    const item = document.createElement("li");
    item.textContent = elem;
    container.querySelector(".tour-program").appendChild(item);
  });

  // Включено
  const includedItem = document.createElement("li");
  includedItem.textContent = tour.param.page_included;
  container.querySelector(".tour-description").appendChild(includedItem);

  // Стоимость
  tour.param.page_cost.forEach((elem) => {
    const item = document.createElement("li");
    item.textContent = elem;
    container.querySelector(".tour-cost").appendChild(item);
  });

  // Слайды
  tour.param.page_slides.forEach((elem) => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";
    const img = document.createElement("img");
    img.src = elem || "https://placeholder.apptor.studio/200/200/product3.png";
    slide.appendChild(img);
    container.querySelector(".swiper-wrapper").prepend(slide);
  });

  // Отзывы

  //Картинка тура отзывы
  reviewsContainer.querySelector(".reviews__banner-pic").src =
    tour.param.reviews_pic ||
    "https://placeholder.apptor.studio/200/200/product3.png";

  //Картинки  отзывы
  const blocks = reviewsContainer.querySelectorAll(".reviews__picture");

  if (blocks.length >= 2) {
    tour.param.reviews_images.forEach((src, index) => {
      const img = document.createElement("img");
      img.src = src || "https://placeholder.apptor.studio/200/200/product3.png";

      if (index % 2 === 0) {
        blocks[0].appendChild(img);
      } else {
        blocks[1].appendChild(img);
      }
    });
  } else {
    console.error("Недостаточно блоков для размещения изображений");
  }
  // Меняем ТИТЛ у формы
  bookingForm.dataset.id = tour.id_tour;

  //Название тура
  bookingForm.querySelector("h3").textContent = tour.param.page_title;

  //Цена тура
  bookingForm.querySelector("h4").textContent =
    `Сумма: *` + tour.param.price.replace(/^от\s*/, "");
}
