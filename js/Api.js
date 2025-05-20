// Api.js
import { API_URL } from "./config.js";

export function apiGet() {
  return fetch(API_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
}

export function apiPut(dataObject) {
  return fetch(API_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataObject),
  }).then((response) => response.text());
}

export function apiDelete() {
  return fetch(API_URL, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.text());
}
