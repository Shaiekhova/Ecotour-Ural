function loadToursData() {
  return fetch(
    "https://gist.githubusercontent.com/Shaiekhova/58f6e6b0b44f8b730f7a354d696d9538/raw/dc52f39e47030c4a07be90d3d4f2cdcdc482520c/db.json"
  )
    .then((response) => {
      if (!response.ok) throw new Error("Ошибка сети");
      return response.json();
    })
    .then((data) => {
      return data;
    });
}
function handleError(error) {
  console.error("Ошибка:", error);
  document.getElementById("all-tours-grid-1").innerHTML =
    "<p>Ошибка загрузки данных</p>";
  document.getElementById("all-tours-grid-2").innerHTML =
    "<p>Ошибка загрузки данных</p>";
}

function createTourCardElement(tour, template) {
  const clone = template.content.cloneNode(true);
  const card = clone.querySelector(".all-tours-section__item");
  card.id = tour.id_tour;
  card.dataset.tip = tour.tip;
  card.dataset.season = tour.param.season;
  card.dataset.duration = tour.param.duration;
  card.dataset.activity = tour.param.activity;

  clone.querySelector("h2").textContent = tour.param.title;
  clone.querySelector(".all-tours-card__desc p").textContent =
    tour.param.description;
  const img = clone.querySelector("img");
  if (!tour.param.image) {
    img.src = "https://placeholder.apptor.studio/200/200/product3.png";
    img.alt = "на ремонте";
  } else {
    img.src = tour.param.image;
    img.alt = tour.param.title;
  }
  clone.querySelector(".all-tours-card__price").textContent = tour.param.price;

  card.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = `tour-page.html?id=${tour.id_tour}`;
  });
  return clone;
}

function renderTours(tours) {
  const container1 = document.getElementById("all-tours-grid-1");
  const container2 = document.getElementById("all-tours-grid-2");
  const template = document.getElementById("tour-card-template");

  // Очистка контейнеров перед вставкой
  container1.innerHTML = "";
  container2.innerHTML = "";

  tours.forEach((tour) => {
    const cardElement = createTourCardElement(tour, template);
    if (Number(tour.id_tour) >= 1 && Number(tour.id_tour) <= 6) {
      container1.appendChild(cardElement);
    } else {
      container2.appendChild(cardElement);
    }
  });
}

function initApp() {
  loadToursData()
    .then((toursData) => {
      renderTours(toursData);
    })
    .catch((error) => {
      handleError(error);
    });
}

document.addEventListener("DOMContentLoaded", initApp);
