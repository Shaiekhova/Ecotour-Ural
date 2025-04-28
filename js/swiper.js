const swiper = new Swiper(".tour-page-swiper", {
  // Optional parameters
  direction: "horizontal",
  loop: false,

  mousewheel: {
    invert: true,
  },

  // If we need pagination
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },

  // Navigation arrows
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },

  // And if we need scrollbar
  scrollbar: {
    el: ".swiper-scrollbar",
  },
});
