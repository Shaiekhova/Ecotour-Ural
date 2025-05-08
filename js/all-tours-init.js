// Конфигурация
const config = {
  apiUrl:
    "https://gist.githubusercontent.com/Shaiekhova/228360576e5ab24bfde67ce49eb0425c/raw/58d4e7d71ff98b432918228a7504f58fe5bb440d/db.json",
  containerId: "all-tours-grid",
  templateId: "tour-card-template",
  fallbackImage: "https://via.placeholder.com/300x200?text=No+Image",
  defaultPrice: "Цена не указана",
};

// Основная функция загрузки данных
async function loadTourData() {
  try {
    showLoading();

    const response = await fetch(config.apiUrl);

    if (!response.ok) {
      throw new Error(`Ошибка HTTP! Статус: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Ожидался массив данных");
    }

    const processedData = processTourData(data);
    renderTourCards(processedData);
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
    showError("Не удалось загрузить данные. Пожалуйста, попробуйте позже.");
  } finally {
    hideLoading();
  }
}

// Обработка данных туров
function processTourData(data) {
  return data.map((item) => {
    try {
      // Проверка обязательных полей
      if (!item || typeof item !== "object") {
        throw new Error("Некорректный элемент тура");
      }

      // Парсинг параметров
      const params = parseTourParams(item.param);

      return {
        id: item.id_tour || generateId(),
        name: item.name || "Без названия",
        params: params,
      };
    } catch (error) {
      console.error("Ошибка обработки элемента тура:", error);
      return createFallbackTourItem();
    }
  });
}

// Парсинг параметров тура
function parseTourParams(param) {
  try {
    if (typeof param !== "string") {
      throw new Error("Параметр должен быть строкой");
    }

    const parsed = JSON.parse(param);

    if (typeof parsed !== "object" || parsed === null) {
      throw new Error("Параметры должны быть объектом");
    }

    return {
      link: parsed.link || "#",
      image: parsed.image || config.fallbackImage,
      price: parsed.price || config.defaultPrice,
      title: parsed.title || "Без названия",
      season: parsed.season || "Не указан",
      activity: parsed.activity || "Не указано",
      duration: parsed.duration || "Не указано",
      description: parsed.description || "Описание отсутствует",
    };
  } catch (error) {
    console.error("Ошибка парсинга параметров:", error);
    return createFallbackParams();
  }
}

// Рендеринг карточек туров
function renderTourCards(tours) {
  try {
    const container = document.getElementById(config.containerId);

    if (!container) {
      throw new Error(`Элемент с ID "${config.containerId}" не найден`);
    }

    container.innerHTML = "";

    if (!tours || !tours.length) {
      showNoToursMessage();
      return;
    }

    const template = document.getElementById(config.templateId);
    if (!template) {
      throw new Error(`Шаблон с ID "${config.templateId}" не найден`);
    }

    tours.forEach((tour) => {
      try {
        const cardElement = createTourCard(tour, template);
        if (cardElement) {
          container.appendChild(cardElement);
        }
      } catch (error) {
        console.error("Ошибка создания карточки тура:", error);
      }
    });
  } catch (error) {
    console.error("Ошибка отображения туров:", error);
    showError("Ошибка при отображении туров");
  }
}

// Создание карточки тура
function createTourCard(tour, template) {
  const clone = template.content.cloneNode(true);
  const card = clone.querySelector(".all-tours-section__item");

  if (!card) {
    throw new Error("Элемент .all-tours-section__item не найден в шаблоне");
  }

  // Устанавливаем атрибуты
  card.id = `tour-${tour.id}`;
  card.dataset.season = tour.params.season;
  card.dataset.duration = tour.params.duration;
  card.dataset.activity = tour.params.activity;

  // Заполняем содержимое
  const elements = {
    title: card.querySelector("h2"),
    desc: card.querySelector(".all-tours-card__desc p"),
    img: card.querySelector(".all-tours-card__pic img"),
    price: card.querySelector(".all-tours-card__price"),
    links: card.querySelectorAll("a"),
  };

  // Устанавливаем текст
  if (elements.title) elements.title.textContent = tour.params.title;
  if (elements.desc) elements.desc.textContent = tour.params.description;
  if (elements.price) elements.price.textContent = tour.params.price;

  // Устанавливаем изображение
  if (elements.img) {
    elements.img.src = tour.params.image;
    elements.img.alt = tour.params.title;
  }

  // Устанавливаем ссылки
  if (elements.links.length > 0) {
    elements.links.forEach((link) => {
      link.href = tour.params.link;
    });
  }

  return card;
}

// Вспомогательные функции
function showLoading() {
  const container = document.getElementById(config.containerId);
  if (container) {
    container.innerHTML = '<div class="loading">Загрузка данных...</div>';
  }
}

function hideLoading() {
  const loading = document.querySelector(".loading");
  if (loading) loading.remove();
}

function showError(message) {
  const container =
    document.getElementById(config.containerId) || document.body;
  container.innerHTML = `<div class="error">${message}</div>`;
}

function showNoToursMessage() {
  const container = document.getElementById(config.containerId);
  if (container) {
    container.innerHTML = '<div class="no-tours">Нет доступных туров</div>';
  }
}

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function createFallbackTourItem() {
  return {
    id: generateId(),
    name: "Неизвестный тур",
    params: createFallbackParams(),
  };
}

function createFallbackParams() {
  return {
    link: "#",
    image: config.fallbackImage,
    price: config.defaultPrice,
    title: "Неизвестный тур",
    season: "Не указан",
    activity: "Не указано",
    duration: "Не указано",
    description: "Описание отсутствует",
  };
}

// Запуск при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  // Проверяем, что необходимые элементы существуют
  if (
    document.getElementById(config.containerId) &&
    document.getElementById(config.templateId)
  ) {
    loadTourData();
  } else {
    console.error("Не найдены необходимые элементы DOM");
  }
});
