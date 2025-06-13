import { API_URL } from "./config.js";

// Получить все туры
export async function getTours() {
  try {
    const response = await fetch(`${API_URL}/tours`);
    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`);
    }
    const data = await response.json();
    console.log("Все туры:", data);
    return data;
  } catch (error) {
    console.error("Ошибка получения туров:", error);
  }
}
