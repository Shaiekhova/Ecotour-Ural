const containersAndTemplates = [
  {
    containerId: "hot-tours-left1",
    templates: ["template-left-1", "template-right-1"],
  },
  {
    containerId: "hot-tours-left2",
    templates: ["template-left-2", "template-right-2"],
  },
];

function loadActivityData() {
  return fetch(
    "https://gist.githubusercontent.com/Shaiekhova/58f6e6b0b44f8b730f7a354d696d9538/raw/15f4c86815932fc5d28cd01fbdf875231dd93d5c/db.json"
  )
    .then((response) => {
      if (!response.ok) throw new Error("Ошибка сети");
      return response.json();
    })
    .then((data) => {
      return data;
    });
}

function createActivityCard(tour, template, positionClass) {
  const clone = template.content.cloneNode(true);
  const card = clone.querySelector(".hot-tours-item");
  card.classList.add(positionClass);

  const link = card.querySelector(".hot-tours-block");
  link.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = `tour-page.html?id=${tour.id_tour}`;
  });

  const img = card.querySelector("img");
  img.src =
    tour.param.image ||
    "https://placeholder.apptor.studio/200/200/product3.png";
  img.alt = tour.param.title || "на ремонте";

  const duration = card.querySelector("p");
  duration.textContent = tour.param.duration || "5 ДНЕЙ 4 НОЧИ";

  const title = card.querySelector("h2");
  title.innerHTML = (tour.param.title || "Название тура").replace(
    /\n/g,
    "<br />"
  );

  const price = card.querySelector("h3");
  if (tour.param.price !== undefined && price) {
    price.textContent = `${tour.param.price} руб/чел`;
  }

  return clone;
}

function renderActivities(tours, containerId, templates) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Контейнер ${containerId} не найден`);
    return;
  }
  container.innerHTML = "";

  tours.forEach((tour, index) => {
    const templateId = templates[index];
    const template = document.getElementById(templateId);
    if (!template) {
      console.error(`Шаблон ${templateId} не найден`);
      return;
    }
    const positionClass = index % 2 === 0 ? "item-left" : "item-right";
    const cardElement = createActivityCard(tour, template, positionClass);
    container.appendChild(cardElement);
  });
}

function initActivities() {
  loadActivityData()
    .then((tours) => {
      const hotTours = tours.filter((tour) => tour.tip === "hot");
      // Для каждого контейнера
      containersAndTemplates.forEach(({ containerId, templates }) => {
        const toursSubset = hotTours.splice(0, 2);
        renderActivities(toursSubset, containerId, templates);
      });
    })
    .catch((error) => {
      console.error("Ошибка:", error);
      // В случае ошибки показываем сообщение в контейнерах
      containersAndTemplates.forEach(({ containerId }) => {
        const container = document.getElementById(containerId);
        if (container) {
          container.innerHTML = "<p>Не удалось загрузить данные</p>";
        }
      });
    });
}

document.addEventListener("DOMContentLoaded", initActivities);
