import { apiGet, updateData, apiDelete } from "./Api.js";
// --- Функция сбора отзывов с формы ---
function collectReviews() {
  const reviewDivs = document.querySelectorAll("#reviewsContainer .review");
  const reviews = [];
  reviewDivs.forEach((div) => {
    const title = div.querySelector(".reviewTitle").value.trim();
    const textStr = div.querySelector(".reviewText").value.trim();
    const textArr = textStr
      ? textStr
          .split(/[\n;]+/)
          .map((s) => s.trim())
          .filter((s) => s)
      : [];
    reviews.push({ title, text: textArr });
  });
  return reviews;
}

// --- Обработка формы добавления тура ---
document.getElementById("addTourForm").addEventListener("submit", (e) => {
  e.preventDefault();

  // Получение данных из формы
  const formData = {
    id: document.getElementById("addId").value.trim(),
    tip: document.getElementById("addTip").value.trim() || "hot",
    season: getArrayFromInput("addSeason"),
    duration: document.getElementById("addDuration").value.trim(),
    activity: getArrayFromInput("addActivity"),
    all_title: document.getElementById("addAllTitle").value.trim(),
    all_picture: document.getElementById("addAllPicture").value.trim(),
    all_price: document.getElementById("addAllPrice").value.trim(),
    all_description: getArrayFromInput("addAllDescription"),
    hot_title: document.getElementById("addHotTitle").value.trim(),
    hot_picture: document.getElementById("addHotPicture").value.trim(),
    hot_price: document.getElementById("addHotPrice").value.trim(),
    hot_duration: document.getElementById("addHotDuration").value.trim(),
    tourpage_title: document.getElementById("addTourPageTitle").value.trim(),
    tourpage_programm: getArrayFromInput("addTourPageProgramm"),
    tourpage_included: getArrayFromInput("addTourPageIncluded"),
    tourpage_cost: getArrayFromInput("addTourPageCost"),
    tourpage_slides: getArrayFromInput("addTourSlides", ","),
    reviews: getReviewsFlag(),
    reviews_gif: document.getElementById("addReviewsGif").value.trim(),
    reviews_images: getArrayFromInput("addReviewsImages"),
    reviews_item: collectReviews(), // отзывы пользователя
  };

  // Получение текущих данных и добавление нового тура
  apiGet()
    .then((data) => {
      if (!data || !data.tours) throw new Error("Нет данных");
      if (data.tours.some((t) => t.id === formData.id))
        throw new Error("ID уже есть");

      data.tours.push(formData); // добавляем только один тур
      return updateData(data.tours);
    })
    .then(() => {
      setStatus("Тур добавлен");
      document.getElementById("addTourForm").reset();
      refreshTours(); // обновляем список туров
    })
    .catch((err) => {
      setStatus("Ошибка: " + err.message, true);
    });
});

// --- Вспомогательные функции ---
function getArrayFromInput(inputId, splitChar = ",") {
  const str = document.getElementById(inputId).value.trim();
  if (!str) return [];
  return str
    .split(splitChar)
    .map((s) => s.trim())
    .filter((s) => s);
}

function getReviewsFlag() {
  const val = document.getElementById("addReviews").value.trim().toLowerCase();
  return val === "да" ? "yes" : "no";
}

// --- Отображение статуса ---
function setStatus(message, isError = false) {
  const statusDiv = document.getElementById("status");
  if (statusDiv) {
    statusDiv.textContent = message;
    statusDiv.style.color = isError ? "red" : "green";
    setTimeout(() => {
      statusDiv.style.color = "transparent";
    }, 300);
  } else {
    alert(message);
  }
}

// --- Обновление списка туров на странице ---
function refreshTours() {
  apiGet().then((data) => {
    if (data && data.tours) {
      renderTours(data.tours);
      setupDeleteButtons();
    }
  });
}

// --- Отрисовка туров ---
function renderTours(tours) {
  const container = document.getElementById("toursContainer");
  if (!container) {
    console.error("Контейнер для туров не найден");
    return;
  }
  container.innerHTML = ""; // очищаем

  tours.forEach((tour) => {
    const cardItem = document.createElement("div");
    cardItem.className = "card-tour";

    const deleteBtn = document.createElement("img");
    deleteBtn.className = "delete-tour-btn";
    deleteBtn.setAttribute("data-id", tour.id);
    deleteBtn.src = "https://i.postimg.cc/kGXPNZ3X/delete.png";

    // Заголовок
    const titleItem = document.createElement("h4");
    titleItem.className = "title-tour";
    titleItem.textContent = tour.all_title || "Без названия";

    // Изображение
    const imgItem = document.createElement("img");
    imgItem.src =
      tour.all_picture ||
      "https://placeholder.apptor.studio/200/200/product3.png";
    imgItem.alt = tour.all_title || "тур";
    imgItem.className = "image-tour";

    cardItem.id = tour.id;
    cardItem.appendChild(deleteBtn);
    cardItem.appendChild(imgItem);
    cardItem.appendChild(titleItem);
    container.appendChild(cardItem);
  });
}

// --- Установка обработчиков для кнопок удаления ---
function setupDeleteButtons() {
  const deleteButtons = document.querySelectorAll(".delete-tour-btn");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tourId = button.getAttribute("data-id");
      deleteTour(tourId);
    });
  });
}

// --- Удаление тура ---
function deleteTour(tourId) {
  apiDelete(tourId)
    .then(() => {
      alert("Тур успешно удален");
      // Обновляем список туров
      refreshTours();
    })
    .catch((error) => {
      console.error("Ошибка при удалении:", error);
      alert("Ошибка при удалении");
    });
}

// --- Изначальная загрузка туров при открытии страницы ---
apiGet().then((data) => {
  if (data && data.tours) {
    renderTours(data.tours);
    setupDeleteButtons();
  }
});
