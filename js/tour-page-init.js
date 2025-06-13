import { getTours } from "./Api.js";
import { showLoader, hideLoader, delay } from "./loader.js";

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const tourId = urlParams.get("id")?.trim();

  console.log("Полученный ID тура:", tourId);

  function showError(message) {
    alert("Тур временно не доступен");
    console.error("Ошибка:", message);
    window.location.href = "all-tours.html#tour";
  }

  if (!tourId) {
    showError("ID тура не указан");
    return;
  }

  // Асинхронная функция загрузки данных
  async function fetchToursData() {
    showLoader();
    try {
      const data = await getTours();
      console.log("Полученные данные:", data);
      const tours = data;
      const tour = tours.find((t) => t.id.toString() === tourId);
      if (!tour) throw new Error("Тур не найден");
      renderTour(tour);
    } catch (error) {
      showError(error.message);
    } finally {
      await delay(400);
      hideLoader();
    }
  }

  // Основная функция рендера тура
  function renderTour(tour) {
    const container = document.getElementById("tour-content");
    const bookingForm = document.getElementById("booking-form");
    const reviewsContainer = document.getElementById("reviews-content");
    const reviewsMain = document.getElementById("reviews");
    const reviewsBannerPic = reviewsContainer?.querySelector(
      ".reviews__banner-pic"
    );
    const reviewPicturesBlocks =
      reviewsContainer?.querySelectorAll(".reviews__picture");
    const reviewEls = document.querySelectorAll(
      ".reviews__item .reviews__item-text"
    );
    const videoCont = document.querySelector(".reviews__video");

    // Обработка отзывов - управление классом page-hidden
    if (reviewsContainer && reviewsMain) {
      if (tour.reviews === "no") {
        reviewsMain.classList.add("page-hidden");
      } else {
        reviewsMain.classList.remove("page-hidden");
      }
    }

    // Обновляем название тура
    const title = container?.querySelector(".tour-page__text");
    if (title && tour.tourpage_title) title.textContent = tour.tourpage_title;

    // Обработка программы тура
    const programEl = container?.querySelector(".tour-program");
    if (programEl && tour.tourpage_programm) {
      programEl.innerHTML = "";
      tour.tourpage_programm.split("\n").forEach((line) => {
        const li = document.createElement("li");
        li.textContent = line.trim();
        programEl.appendChild(li);
      });
    }

    // Описание включенных услуг
    const descriptionEl = container?.querySelector(".tour-description");
    if (descriptionEl && tour.tourpage_included) {
      descriptionEl.innerHTML = "";
      tour.tourpage_included.split("\n").forEach((line) => {
        const li = document.createElement("li");
        li.textContent = line.trim();
        descriptionEl.appendChild(li);
      });
    }

    // Стоимость
    const costEl = container?.querySelector(".tour-cost");
    if (costEl && tour.tourpage_cost) {
      costEl.innerHTML = "";
      tour.tourpage_cost.split("\n").forEach((line) => {
        const li = document.createElement("li");
        li.textContent = line.trim();
        costEl.appendChild(li);
      });
    }

    // Фото слайдов
    const swiperWrapper = container?.querySelector(".swiper-wrapper");
    if (swiperWrapper && tour.tourpage_slides) {
      swiperWrapper.innerHTML = "";
      tour.tourpage_slides.forEach((src) => {
        const slide = document.createElement("div");
        slide.className = "swiper-slide";
        const img = document.createElement("img");
        img.src = src || "https://zelonline.ru/images/404/noimage.png";
        slide.appendChild(img);
        swiperWrapper.appendChild(slide);
      });
      if (typeof swiper !== "undefined" && swiper.update) {
        swiper.update();
      }
    }

    // Обновление отзывов
    if (reviewEls.length && tour.reviews_item) {
      tour.reviews_item.forEach((item, index) => {
        const reviewEl = reviewEls[index];
        if (reviewEl) {
          const titleEl = reviewEl.querySelector("h2");
          const textEl = reviewEl.querySelector("p");
          if (titleEl && item.title) titleEl.textContent = item.title;
          if (textEl && item.text) textEl.textContent = item.text;
        }
      });
    }

    // Фото и gif для отзывов
    if (reviewsContainer) {
      if (reviewsBannerPic && tour.reviews_gif) {
        reviewsBannerPic.src = tour.reviews_gif;
      }
      if (reviewPicturesBlocks && tour.reviews_images) {
        tour.reviews_images.forEach((item, index) => {
          const reviewImage = reviewPicturesBlocks[index];
          if (reviewImage) {
            reviewImage.innerHTML = "";
            const img = document.createElement("img");
            img.src = item;
            reviewImage.appendChild(img);
          }
        });
      }
    }

    // Видеоролик
    if (videoCont && tour.reviews_video) {
      videoCont.innerHTML = tour.reviews_video;
    }

    // Обновление формы бронирования
    if (bookingForm) {
      const formTitle = bookingForm.querySelector("h3");
      if (formTitle && tour.tourpage_title)
        formTitle.textContent = tour.tourpage_title;

      const formPrice = bookingForm.querySelector(".booking-price");
      if (formPrice && tour.form_prise) formPrice.textContent = tour.form_prise;
    }
  }

  fetchToursData();
});
