import { apiGet } from "./Api.js";

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const tourId = urlParams.get("id")?.trim();

  console.log("Полученный ID тура:", tourId);

  function showError(message) {
    alert("Тур временно не доступен");
    console.error("Ошибка:", message);
  }

  if (!tourId) {
    showError("ID тура не указан");
    return;
  }

  // Асинхронная функция загрузки данных
  async function fetchToursData() {
    try {
      const data = await apiGet();
      console.log("Полученные данные:", data);

      const tours = data.tours;
      if (!Array.isArray(tours)) {
        throw new Error("Данные не являются массивом туров");
      }

      const tour = tours.find((t) => t.id.toString() === tourId);
      if (!tour) throw new Error("Тур не найден");

      renderTour(tour);
    } catch (error) {
      showError(error.message);
    }
  }

  //   // Основная функция рендера тура
  function renderTour(tour) {
    const container = document.getElementById("tour-content");
    const bookingForm = document.getElementById("booking-form");
    const reviewsContainer = document.getElementById("reviews-content");
    if (!container || !bookingForm || !reviewsContainer) {
      console.warn("Некоторые элементы DOM не найдены");
      return;
    }
    // Обновляем название
    const title = container.querySelector(".tour-page__text");
    title.textContent = tour.tourpage_title;

    const programEl = container.querySelector(".tour-program");
    const lines = tour.tourpage_programm.split("\n");
    const ul = document.createElement("ul");
    lines.forEach((line) => {
      const li = document.createElement("li");
      li.textContent = line.trim();
      ul.appendChild(li);
    });
    programEl.appendChild(ul);

    const descriptionEl = container.querySelector(".tour-description");
    const linesDesc = tour.tourpage_included.split("\n");
    const descList = document.createElement("ul");
    linesDesc.forEach((line) => {
      const li = document.createElement("li");
      li.textContent = line.trim();
      descList.appendChild(li);
    });
    descriptionEl.appendChild(descList);

    const costEl = container.querySelector(".tour-cost");
    const linesCost = tour.tourpage_cost.split("\n");
    const costList = document.createElement("ul");
    linesCost.forEach((line) => {
      const li = document.createElement("li");
      li.textContent = line.trim();
      costList.appendChild(li);
    });
    costEl.appendChild(costList);

    const swiperWrapper = container.querySelector(".swiper-wrapper");
    // Фото слайдов
    const slides = tour.tourpage_slides;
    slides.forEach((src) => {
      const slide = document.createElement("div");
      slide.className = "swiper-slide";
      const img = document.createElement("img");
      img.src = src;
      slide.appendChild(img);
      if (swiperWrapper) swiperWrapper.appendChild(slide);
    });

    //   // Обработка отзывов
    const reviewEls = document.querySelectorAll(
      ".reviews__item .reviews__item-text"
    );

    if (reviewEls.length && tour.reviews_item) {
      tour.reviews_item.forEach((item, index) => {
        const reviewEl = reviewEls[index];
        if (reviewEl) {
          const titleEl = reviewEl.querySelector("h2");
          const textEl = reviewEl.querySelector("p");
          titleEl.textContent = item.title;
          textEl.textContent = item.text;
        }
      });
    }

    // Фото для отзывов
    const reviewsBannerPic = reviewsContainer.querySelector(
      ".reviews__banner-pic"
    );
    if (reviewsBannerPic) {
      reviewsBannerPic.src = tour.reviews_gif || "";
    }

    // Фото отзывов
    const reviewPicturesBlocks =
      reviewsContainer.querySelectorAll(".reviews__picture");

    tour.reviews_images.forEach((item, index) => {
      const reviewImage = reviewPicturesBlocks[index];

      if (reviewImage) {
        const imageCont = reviewImage;
        console.log(imageCont);
        const image = document.createElement("img");
        image.src = item;
        imageCont.appendChild(image);
      }
    });

    // Видеоролик
    const videoCont = document.querySelector(".reviews__video");
    if (videoCont) {
      videoCont.src = tour.reviews_video || "";
    }

    const formTitle = bookingForm.querySelector("h3");
    formTitle.textContent = tour.tourpage_title;

    const formPrice = bookingForm.querySelector(".booking-price");
    formPrice.textContent = tour.form_prise;
  }

  fetchToursData();
});
