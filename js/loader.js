// Вспомогательная функция для задержки
export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Функция для отображения лоадера по id
export function showLoader(loaderId = "loader") {
  const loader = document.getElementById(loaderId);
  if (loader) {
    loader.classList.add("loader-visible");
  }
}

// Функция для скрытия лоадера по id
export function hideLoader(loaderId = "loader") {
  const loader = document.getElementById(loaderId);
  if (loader) {
    loader.classList.remove("loader-visible");
  }
}

// Функция для отображения нужного лоадера, скрывая остальные
export function toggleLoader(showId, hideIds = []) {
  // Скрываем все указанные лоадеры
  hideIds.forEach((id) => hideLoader(id));
  // Показываем нужный
  showLoader(showId);
}
