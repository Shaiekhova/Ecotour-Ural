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
      const response = await fetch(
        "https://gist.githubusercontent.com/Shaiekhova/58f6e6b0b44f8b730f7a354d696d9538/raw/190c25f1a3003e035ff0df79ec40bbb7400c3095/db.json"
      );
      if (!response.ok) {
        throw new Error("Ошибка сети: " + response.status);
      }
      const data = await response.json();

      // Обработка данных: разбираем строки JSON внутри объектов
      const tours = data.map((item) => {
        let paramObj = {};
        let reviewsItemObj = {};
        try {
          paramObj = JSON.parse(item.param);
        } catch (e) {
          console.warn("Ошибка парсинга param для тура:", item.id_tour);
        }
        try {
          reviewsItemObj = JSON.parse(item.reviews_item);
        } catch (e) {
          console.warn("Ошибка парсинга reviews_item для тура:", item.id_tour);
        }
        return {
          ...item,
          param: paramObj,
          reviews_item: reviewsItemObj,
        };
      });

      const tour = tours.find((t) => t.id_tour.toString() === tourId);
      if (!tour) throw new Error("Тур не найден");

      renderTour(tour);
    } catch (error) {
      showError(error.message);
    }
  }

  // Вспомогательная функция для приведения данных к массиву
  function ensureArray(data) {
    if (Array.isArray(data)) {
      return data;
    }
    if (data == null) {
      return [];
    }
    if (typeof data === "string") {
      try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return [data];
      }
    }
    return [data];
  }

  // Основная функция рендера тура
  function renderTour(tour) {
    const container = document.getElementById("tour-content");
    const reviewsContainer = document.getElementById("reviews-content");
    const bookingForm = document.getElementById("booking-form");

    if (!container || !reviewsContainer || !bookingForm) {
      console.warn("Некоторые элементы DOM не найдены");
      return;
    }

    // Обновляем название
    const titleEl = container.querySelector(".tour-page__text");
    if (titleEl) titleEl.textContent = tour.param.page_title || "";

    // Очищаем содержимое
    const programEl = container.querySelector(".tour-program");
    const descriptionEl = container.querySelector(".tour-description");
    const costEl = container.querySelector(".tour-cost");
    const swiperWrapper = container.querySelector(".swiper-wrapper");
    if (programEl) programEl.innerHTML = "";
    if (descriptionEl) descriptionEl.innerHTML = "";
    if (costEl) costEl.innerHTML = "";
    if (swiperWrapper) swiperWrapper.innerHTML = "";

    // Заполняем программу
    const program = ensureArray(tour.param.page_program);
    program.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      if (programEl) programEl.appendChild(li);
    });

    // Заполняем включено
    const included = ensureArray(tour.param.page_included);
    included.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      if (descriptionEl) descriptionEl.appendChild(li);
    });

    // Заполняем стоимость
    const cost = ensureArray(tour.param.page_cost);
    cost.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      if (costEl) costEl.appendChild(li);
    });

    // Фото слайдов
    const slides = ensureArray(tour.param.page_slides);
    slides.forEach((src) => {
      const slide = document.createElement("div");
      slide.className = "swiper-slide";
      const img = document.createElement("img");
      img.src = src;
      slide.appendChild(img);
      if (swiperWrapper) swiperWrapper.appendChild(slide);
    });

    // Обработка отзывов
    const reviewEls = document.querySelectorAll(
      ".reviews__item .reviews__item-text"
    );
    if (reviewEls.length && tour.reviews_item) {
      tour.reviews_item.forEach((item, index) => {
        const reviewEl = reviewEls[index];
        if (reviewEl) {
          const titleEl = reviewEl.querySelector("h2");
          const textEl = reviewEl.querySelector("p");
          if (titleEl) titleEl.textContent = item.title || "";
          if (textEl) textEl.textContent = item.text || "";
        }
      });
    }

    // Фото для отзывов
    const reviewsBannerPic = reviewsContainer.querySelector(
      ".reviews__banner-pic"
    );
    if (reviewsBannerPic) {
      reviewsBannerPic.src =
        tour.param.reviews_pic ||
        "https://placeholder.apptor.studio/200/200/product3.png";
    }

    // Фото отзывов
    const reviewPicturesBlocks =
      reviewsContainer.querySelectorAll(".reviews__picture");
    const reviewsImages = ensureArray(tour.param.reviews_images);
    reviewsImages.forEach((src, index) => {
      const img = document.createElement("img");
      img.src = src;
      if (reviewPicturesBlocks.length >= 2) {
        if (index % 2 === 0) {
          reviewPicturesBlocks[0].appendChild(img);
        } else {
          reviewPicturesBlocks[1].appendChild(img);
        }
      }
    });

    // Видеоролик
    const videoCont = document.querySelector(".reviews__video");
    if (videoCont) {
      videoCont.src = tour.param.reviews_video;
    }

    // Обновление формы
    if (bookingForm) {
      bookingForm.dataset.id = tour.id_tour;
      const formTitleH3 = bookingForm.querySelector("h3");
      if (formTitleH3) formTitleH3.textContent = tour.param.page_title || "";
      const formTitleH4 = bookingForm.querySelector("h4");
      if (formTitleH4)
        formTitleH4.textContent =
          `Сумма: *` + (tour.param.price || "").replace(/^от\s*/, "");
    }
  }

  fetchToursData();
});
