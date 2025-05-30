// Api.js
import { API_URL } from "./config.js";

export function apiGet() {
  return fetch(API_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .catch((error) => console.log("error", error));
}

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
