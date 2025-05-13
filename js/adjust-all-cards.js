function adjustAllCards() {
  document.querySelectorAll(".all-tours-card__desc").forEach((desc) => {
    const paragraphs = desc.querySelectorAll("p");

    // Обнуляем ограничения
    paragraphs.forEach((p) => {
      p.style.webkitLineClamp = "none";
      p.style.display = "block";
    });

    const containerHeight = desc.clientHeight;
    let totalHeight = 0;
    let lastVisibleIndex = -1;

    // Определяем, сколько параграфов входит полностью
    for (let i = 0; i < paragraphs.length; i++) {
      const p = paragraphs[i];
      const pHeight = p.scrollHeight;
      if (totalHeight + pHeight <= containerHeight) {
        totalHeight += pHeight;
        lastVisibleIndex = i;
      } else {
        break;
      }
    }

    // Регулируем последний видимый параграф
    if (lastVisibleIndex >= 0 && lastVisibleIndex < paragraphs.length) {
      const p = paragraphs[lastVisibleIndex];
      const style = getComputedStyle(p);
      let lineHeight = parseFloat(style.lineHeight);
      if (isNaN(lineHeight)) {
        lineHeight = parseFloat(style.fontSize) || 15;
      }

      const usedHeight = totalHeight - p.scrollHeight;
      const remainingHeight = containerHeight - usedHeight;
      const maxLines = Math.floor(remainingHeight / lineHeight);

      if (maxLines > 0) {
        p.style.display = "-webkit-box";
        p.style.overflow = "hidden";
        p.style.webkitBoxOrient = "vertical";
        p.style.webkitLineClamp = maxLines.toString();
      } else {
        p.style.display = "none";
      }
    }
  });
}
