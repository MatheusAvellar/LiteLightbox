(function LiteLightbox() {
  const dialog = document.createElement("dialog");
  dialog.id = "llb-dialog";
  // Leave if user-agent doesn't support <dialog> methods
  if(typeof dialog.showModal !== "function") {
    console.warn("[LiteLightbox] The <dialog> API is not supported by this browser.");
    return;
  }
  //// Create all the elements we'll need ////
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
  ////
  const figure = document.createElement("figure");
  figure.id = "llb-figure";
  const figcaption = document.createElement("figcaption");
  figcaption.id = "llb-figcaption";
  figure.appendChild(figcaption);
  dialog.appendChild(figure);
  ////
  document.body.appendChild(dialog);
  ////
  // Iterate through all LLB triggers on the page
  for(const anchor of [...document.querySelectorAll("[data-llb-src]")]) {
    // Get the source
    let src = anchor.dataset.llbSrc;
    // If it's 'href', get it from anchor's 'href' attribute
    if(src === "href") src = anchor.href;
    // Hijack anchor's click event
    anchor.addEventListener("click", function(event) {
      // Attempt to prevent anchor from leaving page
      event.preventDefault();
      // Create lightbox content
      // TODO: support more things beyond images
      const img = document.createElement("img");
      img.src = src;
      img.setAttribute("data-llb-removeme", ""); // We'll use this for cleanup
      // If there's an alt text, copy it
      if("llbAlt" in anchor.dataset) {
        img.alt = anchor.dataset.llbAlt;
      }
      // Add image as first child of <figure>
      figure.prepend(img);
      // If there's a caption, copy it to <figcaption>
      const caption = anchor.nextElementSibling;
      if(caption && "llbCaption" in caption.dataset) {
        for(const child of [...caption.cloneNode(true).childNodes]) {
          figcaption.appendChild(child);
        }
      }
      // Create 'open full-res' anchor href
      openBtn.href = src;
      // Prevent <body> scrolling while modal is open
      // In the future, this could be done with body:has(#llb-dialog[open])
      document.body.classList.add("llb-modal");
      // Open modal
      dialog.showModal();
      // Add hash to URL (so that back button doesn't leave page)
      window.history.pushState({},"","#lightbox");
      // Return false to, again, attempt to prevent anchor behavior
      return false;
    });
  }

  window.addEventListener("popstate", (evt) => {
    // Attempts to close <dialog> on history back event.
    // If successful, triggers onclose event below;
    // If it has already closed, this is a no-op.
    dialog.close();
  });
  dialog.addEventListener("close", () => {
    // On <dialog> close, cleanup after ourselves
    [...dialog.querySelectorAll("[data-llb-removeme]")].forEach(el => el.remove());
    // Remove all child elements
    while(figcaption.childNodes.length) {
      figcaption.childNodes[0].remove();
    }
    // Cleanup 'open full-res' anchor href
    openBtn.href = "";
    // Remove <body> styling
    document.body.classList.remove("llb-modal");
    // Do back() so we don't flood user's browsing history
    window.history.back();
  });
})();