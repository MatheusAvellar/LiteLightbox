document.addEventListener("DOMContentLoaded", function() {
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
	form.id = "llb-dialogform";

	//// Controls on the top-right of dialog window ////
	const topRightWrapper = document.createElement("div");
	topRightWrapper.id = "llb-top-right-controls-wrapper";
	form.appendChild(topRightWrapper);
	const closeBtn = document.createElement("button");
	closeBtn.id = "llb-closebtn";
	closeBtn.textContent = "Close image dialog.";
	topRightWrapper.appendChild(closeBtn);
	const openBtn = document.createElement("a");
	openBtn.id = "llb-openbtn";
	openBtn.textContent = "Open full image";
	topRightWrapper.appendChild(openBtn);
	////

	//// Previous + Next image buttons ////
	const prevBtn = document.createElement("button");
	prevBtn.id = "llb-prevbtn";
	prevBtn.textContent = "Previous image";
	form.appendChild(prevBtn);
	const nextBtn = document.createElement("button");
	nextBtn.id = "llb-nextbtn";
	nextBtn.textContent = "Next image";
	form.appendChild(nextBtn);
	////

	dialog.appendChild(form);
	////
	const figure = document.createElement("figure");
	figure.id = "llb-figure";
	const media = document.createElement("div");
	media.id = "llb-media";
	const figcaption = document.createElement("figcaption");
	figcaption.id = "llb-figcaption";

	figure.appendChild(media);
	figure.appendChild(figcaption);
	dialog.appendChild(figure);
	////
	document.body.appendChild(dialog);
	////
	// Iterate through all LLB triggers on the page
	for(const anchor of [...document.querySelectorAll("[data-llb-src]")]) {
		// Hijack anchor's click event
		anchor.addEventListener("click", function(event) {
			// Prevent anchor from leaving page
			event.preventDefault();
			// Trigger open modal
			openModal(anchor);
			// Return false to, again, hopefully prevent default anchor behavior
			return false;
		});
	}
	// Properties used for galleries
	const gallery_hdlr = {
		keyDown: false,
		goPrev: null,
		goNext: null
	};

	// Function run on `a[data-llb-src]` click
	function openModal(anchor) {
		let data = anchor.dataset;
		// Get the source
		let src = data.llbSrc;
		// If it's 'href', get it from anchor's 'href' attribute
		if(src === "href") src = anchor.href;

		// Create lightbox content
		// TODO: support more things beyond images
		const img = document.createElement("img");
		img.src = src;
		const first_child = anchor.firstElementChild;
		// If there's an alt text, copy it
		if("llbAlt" in data) {
			img.alt = data.llbAlt;
		} else if(first_child && "alt" in first_child) {
			// Otherwise, check if the first element has an alt text
			// If it does, copy that
			 img.alt = first_child.alt;
		}
		img.addEventListener("load", function() { figure.dataset.loaded = true; });
		img.addEventListener("error", function() { figure.dataset.loaded = true; });
		// Add image as first child of <figure> (inside <div>)
		media.appendChild(img);
		// If there's a caption, copy it to <figcaption>
		const caption = anchor.nextElementSibling;
		if(caption && "llbCaption" in caption.dataset) {
			for(const child of [...caption.cloneNode(true).childNodes]) {
				figcaption.appendChild(child);
			}
		}
		// Create 'open full-res' anchor href
		openBtn.href = src;

		// If this image is NOT part of a gallery
		if(!("llbGallery" in data)) {
			// Make sure prev/next buttons are hidden
			prevBtn.className = "";
			nextBtn.className = "";
			prevBtn.onclick = gallery_hdlr.goPrev = null;
			nextBtn.onclick = gallery_hdlr.goNext = null;
		}
		// Otherwise, if this image IS part of a gallery
		else {
			// Get all gallery items
			// TODO: different gallery types (via [data-llb-gallery="type"])
			const gallery_items = [...document.querySelectorAll("[data-llb-gallery]")];
			// Initialize some flags
			let has_found_us = false;
			let previous_anchor = null;
			let next_anchor = null;
			for(const element of gallery_items) {
				// If we've found the image that triggered this check
				if(element === anchor) {
					// Toggle a flag, and continue
					has_found_us = true;
					continue;
				}
				// If we've NOT found the image that triggered this check yet
				if(!has_found_us) {
					// This is an image in the gallery that comes BEFORE "us"
					// Save it, and keep going in case there's more
					previous_anchor = element;
					continue;
				}
				// Otherwise, we HAVE found the image that triggered this check
				// This is the first image in the gallery that comes AFTER "us"
				// Save it, and leave
				next_anchor = element;
				break;
			}

			// Toggle visibility of buttons that are useful to us
			prevBtn.className = (previous_anchor) ? "shown" : "";
			nextBtn.className = (next_anchor) ? "shown" : "";

			// On <button> click, the <form> tries to close itself
			// We first call .preventDefault() to prevent that
			// Then reset the contents of <dialog> via cleanupDialog()
			// Finally, we load the contents of the new anchor
			// And return false to, again, prevent default <form> behavior
			if(previous_anchor) {
				prevBtn.onclick = gallery_hdlr.goPrev = (evt) => {
					if(evt) evt.preventDefault();
					cleanupDialog();
					openModal(previous_anchor);
					return false;
				};
			} else {
				prevBtn.onclick = gallery_hdlr.goPrev = null;
			}
			if(next_anchor) {
				nextBtn.onclick = gallery_hdlr.goNext = (evt) => {
					if(evt) evt.preventDefault();
					cleanupDialog();
					openModal(next_anchor);
					return false;
				};
			} else {
				nextBtn.onclick = gallery_hdlr.goNext = null;
			}
		}

		// Prevent <body> scrolling while modal is open
		// In the future, this could be done with body:has(#llb-dialog[open])
		document.body.classList.add("llb-modal");
		// Open modal
		dialog.showModal();
		// Add hash to URL (so that back button doesn't leave page)
		window.history.pushState({},"","#lightbox");
	}

	window.addEventListener("popstate", (evt) => {
		// Attempts to close <dialog> on history back event.
		// If successful, triggers onclose event below;
		// If it has already closed, this is a no-op.
		dialog.close();
	});
	// Gallery previous/next on arrow key press
	window.addEventListener("keydown", (evt) => {
		// If IME is doing stuff, ignore it
		if(evt.isComposing || evt.keyCode === 229)
			return;

		if(!gallery_hdlr.keyDown) {
			if(evt.key === "ArrowLeft" && typeof gallery_hdlr.goPrev === "function") {
				gallery_hdlr.goPrev();
				gallery_hdlr.keyDown = true;
			}
			if(evt.key === "ArrowRight" && typeof gallery_hdlr.goNext === "function") {
				gallery_hdlr.goNext();
				gallery_hdlr.keyDown = true;
			}
		}
	});
	window.addEventListener("keyup", (evt) => {
		// If IME is doing stuff, ignore it
		if(evt.isComposing || evt.keyCode === 229)
			return;
		// Prevent multiple firings of the "same" key press
		if(evt.key === "ArrowLeft" || evt.key === "ArrowRight")
			gallery_hdlr.keyDown = false;
	});

	// Function to reset the contents of <dialog>
	function cleanupDialog() {
		// On <dialog> close, cleanup after ourselves
		[...media.children].forEach(el => el.remove());
		// Reactivate loading spinner by default
		figure.dataset.loaded = false;
		// Remove all child elements
		while(figcaption.childNodes.length) {
			figcaption.childNodes[0].remove();
		}
		// Cleanup 'open full-res' anchor href
		openBtn.href = "";
	}
	dialog.addEventListener("close", () => {
		// Reset <dialog> contents
		cleanupDialog();
		// Remove <body> styling
		document.body.classList.remove("llb-modal");
		// If the user hasn't pressed back to close the dialog
		if(location.hash == "#lightbox") {
			// Replace '#lightbox' with empty hash on URL
			window.history.replaceState({}, "", "#");
		}
	});
});
