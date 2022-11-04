(function LiteLightbox() {
  const dialog = document.createElement("dialog");
  if(typeof dialog.showModal !== "function") {
    console.warn("[LiteLightbox] The <dialog> API is not supported by this browser.");
    return;
  }
  dialog.id = "llb-dialog";
  ///
  const form = document.createElement("form");
  form.method = "dialog";
  form.id = "llb-closeform";
  const closeBtn = document.createElement("button");
  closeBtn.id = "llb-closebtn";
  closeBtn.textContent = "Close image dialog.";
  form.appendChild(closeBtn);
  const openBtn = document.createElement("a");
  openBtn.id = "llb-openbtn";
  openBtn.textContent = "Open full image";
  form.appendChild(openBtn);
  dialog.appendChild(form);
  ///
  const figure = document.createElement("figure");
  figure.id = "llb-figure";
  const figcaption = document.createElement("figcaption");
  figcaption.id = "llb-figcaption";
  figure.appendChild(figcaption);
  dialog.appendChild(figure);
  ///
  document.body.appendChild(dialog);

  for(const anchor of [...document.querySelectorAll("[data-llb]")]) {
    anchor.addEventListener("click", function(event) {
      event.preventDefault(); // Prevent anchor from changing page
      // Copy content
      if("llbSrc" in anchor.dataset) {
        const src = anchor.dataset["llbSrc"]
        switch(anchor.dataset.llb) {
          case "img":
          default:
            const img = document.createElement("img");
            img.src = src;
            img.setAttribute("data-llb-removeme", "");
            openBtn.href = src;
            figure.prepend(img);
        }
      } else {
        console.warn("[LiteLightbox] Missing `llb-src` parameter.");
      }
      // If there's a caption, copy it
      const caption = anchor.parentElement.querySelector("[data-llb-caption]");
      if(caption) {
        for(const child of [...caption.cloneNode(true).children]) {
          figcaption.appendChild(child);
        }
      }
      // 
      document.body.classList.add("llb-modal");
      dialog.showModal();
      return false;
    });
  }

  dialog.addEventListener("close", () => {
    [...dialog.querySelectorAll("[data-llb-removeme]")].forEach(el => el.remove());
    // Remove all child elements
    while(figcaption.childElementCount) {
      figcaption.removeChild(figcaption.firstElementChild);
    }
    // Remove <body> styling
    document.body.classList.remove("llb-modal");
  });
})();