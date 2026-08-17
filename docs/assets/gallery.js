document.addEventListener("DOMContentLoaded", () => {
  const buttons = [...document.querySelectorAll("[data-lightbox] button")];
  const photos = buttons.map((b) => {
    const img = b.querySelector("img");
    return { src: img.getAttribute("src"), alt: img.getAttribute("alt") || "" };
  });
  if (!photos.length) return;
  let index = null;
  const overlay = document.createElement("div");
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Fotogalerie");
  overlay.hidden = true;
  overlay.className = "fixed inset-0 z-100 flex items-center justify-center bg-forest/95 p-4 backdrop-blur-sm";
  overlay.innerHTML = `<figure class="max-h-full max-w-5xl"><img alt="" class="max-h-[80vh] w-auto rounded-xl object-contain"/><figcaption class="mt-4 flex items-center justify-between text-sm text-oat/70"><span data-caption></span><span data-count class="tabular-nums"></span></figcaption></figure><button type="button" data-close class="absolute top-6 right-6 rounded-full bg-oat/10 px-4 py-2 text-sm text-oat ring-1 ring-oat/20 transition-colors hover:bg-oat/20">Zavřít</button>`;
  document.body.appendChild(overlay);
  const img = overlay.querySelector("img");
  const caption = overlay.querySelector("[data-caption]");
  const count = overlay.querySelector("[data-count]");
  const show = (i) => {
    index = (i + photos.length) % photos.length;
    img.src = photos[index].src;
    img.alt = photos[index].alt;
    caption.textContent = photos[index].alt;
    count.textContent = index + 1 + " / " + photos.length;
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
  };
  const close = () => {
    index = null;
    overlay.hidden = true;
    document.body.style.overflow = "";
  };
  buttons.forEach((b, i) => b.addEventListener("click", () => show(i)));
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay || e.target.closest("[data-close]")) close();
  });
  document.addEventListener("keydown", (e) => {
    if (index === null) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") show(index + 1);
    if (e.key === "ArrowLeft") show(index - 1);
  });
});
