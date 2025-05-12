// Объект для хранения активных фильтров
const activeFilters = {
  season: new Set(),
  duration: new Set(),
  activity: new Set(),
};

// Получаем оба контейнера
const containers = document.querySelectorAll(".all-tours-grid");

// Функция для получения всех карточек из обоих контейнеров
function getItems() {
  const items = [];
  containers.forEach((container) => {
    items.push(...container.querySelectorAll(".all-tours-section__item"));
  });
  return items;
}

// Функция фильтрации карточек
function filterItems() {
  const items = getItems();

  items.forEach((item) => {
    let show = true;

    // Проверка по сезону
    if (activeFilters.season.size > 0) {
      const itemSeason = item.getAttribute("data-season");
      if (itemSeason && itemSeason.trim() !== "") {
        const matchesSeason = [...activeFilters.season].some(
          (s) => s.toLowerCase() === itemSeason.toLowerCase()
        );
        if (!matchesSeason) {
          show = false;
        }
      }
    }

    // Проверка по длительности
    if (activeFilters.duration.size > 0) {
      const itemDuration = item.getAttribute("data-duration");
      if (itemDuration && itemDuration.trim() !== "") {
        const matchesDuration = [...activeFilters.duration].some(
          (d) => d.toLowerCase() === itemDuration.toLowerCase()
        );
        if (!matchesDuration) {
          show = false;
        }
      }
    }

    // Проверка по активности
    if (activeFilters.activity.size > 0) {
      const itemActivity = item.getAttribute("data-activity");
      if (itemActivity && itemActivity.trim() !== "") {
        const matchesActivity = [...activeFilters.activity].some(
          (a) => a.toLowerCase() === itemActivity.toLowerCase()
        );
        if (!matchesActivity) {
          show = false;
        }
      }
    }

    // Показываем или скрываем карточку
    item.style.display = show ? "" : "none";
  });
}

// Обработка кликов по фильтрам (делегирование)
document.querySelectorAll(".filter-group").forEach((group) => {
  group.addEventListener("click", (event) => {
    if (event.target.matches(".all-tours-filter__tab")) {
      const tab = event.target;
      const parentFilterGroup = tab.closest(".filter-group");
      const filterId = parentFilterGroup.id;
      const filterType = filterId.replace("-filter", ""); // 'season', 'duration', 'activity'
      const filterValue = tab.getAttribute(`data-${filterType}`);

      // Инициализация набора, если еще нет
      if (!activeFilters[filterType]) {
        activeFilters[filterType] = new Set();
      }

      // Переключение активного состояния
      if (activeFilters[filterType].has(filterValue)) {
        activeFilters[filterType].delete(filterValue);
        tab.classList.remove("active");
      } else {
        activeFilters[filterType].add(filterValue);
        tab.classList.add("active");
      }

      filterItems();
    }
  });
});

// Функция для добавления новых карточек (например, после загрузки с сервера)
function addCards(newCardsHtml, containerIndex = 0) {
  // containerIndex - индекс контейнера, в который добавляем
  const container = containers[containerIndex] || containers[0];

  // Добавляем новые карточки в выбранный контейнер
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = newCardsHtml;
  const newCards = Array.from(tempDiv.children);
  newCards.forEach((card) => {
    container.appendChild(card);
  });

  // После добавления новых карточек, при необходимости, можно вызвать фильтр
  filterItems();
}

// Изначальный запуск фильтрации
filterItems();

// observer.observe(element);
const filterElement = document.querySelector(".all-tours-filter");
const mainContentElement = document.querySelector(".main-content");

const observerOptions = {
  threshold: 1,
};
const observerOptionsOut = {
  threshold: 0.1,
};

// Обсервер для фиксирования `.all-tours-filter`
function initIntersectionObservers() {
  const filterElement = document.querySelector(".all-tours-filter");
  const mainContentElement = document.querySelector(".main-content");

  if (!filterElement || !mainContentElement) {
    console.warn("Не найдены необходимые элементы");
    return;
  }

  const observerOptions = {
    threshold: 1,
  };
  const observerOptionsOut = {
    threshold: 0.1,
  };

  const filterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        filterElement.classList.add("fixed");
      }
    });
  }, observerOptions);

  const mainContentObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        filterElement.classList.remove("fixed");
      }
    });
  }, observerOptionsOut);

  filterObserver.observe(filterElement);
  mainContentObserver.observe(mainContentElement);
}

document.addEventListener("DOMContentLoaded", initIntersectionObservers);
