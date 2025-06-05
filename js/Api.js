import { API_URL } from "./config.js";

// Экспортируем функцию apiGet для получения данных с кешированием
const STORAGE_KEY_DATA = "myData";
const STORAGE_KEY_TIME = "myDataTimestamp";

// Основная функция
async function apiGet() {
  const now = Date.now();
  const lastUpdate = localStorage.getItem(STORAGE_KEY_TIME);
  const dataString = localStorage.getItem(STORAGE_KEY_DATA);

  if (lastUpdate && dataString) {
    const elapsedMinutes = (now - parseInt(lastUpdate, 10)) / (1000 * 60);
    if (elapsedMinutes < 1) {
      console.log("Используем кешированные данные");
      return JSON.parse(dataString);
    }
  }

  // Делаете реальный запрос к API
  const newData = await fetch(API_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log("Ошибка при получении данных:", error);
      if (dataString) {
        return JSON.parse(dataString);
      }
      return [];
    });

  // Сохраняем новые данные и время
  localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(newData));
  localStorage.setItem(STORAGE_KEY_TIME, now.toString());

  console.log("Получены новые данные");
  return newData;
}

// Экспортируем функцию
export { apiGet };

export function updateData(newTours) {
  return fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tours: newTours }),
  }).catch((error) => console.log("error", error));
}

export function apiDelete(tourId) {
  return apiGet()
    .then((data) => {
      if (!data || !data.tours) throw new Error("Данные не найдены");
      data.tours = data.tours.filter((t) => t.id !== tourId);
      return updateData(data.tours);
    })
    .catch((error) => console.log("error", error));
}
